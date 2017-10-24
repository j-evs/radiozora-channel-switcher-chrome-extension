let radiozoraTabId = null;

chrome.tabs.getAllInWindow(null, function(tabs){
	let radiozoraTab = tabs.find(tab => tab.url && isOzoraUrl(tab.url));
	if (radiozoraTab) {
		radiozoraTabId = radiozoraTab.id;
	}
});

chrome.tabs.onCreated.addListener(tab => {
	if (!radiozoraTabId && tab.url && isOzoraUrl(tab.url)) {
		radiozoraTabId = tab.id;
	}
});
chrome.tabs.onUpdated.addListener((id, upd, tab) => {
	if (!radiozoraTabId && tab.url && isOzoraUrl(tab.url)) {
		radiozoraTabId = tab.id;
	}
});

chrome.tabs.onRemoved.addListener(tabId => {
	if (radiozoraTabId && radiozoraTabId === tabId) {
		radiozoraTabId = null;
	}
});

chrome.commands.onCommand.addListener(function(command) {
	if (!radiozoraTabId && command !== 'radiozora-switch') return;
	getCurrentChannel(radiozoraTabId)
		.then((currentChannel) => {
			const newChannel = currentChannel === 'trance' ? 'chill' : 'trance';
			return setChannel(newChannel);
		})
		.catch((error) => {console.log(error)});
});

function getCurrentChannel(radiozoraTabId) {
	return new Promise((resolve, reject) => {
		return chrome.tabs.sendMessage(radiozoraTabId, {type: "GET_CURRENT_CHANNEL"}, (response) => {
			return response ? resolve(response) : reject('no active channel found');
		});
	});
}

function setChannel(newChannel) {
	return new Promise((resolve, reject) => {
		return chrome.tabs.sendMessage(radiozoraTabId, {type: "SET_CHANNEL", channel: newChannel}, (response) => {
			return resolve(newChannel);
		})
	})
}

function isOzoraUrl(url) {
	return url.indexOf('radiozora') !== -1;
}