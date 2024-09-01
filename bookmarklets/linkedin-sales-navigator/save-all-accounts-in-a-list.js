var qs = document.querySelector.bind(document);
var $ = jQuery;

var working = false;
var list_name;

const TIME_FOR_PAGE_TO_LOAD = 2000;
const TIME_AFTER_CLICK = 500;

var selectors = {
	select_all: '[data-sn-view-name="module-account-search-results"] > .p0 input[type="checkbox"]',
	list_of_list__opener: '.p4 > div > button[data-x--save-menu-trigger]',
	list_of_list__button: '#hue-web-menu-outlet [data-popper-placement="bottom"] button',
	pagination: '[data-sn-view-name="search-pagination"]',
	pagination_next: '[data-sn-view-name="search-pagination"] .artdeco-pagination__button--next',
	pagination_page_1: '[data-test-pagination-page-btn="1"] button',
};

function open_list_of_list(callback) {
	console.debug('Open List of Lists');

	if($(selectors.list_of_list__opener)[0].ariaExpanded == 'true') {
		console.debug("\t -> already open");
	} else {
		$(selectors.list_of_list__opener).click();
	}

	setTimeout(callback, TIME_AFTER_CLICK);
}

function close_list_of_list(callback) {
	console.debug('Close List of Lists');

	if($(selectors.list_of_list__opener)[0].ariaExpanded == 'false') {
		console.debug("\t -> already closed");
	} else {
		$(selectors.list_of_list__opener).click();
	}

	setTimeout(callback, TIME_AFTER_CLICK);
}

function it_was_last_page() {
	if($(selectors.pagination_next).is(':disabled')) {
		console.debug('It was the last page !');
		working = false;
		alert("I am finished daddy !");

		return true;
	}

	return false;
}

function do_magic_2() {
	console.debug('Checking ALL items');

	if($(selectors.select_all).is(':checked')) {
		console.debug("\t -> already selected");
	} else {
		$(selectors.select_all).click();
	}

	setTimeout(() => {
		open_list_of_list(() => {
			$(selectors.list_of_list__button).each((idx, button) => {
				var button_name = '';

				try {
					button_name = button.querySelector('._list-name_aii1oi').ariaLabel;
				} catch (e) {
					return;
				}

				if(list_name == button_name) {
					console.debug(`Found our LIST ! "${idx}/${button_name}". Selecting...`);
					button.click();

					setTimeout(() => {
						close_list_of_list(() => {
							if(it_was_last_page()) {
								return;
							}

							console.debug('Going to next page...');
							$(selectors.pagination_next).click();

							setTimeout(() => {
								do_magic_2();
							}, TIME_FOR_PAGE_TO_LOAD);
						});
					}, TIME_AFTER_CLICK);

					return false;
				}
			});
		});

	}, TIME_AFTER_CLICK);
}

$(document).on('click', selectors.list_of_list__button, (event) => {
	if(working)
		return;

	list_name = event.currentTarget.querySelector('._list-name_aii1oi').ariaLabel;

	console.debug(`A list was selected: "${list_name}"`);

	if(confirm(`Save ALL pages to this list: "${list_name}" ?`)) {
		working = true;

		close_list_of_list(() => {
			if('true' == $(selectors.pagination_page_1)[0].ariaCurrent) {
				console.debug('Already on page 1. Starting...');
			} else {
				console.debug('Going to page 1');
				$(selectors.pagination_page_1).click();
			}

			setTimeout(() => {
				do_magic_2();
			}, TIME_FOR_PAGE_TO_LOAD);
		});

		return false;
	}

	return true;
});

alert("Rock N Roll Baby ! I'm ready");
