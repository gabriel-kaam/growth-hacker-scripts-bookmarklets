var netscape = require('netscape-bookmarks');
var fs = require('fs');
var path = require('path');

var out_file = "build/bookmarklets.html";
var bookmarks = {};

function handle_thing(file_or_directory) {
  return fs.statSync(file_or_directory).isFile() ? handle_file(file_or_directory) : handle_directory(file_or_directory);
}

function parse_js_code(code) {
  return 'javascript:(function(){' + jquery_code + '; ' + code.replace(/\r?\n|\r/g, " ") + '})();';
}

function handle_file(file) {
  var data = fs.readFileSync(file, 'utf8');
  bookmarks[file] = parse_js_code(data);
}

function handle_directory(directory, callback) {
  var files = fs.readdirSync(directory);

  files.forEach(function(file) {
    handle_thing(path.join(directory, file));
  });

  if(callback) callback();
}

function loadJQueryFrom() {
  var data = fs.readFileSync('node_modules/jquery/dist/jquery.slim.min.js', 'utf8');
  return data;
}

var jquery_code = '';//loadJQueryFrom();

handle_directory("bookmarklets");

var html = netscape(bookmarks);
fs.writeFile(out_file, html, function() {
  console.log("[+] Wrote " + Object.keys(bookmarks).length + " bookmarks into '" + out_file + "'.");
});
