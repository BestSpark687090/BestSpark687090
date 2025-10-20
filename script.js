// Browser-only website checker
// Detects if websites are accessible (limitations: cannot detect redirects due to browser security)

async function checkWebsite(url) {
  try {
    // Try normal fetch first to get redirect info if CORS allows
    const response = await fetch(url, {
      method: 'HEAD',
      cache: 'no-cache',
      redirect: 'follow'
    });
    
    return {
      url: url,
      finalUrl: response.url,
      status: response.status,
      accessible: true,
      redirected: response.url !== url,
      message: response.url !== url ? `Redirected to ${response.url}` : 'Accessible (no redirect)',
      cors: true
    };
  } catch (error) {
    // If normal fetch fails, try no-cors mode to just check if site is up
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      
      // no-cors always returns opaque response, so we can't see the actual status
      // but if it completes without error, the site is probably accessible
      return {
        url: url,
        accessible: true,
        message: 'Site is accessible (no-cors mode - cannot detect redirects)',
        cors: false
      };
    } catch (noCorsError) {
      // Complete failure - site is likely down or unreachable
      return {
        url: url,
        accessible: false,
        message: `Failed to load: ${noCorsError.message}`,
        cors: false
      };
    }
  }
}

async function checkAllWebsites() {
  const links = document.querySelectorAll('.gradient a');
  
  // Remove old results if they exist
  const oldResults = document.getElementById('check-results');
  if (oldResults) {
    oldResults.remove();
  }
  
  const resultsDiv = document.createElement('div');
  resultsDiv.id = 'check-results';
  resultsDiv.style.cssText = 'margin: 20px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px;';
  
  const title = document.createElement('h3');
  title.textContent = 'Website Status Check';
  title.style.color = 'white';
  resultsDiv.appendChild(title);
  
  const statusDiv = document.createElement('div');
  statusDiv.style.cssText = 'margin-top: 10px; font-family: monospace; font-size: 14px;';
  resultsDiv.appendChild(statusDiv);
  
  document.querySelector('.gradient').appendChild(resultsDiv);
  
  let accessible = 0;
  let failed = 0;
  let redirected = 0;
  
  for (let link of links) {
    const href = link.href;
    
    if (href.includes(location.host)) {
      continue;
    }
    
    const statusLine = document.createElement('div');
    statusLine.style.cssText = 'margin: 5px 0; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 5px;';
    statusLine.innerHTML = `<span style="color: yellow;">⏳ Checking:</span> ${href}`;
    statusDiv.appendChild(statusLine);
    
    console.log(`Checking: ${href}`);
    
    const result = await checkWebsite(href);
    
    console.log('Result:', result);
    
    if (result.accessible) {
      accessible++;
      if (result.redirected) {
        redirected++;
        link.style.color = '#ffaa00';
        link.title = result.message;
        statusLine.innerHTML = `<span style="color: #ffaa00; font-size: 18px;">⚠️</span> <strong>${href}</strong><br><span style="font-size: 0.85em; color: #ffcc66;">REDIRECTED → ${result.finalUrl}</span>`;
      } else {
        link.style.color = '#00ff00';
        link.title = result.message;
        statusLine.innerHTML = `<span style="color: #00ff00; font-size: 18px;">✅</span> <strong>${href}</strong><br><span style="font-size: 0.85em; color: #aaffaa;">${result.message}</span>`;
      }
    } else {
      failed++;
      link.style.color = '#ff4444';
      link.title = result.message;
      statusLine.innerHTML = `<span style="color: #ff4444; font-size: 18px;">❌</span> <strong>${href}</strong><br><span style="font-size: 0.85em; color: #ffaaaa;">${result.message}</span>`;
    }
  }
  
  // Add summary
  const summary = document.createElement('div');
  summary.style.cssText = 'margin-top: 15px; padding: 10px; background: rgba(255,255,255,0.2); border-radius: 5px; font-weight: bold;';
  summary.innerHTML = `
    <div style="color: white;">Summary:</div>
    <div style="color: #00ff00;">✅ Accessible: ${accessible}</div>
    <div style="color: #ffaa00;">⚠️ Redirected: ${redirected}</div>
    <div style="color: #ff4444;">❌ Failed: ${failed}</div>
  `;
  resultsDiv.appendChild(summary);
  
  console.log('=== All checks complete ===');
  console.log(`Accessible: ${accessible}, Redirected: ${redirected}, Failed: ${failed}`);
}

// Make function available globally
window.checkWebsite = checkWebsite;
window.checkAllWebsites = checkAllWebsites;

// Add button when page loads
window.addEventListener('DOMContentLoaded', () => {
  console.log('=== Website Checker Script Loaded ===');
  console.log('Run checkAllWebsites() to test all links');
  
  const checkButton = document.createElement('button');
  checkButton.textContent = '🔍 Check All Websites';
  checkButton.style.cssText = 'margin: 10px auto; display: block; padding: 12px 24px; font-size: 16px; background: linear-gradient(135deg, #ff6600, #ff3300); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.3); transition: transform 0.2s;';
  checkButton.onmouseover = () => checkButton.style.transform = 'scale(1.05)';
  checkButton.onmouseout = () => checkButton.style.transform = 'scale(1)';
  checkButton.onclick = checkAllWebsites;
  
  const gradient = document.querySelector('.gradient');
  if (gradient) {
    gradient.insertBefore(checkButton, gradient.firstChild);
  }
});
