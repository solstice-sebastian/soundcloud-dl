console.log('you made it to soundcloud.com');

let isDownloading = false;

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const { url } = details;
    const endpoint = 'https://cf-hls-media.sndcdn.com/media';
    const urlParts = url.replace(endpoint, '').replace(/^\//, '').split('/');
    urlParts[0] = '0';
    urlParts[1] = '999999999999999';
    const dlUrl = [endpoint, ...urlParts].join('/');
    // send to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length && !isDownloading) {
        isDownloading = true;
        chrome.tabs.sendMessage(tabs[0].id, { ScDlUrl: dlUrl });
      } else {
        return { cancel: true }
      }
    });
  }, {
    urls: ["*://cf-hls-media.sndcdn.com/media/*"],
  },
  [
    "blocking"
  ]
);

chrome.runtime.onMessage.addListener((request) => {
  if (request && request.action && request.action === 'download') {
    chrome.downloads.download({
      url: request.url,
      filename: request.filename,
    });
  }
});
