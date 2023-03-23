let timeoutId;

function replaceThumbnail() {
  clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    chrome.storage.local.get(['thumbnail', 'replaceActive', 'customTitle'], (items) => {
      if (items.replaceActive && items.thumbnail) {
        const thumbnails = document.querySelectorAll('ytd-thumbnail img.yt-core-image--loaded:not(.replaced-thumbnail)');
        if (thumbnails.length > 0) {

          const randomIndex = Math.floor(Math.random() * Math.min(thumbnails.length, 7));

          thumbnails[randomIndex].src = items.thumbnail;
          thumbnails[randomIndex].srcset = '';
          thumbnails[randomIndex].classList.add('replaced-thumbnail');
          const videoTitle = thumbnails[randomIndex].closest('ytd-rich-item-renderer').querySelector('h3 #video-title');
          if (videoTitle && items.customTitle && items.customTitle.trim() !== '') {
            videoTitle.textContent = items.customTitle;
          }
        }
      }
    });
  }, 300);
}


function observeVisibleVideos() {
  const targetNodes = document.querySelectorAll('ytd-rich-item-renderer');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        replaceThumbnail();
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  targetNodes.forEach((node) => observer.observe(node));
}

document.addEventListener('readystatechange', () => {
  if (document.readyState === 'complete') {
    replaceThumbnail();
    observeVisibleVideos();
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'replaceActiveChanged' || request.type === 'thumbnailChanged' || request.type === 'customTitleChanged') {
    replaceThumbnail();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'refreshPage') {
    location.reload();
  }
});
