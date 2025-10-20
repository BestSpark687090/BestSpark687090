// Browser-only redirect detection script
// Uses iframe technique to check if websites are accessible/redirecting

async function checkWebsiteWithIframe(url) {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    
    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        document.body.removeChild(iframe);
        resolve({
          url: url,
          status: 'timeout',
          accessible: false,
          message: 'Timed out (may be blocked or slow)'
        });
      }
    }, 5000);
    
    iframe.onload = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        try {
          const iframeUrl = iframe.contentWindow.location.href;
          const redirected = iframeUrl !== url;
          document.body.removeChild(iframe);
          resolve({
            url: url,
            finalUrl: iframeUrl,
            status: 'loaded',
            accessible: true,
            redirected: redirected,
            message: redirected ? `Redirected to ${iframeUrl}` : 'No redirect detected'
          });
        } catch (e) {
          document.body.removeChild(iframe);
          resolve({
            url: url,
            status: 'loaded',
            accessible: true,
            redirected: false,
            message: 'Loaded (cannot check redirect due to CORS)'
          });
        }
      }
    };
    
    iframe.onerror = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        document.body.removeChild(iframe);
        resolve({
          url: url,
          status: 'error',
          accessible: false,
          message: 'Failed to load'
        });
      }
    };
    
    document.body.appendChild(iframe);
    iframe.src = url;
  });
}

async function checkWebsiteWithFetch(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache'
    });
    
    return {
      url: url,
      status: 'accessible',
      accessible: true,
      message: 'Accessible (no-cors mode - limited info)'
    };
  } catch (error) {
    return {
      url: url,
      status: 'error',
      accessible: false,
      message: `Error: ${error.message}`
    };
  }
}

async function checkAllWebsites() {
  const links = document.querySelectorAll('.gradient a');
  const resultsDiv = document.createElement('div');
  resultsDiv.id = 'check-results';
  resultsDiv.style.cssText = 'margin: 20px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px;';
  
  const title = document.createElement('h3');
  title.textContent = 'Website Status Check';
  title.style.color = 'white';
  resultsDiv.appendChild(title);
  
  const statusDiv = document.createElement('div');
  statusDiv.style.cssText = 'margin-top: 10px; font-family: monospace;';
  resultsDiv.appendChild(statusDiv);
  
  document.querySelector('.gradient').appendChild(resultsDiv);
  
  for (let link of links) {
    const href = link.href;
    
    if (href.includes(location.host)) {
      continue;
    }
    
    const statusLine = document.createElement('div');
    statusLine.style.cssText = 'margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 5px;';
    statusLine.innerHTML = `<span style="color: yellow;">⏳ Checking:</span> ${href}`;
    statusDiv.appendChild(statusLine);
    
    console.log(`Checking: ${href}`);
    
    const result = await checkWebsiteWithIframe(href);
    
    console.log('Result:', result);
    
    if (result.accessible) {
      link.style.color = '#00ff00';
      link.title = result.message;
      statusLine.innerHTML = `<span style="color: #00ff00;">✓</span> ${href}<br><span style="font-size: 0.8em; color: #aaa;">${result.message}</span>`;
      
      if (result.redirected) {
        link.style.color = '#ffaa00';
        statusLine.innerHTML = `<span style="color: #ffaa00;">⚠</span> ${href}<br><span style="font-size: 0.8em; color: #aaa;">REDIRECTED: ${result.finalUrl}</span>`;
      }
    } else {
      link.style.color = '#ff0000';
      link.title = result.message;
      statusLine.innerHTML = `<span style="color: #ff0000;">✗</span> ${href}<br><span style="font-size: 0.8em; color: #aaa;">${result.message}</span>`;
    }
  }
  
  console.log('=== All checks complete ===');
}

window.checkAllWebsites = checkAllWebsites;

window.addEventListener('DOMContentLoaded', () => {
  console.log('=== Redirect Detection Script Loaded ===');
  console.log('Click links to visit sites, or run checkAllWebsites() to test all');
  
  const checkButton = document.createElement('button');
  checkButton.textContent = '🔍 Check All Websites';
  checkButton.style.cssText = 'margin: 10px auto; display: block; padding: 10px 20px; font-size: 16px; background: #ff6600; color: white; border: none; border-radius: 5px; cursor: pointer;';
  checkButton.onclick = checkAllWebsites;
  
  const gradient = document.querySelector('.gradient');
  if (gradient) {
    gradient.insertBefore(checkButton, gradient.firstChild);
  }
});
