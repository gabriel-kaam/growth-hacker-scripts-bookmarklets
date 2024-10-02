console.debug("Hi daddy !");

const qs = document.querySelector.bind(document);

const selectors = {
	button_select: '.wbloks_59.wbloks_60 > div > .wbloks_1 > [role="button"]',
	button_archive: '[data-testid="reels_container_non_empty_state"] [data-testid="reels_container_non_empty_state"] + .wbloks_1 [role="button"] [role="button"]',
	button_archive_confirm: '._aac-._aad6',
	check_post: '[data-testid="reels_container_non_empty_state"] [data-testid="reels_container_non_empty_state"] [data-bloks-name="ig.components.Icon"]',
};

const WAIT_TIME = {
	AFTER_EACH_CHECK: 100,
};

const STARTING_URL = 'https://www.instagram.com/your_activity/photos_and_videos/reels';

function the_watcher() {
	console.debug("Things just ain't the same for gangstas");

	var interval = setInterval(() => {
		var select_button = qs(selectors.button_select);

		console.debug('Where are you daddy ?', select_button);

		if(!select_button) {
			return;
		}

		clearInterval(interval);

		select_button.click();

		setTimeout(start, 1000);
	}, 1000);
}

function start() {
	console.debug("Kiss me you fool !");

	setTimeout(() => {
		var $el = $(selectors.check_post);

		console.debug('check_post: ', $el.length);

		$el.each((i, e) => {
			setTimeout(() => { e.click(); }, i*WAIT_TIME.AFTER_EACH_CHECK);
		});

		setTimeout(() => {
			console.debug("Let's do this guys !");

			var $el = $(selectors.button_archive);

			$el.eq(1).click();

			setTimeout(() => {
				console.debug("BOOOOOM !");

				$(selectors.button_archive_confirm).click();

				setTimeout(the_watcher, 1000);
			}, 500);
		}, 1000 + $el.length*WAIT_TIME.AFTER_EACH_CHECK);

	}, 1000);
}

if(location.href == STARTING_URL) {
	the_watcher();
} else {
	if(confirm("You're not on the right page, should we go on Instagram ?")) {
		alert("Start me again once we're there !");
		location = STARTING_URL;
	}
}
