var qs = document.querySelector.bind(document);

var TIME_TO_WAIT = {
  FOR: {
    PROGRAM_WINDOW_TO_OPEN: 1500,
  },
  AFTER: {
    JOINING_A_PROGRAM: 2000,
  }
}

function join_one_program() {
  qs('[data-testid="join-button"]').click();

  setTimeout(function() {
    qs('.css-1bmdmec-center input').click();
    qs('[data-testid="button-join"]').click();

    setTimeout(join_one_program, TIME_TO_WAIT.AFTER.JOINING_A_PROGRAM);
  }, TIME_TO_WAIT.FOR.PROGRAM_WINDOW_TO_OPEN);
}

join_one_program();
