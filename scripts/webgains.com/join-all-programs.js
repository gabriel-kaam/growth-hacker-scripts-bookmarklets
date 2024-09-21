const qs = document.querySelector.bind(document);

const SELECTORS = {
  JOIN_BUTTON: '[data-testid="join-button"]',
  NEXT_PAGE_BUTTON: '.ant-pagination-next[aria-disabled="false"]',
  PROGRAM_INPUT: '.css-1bmdmec-center input',
  CONFIRM_JOIN_BUTTON: '[data-testid="button-join"]',
};

const TIME_TO_WAIT = {
  FOR: {
    PROGRAM_WINDOW_TO_OPEN: 1500,
    NEW_PAGE_TO_LOAD: 2000,
  },
  AFTER: {
    JOINING_A_PROGRAM: 2000,
  }
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 500;

async function clickElement(selector, actionDescription, successMessage, errorMessage, retries = MAX_RETRIES) {
  let element;
  while (retries > 0) {
    element = qs(selector);
    if (element) {
      console.debug(`[=] ${actionDescription}`);
      element.click();
      console.debug(`[+] ${successMessage}`);
      return true;
    }
    console.debug(`[-] ${errorMessage}. Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
    retries--;
    await wait(RETRY_DELAY);
  }
  console.debug(`[-] ${errorMessage}. All retries failed.`);
  return false;
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function attemptToJoinProgram() {
  const joinButton = qs(SELECTORS.JOIN_BUTTON);

  if (!joinButton) {
    console.debug(`[-] Join button not found. Checking for next page...`);
    const nextPageButton = qs(SELECTORS.NEXT_PAGE_BUTTON);

    if (!nextPageButton) {
      alert(`[+] No more pages. Process completed.`);
      return;
    }

    console.debug(`[=] Next page button found. Clicking to load the next page...`);
    nextPageButton.click();
    await wait(TIME_TO_WAIT.FOR.NEW_PAGE_TO_LOAD);
    return attemptToJoinProgram();
  }

  console.debug(`[=] Join button found. Attempting to join the program...`);
  joinButton.click();

  await wait(TIME_TO_WAIT.FOR.PROGRAM_WINDOW_TO_OPEN);

  if (await clickElement(SELECTORS.PROGRAM_INPUT,
    'Selecting the program...',
    'Program selected successfully.',
    'Failed to find program input.',
    MAX_RETRIES)) {

    if (await clickElement(SELECTORS.CONFIRM_JOIN_BUTTON,
      'Confirming join...',
      'Join confirmed successfully.',
      'Failed to find the join confirmation button.',
      MAX_RETRIES)) {

      console.debug(`[+] Program joined. Waiting to proceed to the next program...`);
      await wait(TIME_TO_WAIT.AFTER.JOINING_A_PROGRAM);
      return attemptToJoinProgram();
    }
  }
}

console.debug(`[=] Starting the program joining process...`);
attemptToJoinProgram();
