const tranceLink = document.getElementById('trancePlayer');
const chillLink = document.getElementById('chillPlayer');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	switch (request.type) {
		case 'GET_CURRENT_CHANNEL': {
			return sendResponse(getCurrentChannel());
		}
		case 'SET_CHANNEL': {
			const newChannel = request.channel;
			if (newChannel === 'trance') {
				tranceLink.click();
			} else {
				chillLink.click();
			}
			return sendResponse('OK');
		}
	}
});

function getCurrentChannel() {
	let activePlayer = document.querySelector('.player.playing .label');

	return activePlayer ? activePlayer.innerHTML.toLowerCase() : null;
}