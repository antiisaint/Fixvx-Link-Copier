const tweetCache = new Set();

function addLinkCopyButton() {
  const tweetHeaders = document.querySelectorAll('[data-testid="tweet"] [role="group"]');
  
  tweetHeaders.forEach(header => {
    const tweetElement = header.closest('[data-testid="tweet"]');
    if (tweetCache.has(tweetElement)) return;
    tweetCache.add(tweetElement);

    if (!header.querySelector('.copy-link-button')) {
      const linkButton = document.createElement('div');
      linkButton.className = 'copy-link-button';
      
      const imgElement = document.createElement('img');
      imgElement.src = chrome.runtime.getURL('images/link-icon.png');
      imgElement.className = 'copy-link-icon';
      linkButton.appendChild(imgElement);
      
      linkButton.addEventListener('click', function(event) {
        event.preventDefault();
        const tweetLink = tweetElement.querySelector('a[href*="/status/"]').href
          .replace(/(https?:\/\/)?(www\.)?(twitter\.com|x\.com)/, 'https://fixvx.com');
        
        navigator.clipboard.writeText(tweetLink).then(() => {
          const originalContent = linkButton.innerHTML;
          linkButton.innerHTML = getCheckmarkIcon();
          setTimeout(() => {
            linkButton.innerHTML = originalContent;
          }, 2000);
        });
      });
      
      header.insertBefore(linkButton, header.lastElementChild);
    }
  });
}

function getCheckmarkIcon() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="rgb(0, 255, 0)">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>`;
}

const style = document.createElement('style');
style.textContent = `
  .copy-link-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 8px;
  }
  .copy-link-icon {
    width: 18px;
    height: 18px;
  }
`;
document.head.appendChild(style);

addLinkCopyButton();

const observer = new MutationObserver(addLinkCopyButton);
observer.observe(document.body, { childList: true, subtree: true });