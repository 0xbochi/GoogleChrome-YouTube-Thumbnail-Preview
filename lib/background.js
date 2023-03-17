chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'setThumbnail') {
      chrome.storage.sync.set({ thumbnail: request.thumbnail });
    } else if (request.type === 'setReplaceActive') {
      chrome.storage.sync.set({ replaceActive: request.replaceActive });
    }
  });
  