var netscape = require('netscape-bookmarks');
var fs = require('fs');
var path = require('path');

var out_file = "build/bookmarklets.html";
var bookmarks = {};

const folder = 'bookmarklets';

function handle_thing(file_or_directory) {
  return fs.statSync(file_or_directory).isFile() ? handle_file(file_or_directory) : handle_directory(file_or_directory);
}

function parse_js_code(code) {
  return 'javascript:(function(){' + jquery_code + '; ' + code.replace(/\r?\n|\r/g, " ") + '})();';
}

function handle_file(file) {
  var data = fs.readFileSync(file, 'utf8');
  file.substring(folder.length + 1);
  bookmarks[file] = parse_js_code(data);
}

function handle_directory(directory, callback) {
  var files = fs.readdirSync(directory);

  files.forEach(function(file) {
    handle_thing(path.join(directory, file));
  });

  if(callback) callback();
}

var jquery_code = '';

handle_directory(folder);

var html = netscape(bookmarks);
fs.writeFile(out_file, html, function() {
  console.log("[+] Wrote " + Object.keys(bookmarks).length + " bookmarks into '" + out_file + "'.");
});
