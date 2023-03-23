const fileInput = document.getElementById('file-input');
const replaceActiveCheckbox = document.getElementById('replace-active');
const titleInput = document.getElementById('title-input');
const thumbnailPreview = document.getElementById('thumbnail-preview');

function updateThumbnailPreview(src) {
  thumbnailPreview.src = src;
  thumbnailPreview.style.display = src ? 'block' : 'none';
}

function onThumbnailChanged(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const base64 = reader.result;
      chrome.storage.local.set({ thumbnail: base64 }, () => {
        updateThumbnailPreview(base64);
        chrome.runtime.sendMessage({ type: 'thumbnailChanged' });
      });
    };
    reader.readAsDataURL(file);
  }
}

function onReplaceActiveChanged(event) {
  const replaceActive = event.target.checked;
  chrome.storage.local.set({ replaceActive }, () => {
    chrome.runtime.sendMessage({ type: 'replaceActiveChanged' });
  });
}

function onCustomTitleChanged(event) {
  const customTitle = event.target.value;
  chrome.storage.local.set({ customTitle }, () => {
    chrome.runtime.sendMessage({ type: 'customTitleChanged' });
  });
}

chrome.storage.local.get(['thumbnail', 'replaceActive', 'customTitle'], (items) => {
  if (items.thumbnail) {
    updateThumbnailPreview(items.thumbnail);
  }
  if (typeof items.replaceActive === 'boolean') {
    replaceActiveCheckbox.checked = items.replaceActive;
  }
  if (typeof items.customTitle === 'string') {
    titleInput.value = items.customTitle;
  }
});


const applyButton = document.getElementById('apply-button');
applyButton.addEventListener('click', () => {
  // Exécuter un script pour actualiser la page active
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: () => {
        location.reload();
      },
    });
  });
});



fileInput.addEventListener('change', onThumbnailChanged);
replaceActiveCheckbox.addEventListener('change', onReplaceActiveChanged);
titleInput.addEventListener('input', onCustomTitleChanged);
