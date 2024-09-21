function serialize( obj ) { return Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&') }

var we_are_working = false;
function invite_all_users() {
  if(true === we_are_working) return console.log('Already running');
  we_are_working = true;

  document.querySelectorAll('._6a._5j0d [ajaxify]').forEach(function(item) {
    var parser = new URL(item.getAttribute('ajaxify'), location);
    var xhr = new XMLHttpRequest();

    xhr.open('POST', '/pages/post_like_invite/send/?dpr=1');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
      var name = item.parentElement.parentElement.parentElement.parentElement.getElementsByTagName('a')[0].innerHTML;
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText.replace(/for \(;;\);/, ''));
        console.log('[+] OK. Name is ' + name + '. ' + response.errorSummary);

        if(response.error) throw response.error;
      }
      else if (xhr.status !== 200)
        console.log('[-] Failed. Name is ' + name);
    };
    xhr.send(serialize({
      'invitee': parser.searchParams.get('invitee'),
      'hash': parser.searchParams.get('hash'),
      'page_id': parser.searchParams.get('page_id'),
      'content_id': parser.searchParams.get('content_id'),
      'ext': '',
      'ref': 'likes_dialog',
      '__user': c_user,
      'fb_dtsg': document.getElementsByName('fb_dtsg')[0].value,
      '__a': '',
      '__dyn': '',
      '__req': '',
      '__be': '',
      '__pc': '',
      '__rev': '',
      'jazoest': '',
      '__spin_r': '',
      '__spin_b': '',
      '__spin_t': '',
    }));
  });

  we_are_working = false;
}

function kr_loop() {
  invite_all_users();

  var selector = document.getElementsByClassName('uiMorePagerPrimary');

  if(0 === selector.length) {
    console.log('[=] No more profiles to load');
  } else {
    console.log('[=] Loading more profiles ...');
    selector[0].click();

    window.setTimeout(kr_loop, 30000);
  }

}

var c_user;
cookieStore.get('c_user').then(function(cookie) {
  c_user = cookie.value;
  kr_loop();
});
