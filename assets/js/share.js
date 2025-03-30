/**
 * Initializes share button functionality
 */
function initShareButton() {

    const shareButton = document.getElementById('share-button');
    const shareMenu = document.getElementById('share-menu');
    
    if (!shareButton || !shareMenu) return;
    
    // Toggle share menu when share button is clicked
    shareButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        shareMenu.classList.toggle('active');
        
        // Close menu when clicking outside
        function closeMenu(event) {
            if (!shareMenu.contains(event.target) && event.target !== shareButton) {
                shareMenu.classList.remove('active');
                document.removeEventListener('click', closeMenu);
            }
        }
        
        // Add event listener with a slight delay to prevent immediate closing
        setTimeout(function() {
            document.addEventListener('click', closeMenu);
        }, 10);
    });
    
    // Get current page title and URL
    const pageTitle = encodeURIComponent(document.title);
    const pageUrl = encodeURIComponent(window.location.href);
    
    // Set up share links
    document.getElementById('share-x').href = `https://x.com/intent/tweet?url=${pageUrl}`;
    document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    document.getElementById('share-linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
    
    // Email sharing
    document.getElementById('share-email').href = `mailto:?subject=${pageTitle}&body=${pageUrl}`;
    
    // Set up copy link button
    document.getElementById('share-copy').addEventListener('click', function(e) {
        e.preventDefault();
        copyToClipboard(window.location.href);
        
        // Add active state for visual feedback
        this.style.backgroundColor = '#e0e0e0';
        
        // Show feedback
        const originalText = this.querySelector('span').textContent;
        this.querySelector('span').textContent = 'Copied!';
        setTimeout(() => {
            this.querySelector('span').textContent = originalText;
            this.style.backgroundColor = '';
            shareMenu.classList.remove('active');
        }, 1500);
    });
    
    // Log initialization for debugging
    console.log('Share button initialized');
}

/**
 * Copies text to clipboard
 * @param {string} text - The text to copy
 */
function copyToClipboard(text) {
    // Modern clipboard API method
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Could not copy text: ', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

/**
 * Fallback method for copying to clipboard
 * @param {string} text - The text to copy
 */
function fallbackCopyToClipboard(text) {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
    }
    
    document.body.removeChild(textArea);
}

// Initialize share button when the page is loaded
// document.addEventListener('DOMContentLoaded', initShareButton);
initShareButton();