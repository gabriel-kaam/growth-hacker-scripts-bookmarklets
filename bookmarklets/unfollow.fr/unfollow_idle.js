var how_much;
if(how_much = prompt('how much', 100)) {
  $('.left .unfollow:visible').slice(-how_much).click();
}
