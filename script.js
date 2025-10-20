// Redirect Detection Script
// Checks if websites redirect to different URLs

async function checkRedirect(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      cache: 'no-cache',
      redirect: 'follow'
    });
    
    // Check if the final URL is different from the original
    const finalUrl = response.url;
    const isRedirected = finalUrl !== url;
    
    return {
      originalUrl: url,
      finalUrl: finalUrl,
      redirected: isRedirected,
      status: response.status,
      success: true
    };
  } catch (error) {
    // Handle CORS errors or network failures
    return {
      originalUrl: url,
      finalUrl: null,
      redirected: false,
      status: null,
      success: false,
      error: error.message
    };
  }
}

// Check all links on the page
async function checkAllLinks() {
  const links = document.querySelectorAll('.gradient a');
  const results = [];
  
  for (let link of links) {
    const href = link.href;
    
    // Skip same-origin links
    if (href.includes(location.host)) {
      continue;
    }
    
    console.log(`Checking: ${href}`);
    const result = await checkRedirect(href);
    
    if (result.success) {
      if (result.redirected) {
        console.log(`✗ REDIRECTED: ${result.originalUrl} → ${result.finalUrl}`);
        link.classList.add('blocked');
        link.style.color = 'red';
      } else {
        console.log(`✓ NO REDIRECT: ${result.originalUrl}`);
        link.classList.add('unblocked');
        link.style.color = 'green';
      }
    } else {
      console.log(`⚠ ERROR checking ${result.originalUrl}: ${result.error}`);
      link.style.color = 'orange';
    }
    
    results.push(result);
  }
  
  return results;
}

// Function to check a single URL (can be called manually)
window.checkRedirect = checkRedirect;
window.checkAllLinks = checkAllLinks;

// Auto-run on page load
window.addEventListener('DOMContentLoaded', () => {
  console.log('=== Redirect Detection Script Loaded ===');
  console.log('Checking all links for redirects...');
  checkAllLinks().then(results => {
    console.log('=== Check Complete ===');
    console.log(`Total links checked: ${results.length}`);
    const redirected = results.filter(r => r.redirected).length;
    const failed = results.filter(r => !r.success).length;
    console.log(`Redirected: ${redirected}, Failed: ${failed}`);
  });
});
