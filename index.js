const netscape = require('netscape-bookmarks');
const fs = require('fs');
const path = require('path');
const terser = require('terser');

const outputFilePath = "bookmarklets.html";
const bookmarks = {};
const bookmarkletsFolder = 'bookmarklets';

async function minifyAndEncodeJavaScript(code) {
  const minifiedResult = await terser.minify(code, {
    compress: true,
    mangle: true,
    output: {
      comments: false
    }
  });

  if (minifiedResult.error) {
    throw new Error(`Minification error: ${minifiedResult.error}`);
  }

  return minifiedResult.code
    .replace(/"/g, '%22')
    .replace(/\r?\n|\r/g, " ");
}

async function processJavaScriptFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const encodedScript = await minifyAndEncodeJavaScript(fileContent);
  const bookmarkKey = filePath.substring(bookmarkletsFolder.length + 1);

  bookmarks[bookmarkKey] = `javascript:(function(){${global.jqueryCode};${encodedScript}})();`;
}

async function traverseDirectory(directoryPath) {
  const items = fs.readdirSync(directoryPath);

  for (const item of items) {
    const fullPath = path.join(directoryPath, item);

    if (fs.statSync(fullPath).isFile()) {
      await processJavaScriptFile(fullPath);
    } else {
      await traverseDirectory(fullPath);
    }
  }
}

async function generateBookmarklets() {
  global.jqueryCode = await minifyAndEncodeJavaScript(
    fs.readFileSync(path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'), 'utf8')
  );

  await traverseDirectory(bookmarkletsFolder);

  const bookmarksHtml = netscape(bookmarks);
  fs.writeFile(outputFilePath, bookmarksHtml, () =>
    console.log(`[+] Wrote ${Object.keys(bookmarks).length} bookmarks into '${outputFilePath}'.`)
  );
}

generateBookmarklets();
