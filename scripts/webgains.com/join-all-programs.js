var qs = document.querySelector.bind(document);

var TIME_TO_WAIT = {
  FOR: {
    PROGRAM_WINDOW_TO_OPEN: 1500,
    NEW_PAGE_TO_LOAD: 1500,
  },
  AFTER: {
    JOINING_A_PROGRAM: 2000,
  }
}

function join_one_program() {
  var join_button = qs('[data-testid="join-button"].test');

  if(!join_button) {
    var next_page_button = qs('.ant-pagination-next');

    if(!next_page_button) {
      alert('DONE !');
      return;
    }

    next_page_button.click();
    setTimeout(join_one_program, TIME_TO_WAIT.AFTER.NEW_PAGE_TO_LOAD);

    return;
  }

  join_button.click();

  setTimeout(function() {
    qs('.css-1bmdmec-center input').click();
    qs('[data-testid="button-join"]').click();

    setTimeout(join_one_program, TIME_TO_WAIT.AFTER.JOINING_A_PROGRAM);
  }, TIME_TO_WAIT.FOR.PROGRAM_WINDOW_TO_OPEN);
}

join_one_program();
