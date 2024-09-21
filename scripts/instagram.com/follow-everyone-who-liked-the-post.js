function getDiv() {
  var div = document.querySelector('._ab8w._ab94._ab99._ab9f._ab9m._ab9o._ab9s');
  return div ? div.firstChild : null;
}

function getNextLink() {
  return document.querySelector('._acan._acap._acas');
}

while(!(div = getDiv())) {
  console.debug('Popup was not found. Opening then sleeping for 2 secs...')
  document.querySelector('._aacl._aaco._aacw._aacx._aada._aade').click();
  // TODO: we need to sleep for 2s here
}
console.debug('Popup was found. Resuming...')

var i = 0; var j = 0;

do {
  link = getNextLink();

  console.debug('Link is', link);

  link.click();
  console.log(`Followed ${++j}/${i}: done`);

  div.scrollTop = div.scrollHeight;
  // TODO: we need to sleep for 2s here
} while(link);
