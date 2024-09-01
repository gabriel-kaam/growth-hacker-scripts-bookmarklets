var netscape = require('netscape-bookmarks');
var fs = require('fs');
var path = require('path');
var terser = require('terser');

var out_file = "build/bookmarklets.html";
var bookmarks = {};

const folder = 'bookmarklets';

function handle_thing(file_or_directory) {
  return fs.statSync(file_or_directory).isFile() ? handle_file(file_or_directory) : handle_directory(file_or_directory);
}

async function parse_js_code(code) {
  let minified = await terser.minify(code);
  if (minified.error) {
    throw new Error(`Error during minification: ${minified.error}`);
  }

  // Dynamically load jQuery if not already present
  const jquery_loader = `
    (function(){
      if (typeof jQuery == 'undefined') {
        var script = document.createElement('script');
        script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
        document.head.appendChild(script);
        script.onload = function() { ${minified.code} };
      } else {
        ${minified.code}
      }
    })();
  `;

  return 'javascript:' + encodeURIComponent(jquery_loader.replace(/\r?\n|\r/g, " "));
}

async function handle_file(file) {
  var data = fs.readFileSync(file, 'utf8');
  var parsed_code = await parse_js_code(data);
  file = file.substring(folder.length + 1);
  bookmarks[file] = parsed_code;
}

async function handle_directory(directory, callback) {
  var files = fs.readdirSync(directory);

  for (const file of files) {
    await handle_thing(path.join(directory, file));
  }

  if (callback) callback();
}

(async () => {
  await handle_directory(folder);

  var html = netscape(bookmarks);
  fs.writeFile(out_file, html, function() {
    console.log("[+] Wrote " + Object.keys(bookmarks).length + " bookmarks into '" + out_file + "'.");
  });
})();
