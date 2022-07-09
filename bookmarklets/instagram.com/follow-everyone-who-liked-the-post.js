function getDiv() {
  return document.querySelector('._ab8w._ab94._ab99._ab9f._ab9m._ab9o._ab9s').firstChild;
}

if(!getDiv()) {
  document.querySelector('._aacl._aaco._aacw._aacx._aada._aade').click();
}

var i = 0; var j = 0;
var div = getDiv();

div.scrollTop = div.scrollHeight;

document.querySelectorAll('._acan._acap._acas').forEach((e) => {
  setTimeout(function() {
    div.scrollTop = div.scrollHeight;
    e.click();
    console.log(`Followed ${++j}/${i}: done`);
  }, ++i*2000);
});
