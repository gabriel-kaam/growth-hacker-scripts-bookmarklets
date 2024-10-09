async function markUnreachableContacts() {
    const delays = {
        redirect: 2000,
        scroll: 2000,
        action: 1000,
        elementTimeout: 5000
    };

    if (window.location.href !== 'https://app.lagrowthmachine.com/tasks/calls') {
        console.debug('Redirecting to the correct page');
        window.location.href = 'https://app.lagrowthmachine.com/tasks/calls';
        await sleep(delays.redirect);
        return;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitForElement(selector, timeout = delays.elementTimeout) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await sleep(500);
        }
        return null;
    }

    async function loadAllConversations() {
        const conversationsWrapper = document.querySelector('.conversations_wrapper');
        let prevConversationCount = 0;
        let currentConversationCount = document.querySelectorAll('.conversation').length;

        while (currentConversationCount > prevConversationCount) {
            prevConversationCount = currentConversationCount;
            conversationsWrapper.scrollTop = conversationsWrapper.scrollHeight;
            await sleep(delays.scroll);
            currentConversationCount = document.querySelectorAll('.conversation').length;
            console.debug(`Loaded ${currentConversationCount} conversations.`);
        }
        console.debug('All conversations loaded.');
    }

    await loadAllConversations();

    const processedConversations = new Set();
    let conversations = document.querySelectorAll('.conversation');

    for (let conversation of conversations) {
        const nameElement = conversation.querySelector('.line1');
        const name = nameElement ? nameElement.innerText.split("\n")[0] : "Unknown";

        if (processedConversations.has(name)) {
            console.debug(`Already processed conversation: ${name}, skipping.`);
            continue;
        }

        console.debug(`Processing conversation: ${name}`);
        processedConversations.add(name);

        conversation.click();
        await sleep(delays.action);

        const itemPhone = await waitForElement('#item_phone');
        if (!itemPhone) {
            console.debug(`Phone details not found for ${name}, skipping.`);
            continue;
        }

        const phoneNumber = itemPhone.value.trim();
        if (phoneNumber) {
            console.debug(`Phone number found for ${name}: ${phoneNumber}`);
        } else {
            console.debug(`Phone number empty for ${name}, marking as unreachable.`);

            const snoozeDropdown = document.querySelector('.snooze_complete_wrapper > .btn');
            if (snoozeDropdown) {
                snoozeDropdown.click();
                await sleep(delays.action);

                const completeDiv = await waitForElement('.complete');
                if (completeDiv) {
                    const clickableItems = completeDiv.querySelectorAll('.item.clickable');
                    if (clickableItems.length >= 2) {
                        clickableItems[1].click();
                        console.debug(`Marked ${name} as unreachable.`);
                        await sleep(delays.action);
                    } else {
                        console.debug(`Clickable items not found in complete div for ${name}.`);
                    }
                } else {
                    console.debug(`Complete div not found for ${name}.`);
                }
            } else {
                console.debug(`Snooze dropdown not found for ${name}.`);
            }
        }

        conversations = document.querySelectorAll('.conversation');
    }

    console.debug('All conversations processed.');
}


markUnreachableContacts();
