document.addEventListener('DOMContentLoaded', function() {
    // Get the post name from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const postCategory = urlParams.get('category');
    const postName = urlParams.get('name');

    if (!postCategory) {
        showError('No category specified');
        return;
    }
    
    if (!postName) {
        showError('No post specified');
        return;
    }

    const categoryLink = document.querySelector('.post-category');
    categoryLink.innerHTML = `<a href="/blogs/${postCategory}">${postCategory.charAt(0).toUpperCase() + postCategory.slice(1)}</a>`;
    
    // Configure MathJax
    window.MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']]
        }
    };
    
    // Load the markdown content
    fetch(`${postCategory}/${postName}/content.md`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not load post: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(markdownText => {
            // Parse front matter and content
            const { frontMatter, content } = parseFrontMatter(markdownText);
            
            if (!frontMatter) {
                showError('Invalid post format: Missing front matter');
                return;
            }
            
            // Update title
            document.title = frontMatter.title + ' - My GitHub Blog';
            
            // Update post header
            document.querySelector('.post-title').textContent = frontMatter.title;
            
            // Format date
            if (frontMatter.date) {
                const date = new Date(frontMatter.date);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                document.querySelector('.post-date').textContent = date.toLocaleDateString('en-US', options);
            } else {
                document.querySelector('.post-date').style.display = 'none';
            }
            
            // Add tags
            const tagsContainer = document.querySelector('.post-tags');
            
            if (frontMatter.tags && Array.isArray(frontMatter.tags)) {
                frontMatter.tags.forEach(tag => {
                    const tagElement = document.createElement('span');
                    tagElement.className = 'tag';
                    tagElement.textContent = tag;
                    tagsContainer.appendChild(tagElement);
                });
            } else if (frontMatter.tags && typeof frontMatter.tags === 'string') {
                // Handle case where tags might be a comma-separated string
                const tagsList = frontMatter.tags.split(/,\s*/);
                tagsList.forEach(tag => {
                    const tagElement = document.createElement('span');
                    tagElement.className = 'tag';
                    tagElement.textContent = tag;
                    tagsContainer.appendChild(tagElement);
                });
            } else {
                tagsContainer.style.display = 'none';
            }
            
            // Process image URLs before rendering markdown
            const processedContent = processImageUrls(content, postCategory, postName);
            
            // Render markdown content
            document.querySelector('.post-content').innerHTML = marked.parse(processedContent);
            
            // Render LaTeX if MathJax is available
            if (window.MathJax) {
                // Wait for MathJax to be fully loaded
                const checkMathJax = setInterval(function() {
                    if (window.MathJax.typesetPromise) {
                        clearInterval(checkMathJax);
                        window.MathJax.typesetPromise([document.querySelector('.post-content')])
                            .catch(err => {
                                console.error('MathJax error:', err);
                            });
                    }
                }, 100);
                
                // Add a timeout to prevent infinite checking
                setTimeout(function() {
                    clearInterval(checkMathJax);
                    console.log('Timed out waiting for MathJax to load completely');
                }, 5000);
            }
            
            // Remove loading indicator
            // document.querySelector('.loading').style.display = 'none';
        })
        .catch(error => {
            console.error('Error loading post:', error);
            showError(error.message);
        });
});