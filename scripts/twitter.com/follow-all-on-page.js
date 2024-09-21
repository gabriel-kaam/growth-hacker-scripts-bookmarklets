[].forEach.call(document.getElementsByClassName('GridTimeline-items'), function(el1) {
  [].forEach.call(el1.getElementsByClassName('not-following'), function(el2) {
    el2.getElementsByClassName('follow-button')[0].click();
  });
});
