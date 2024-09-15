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
      let extension = fullPath.split('.').pop();

      if('js' == extension) {
        console.debug(`Working on ${fullPath}`);
        await processJavaScriptFile(fullPath);
      }
    } else {
      await traverseDirectory(fullPath);
    }
  }
}

function insertCustomHtml(netscapeOutput) {
  const insertionPoint = netscapeOutput.indexOf('<H1>Bookmarks Menu</H1>');
  const customContent = `
<link rel="stylesheet" href="https://gabriel-kaam.github.io/growth-hacker-scripts-bookmarklets/assets/css/style.css?v=1380f8ded3bafb61521c942c3a819086ddc77a06">

<style>
  .markdown-body dl dt {
    font-style: normal;
    font-weight: normal;
  }
</style>

<div class="container-lg px-3 my-5 markdown-body">
`;

  if (insertionPoint !== -1) {
    return netscapeOutput.slice(0, insertionPoint) + customContent + netscapeOutput.slice(insertionPoint);
  }

  return netscapeOutput;
}

async function generateBookmarklets() {
  console.debug('Getting jQuery code');
  global.jqueryCode = await minifyAndEncodeJavaScript(
    fs.readFileSync(path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'), 'utf8')
  );

  await traverseDirectory(bookmarkletsFolder);

  let bookmarksHtml = netscape(bookmarks);
  bookmarksHtml = insertCustomHtml(bookmarksHtml);

  fs.writeFile(outputFilePath, bookmarksHtml, () =>
    console.log(`[+] Wrote ${Object.keys(bookmarks).length} bookmarks into '${outputFilePath}'.`)
  );
}

generateBookmarklets();
