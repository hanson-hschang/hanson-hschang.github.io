/**
 * Parses YAML front matter from markdown text
 * @param {string} text - The markdown text with front matter
 * @return {object} An object containing frontMatter and content
 */
function parseFrontMatter(text) {
    const result = { content: text, frontMatter: null };
    
    // Check if the text starts with '---'
    if (!text.startsWith('---')) {
        return result;
    }
    
    // Find the end of the front matter
    const endIndex = text.indexOf('---', 3);
    if (endIndex === -1) {
        return result;
    }
    
    // Extract the front matter text
    const frontMatterText = text.substring(3, endIndex).trim();
    
    // Parse the YAML front matter
    try {
        const frontMatter = {};
        frontMatterText.split('\n').forEach(line => {
            // Skip comments and empty lines
            if (line.startsWith('#') || !line.trim()) return;
            
            // Split by first colon
            const colonIndex = line.indexOf(':');
            if (colonIndex === -1) return;
            
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // Remove quotes if present
            if ((value.startsWith("'") && value.endsWith("'")) || 
                (value.startsWith('"') && value.endsWith('"'))) {
                value = value.substring(1, value.length - 1);
            }
            
            // Handle arrays
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.substring(1, value.length - 1)
                    .split(',')
                    .map(v => v.trim())
                    .filter(v => v.length > 0);
            }
            
            frontMatter[key] = value;
        });
        
        result.frontMatter = frontMatter;
        result.content = text.substring(endIndex + 3).trim();
    } catch (error) {
        console.error('Error parsing front matter:', error);
    }
    
    return result;
}

/**
 * Processes image URLs in markdown content
 * @param {string} content - The markdown content
 * @param {string} postCategory - The category of the post
 * @param {string} postName - The name of the post (folder)
 * @return {string} Processed markdown with correct image paths
 */
function processImageUrls(content, postCategory, postName) {
    return content.replace(/!\[(.*?)\]\((.*?)\)/g, function(match, altText, imagePath) {
        // Skip URLs that already have http://, https://, or start with /
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
            return match;
        }
        
        // Replace the path with the correct path including the post name
        return `![${altText}](${postCategory}/${postName}/${imagePath})`;
    });
}

/**
 * Shows an error message in the main content area
 * @param {string} message - The error message to display
 */
function showError(message) {
    document.querySelector('.loading').style.display = 'none';
    document.querySelector('.post-header').style.display = 'none';
    
    const errorElement = document.createElement('div');
    errorElement.id = 'error-message';
    errorElement.innerHTML = `<h2>Error</h2><p>${message}</p><p><a href="../index.html">Return to home</a></p>`;
    
    document.querySelector('main').appendChild(errorElement);
}