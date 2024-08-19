const blockedSites = ['facebook.com', 'twitter.com', 'instagram.com'];
let allowedTime = 0;

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
  if (shouldBlockSite(details.url)) {
    if (allowedTime > 0) {
      allowedTime -= 1;
    } else {
      chrome.tabs.update(details.tabId, {url: 'blocked.html'});
    }
  }
});

function shouldBlockSite(url) {
  return blockedSites.some(site => url.includes(site));
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'taskCompleted') {
    allowedTime += 10; // Allow 10 minutes of access
  }
});