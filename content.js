let isDownloading = false;

chrome.runtime.onMessage.addListener((request) => {
  if (request.ScDlUrl && !isDownloading) {
    isDownloading = true;
    console.log('creating download link with src', request.ScDlUrl);
    const button = document.createElement('button');
    button.innerText = 'Download Track';
    button.addEventListener('click', () => {
      const artist = document.querySelector('.soundTitle__username').innerText;
      const trackname = document.querySelector('.soundTitle__title').innerText;
      chrome.runtime.sendMessage({ action: 'download', url: request.ScDlUrl, filename: `${artist} - ${trackname}.mp3` });
    });
    button.classList.add(...['sc-button', 'sc-button-medium', 'sc-button-responsive']);
    const buttonGroup = document.querySelector('.sc-button-group');
    buttonGroup.appendChild(button);
  }
});