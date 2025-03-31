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
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      tags: 'ams',
      tagSide: 'right',
      tagIndent: '0.8em',
      processEscapes: true,
      processEnvironments: true,
      packages: {'[+]': ['noerrors', 'ams']}
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      ignoreHtmlClass: 'tex2jax_ignore',
      processHtmlClass: 'tex2jax_process'
    },
    chtml: {
      scale: 1,
      minScale: 0.5,
      mtextInheritFont: false,
      displayAlign: 'center',
      displayIndent: '0',
      adaptiveCSS: true
    },
    svg: {
      scale: 1,
      minScale: 0.5,
      mtextInheritFont: false,
      displayAlign: 'center',
      displayIndent: '0',
      adaptiveCSS: true
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
    const processedContent = processImageUrls(content, postName);

    // Protect LaTeX content from Markdown processing
    const { content: protectedContent, latexBlocks } = protectLatexContent(processedContent);

    // Render markdown content
    const renderedHtml = marked.parse(protectedContent);

    // Restore LaTeX content 
    const finalHtml = restoreLatexContent(renderedHtml, latexBlocks);

    // Update the DOM with the final HTML
    document.querySelector('.post-content').innerHTML = finalHtml;
    
    // If MathJax already loaded, trigger a typeset
    // if (window.MathJax) {
    //   try {
    //     if (window.MathJax.typeset) {
    //       window.MathJax.typeset();
    //       setupEquationScrollbars();
    //     } else if (window.MathJax.typesetPromise) {
    //       window.MathJax.typesetPromise().then(() => {
    //         setupEquationScrollbars();
    //       });
    //     }
    //   } catch (e) {
    //     console.error('MathJax typeset error:', e);
    //   }
    // } else {
    //   // If MathJax isn't loaded yet, try again when it loads
    //   window.addEventListener('load', function() {
    //     if (window.MathJax && (window.MathJax.typeset || window.MathJax.typesetPromise)) {
    //       try {
    //         if (window.MathJax.typeset) {
    //           window.MathJax.typeset();
    //           setupEquationScrollbars();
    //         } else if (window.MathJax.typesetPromise) {
    //           window.MathJax.typesetPromise().then(() => {
    //             setupEquationScrollbars();
    //           });
    //         }
    //       } catch (e) {
    //         console.error('MathJax typeset error:', e);
    //       }
    //     }
    //   });
    // }
    
    // Remove loading indicator
    // document.querySelector('.loading').style.display = 'none';
  })
  .catch(error => {
    console.error('Error loading post:', error);
    showError(error.message);
  });
});

function protectLatexContent(content) {
  // Store LaTeX blocks to prevent Markdown processing
  const latexBlocks = [];
  
  // Replace display math blocks ($$...$$) with placeholders
  content = content.replace(/\$\$([\s\S]*?)\$\$/g, function(match, latex) {
      // Normalize the LaTeX content
      const normalizedLatex = normalizeLatexContent(latex);
      const normalizedMatch = '$$' + normalizedLatex + '$$';
      latexBlocks.push(normalizedMatch);
      return `LATEXBLOCK${latexBlocks.length - 1}`;
  });
  
  // Replace inline math blocks ($...$) with placeholders
  content = content.replace(/\$([^\$]*?)\$/g, function(match, latex) {
      latexBlocks.push(match);
      return `LATEXINLINE${latexBlocks.length - 1}`;
  });
  
  return { content, latexBlocks };
}

function restoreLatexContent(html, latexBlocks) {
  // Restore display math blocks
  html = html.replace(/LATEXBLOCK(\d+)/g, function(match, index) {
      return latexBlocks[parseInt(index)];
  });
  
  // Restore inline math blocks
  html = html.replace(/LATEXINLINE(\d+)/g, function(match, index) {
      return latexBlocks[parseInt(index)];
  });
  
  return html;
}

function normalizeLatexContent(latex) {
  // Convert double backslashes to triple backslashes temporarily to avoid confusion
  let normalized = latex.replace(/\\\\/g, '\\\\\\');
  
  // Replace quadruple backslashes (which would have come from \\\\ in the original) with double backslashes
  normalized = normalized.replace(/\\\\\\\\/g, '\\\\');
  
  // Convert the temporary triple backslashes back to double backslashes
  normalized = normalized.replace(/\\\\\\/g, '\\\\');
  
  return normalized;
}

function setupEquationScrollbars() {
  // Wait longer for MathJax to fully complete rendering
  setTimeout(() => {
      // Find all display equations
      const equations = document.querySelectorAll('.post-content .mjx-chtml.MJXc-display');
      console.log('Found equations:', equations.length);
      
      equations.forEach(equation => {
          // Check if this equation has a number
          const hasNumber = equation.querySelector('.mjx-right');
          
          if (hasNumber && equation.scrollWidth > equation.clientWidth) {
              console.log('Found long numbered equation that needs scrollbar');
              
              // Create a wrapper div for horizontal scrolling
              const scrollWrapper = document.createElement('div');
              scrollWrapper.style.overflow = 'auto';
              scrollWrapper.style.maxWidth = '100%';
              scrollWrapper.style.position = 'relative';
              scrollWrapper.style.padding = '0.5em 0';
              
              // Clone the equation without the number
              const mathContent = equation.querySelector('.mjx-math');
              if (mathContent) {
                  const mathClone = mathContent.cloneNode(true);
                  
                  // Clear existing styles that might interfere
                  mathClone.style.paddingRight = '0';
                  mathClone.style.display = 'inline-block';
                  mathClone.style.position = 'static';
                  
                  // Add the math to the wrapper
                  scrollWrapper.appendChild(mathClone);
                  
                  // Position the number absolutely at the end
                  const numberClone = hasNumber.cloneNode(true);
                  numberClone.style.position = 'absolute';
                  numberClone.style.right = '5px';
                  numberClone.style.top = '50%';
                  numberClone.style.transform = 'translateY(-50%)';
                  
                  // Create a container for both elements
                  const container = document.createElement('div');
                  container.style.position = 'relative';
                  container.style.width = '100%';
                  
                  // Add the scroll wrapper and number to the container
                  container.appendChild(scrollWrapper);
                  container.appendChild(numberClone);
                  
                  // Replace the original equation with our custom container
                  equation.parentNode.insertBefore(container, equation);
                  equation.style.display = 'none';
                  
                  // Style the scrollbar
                  scrollWrapper.classList.add('equation-scrollbar');
              }
          }
      });
      
      // Add specialized CSS for the newly created scrollbars
      const style = document.createElement('style');
      style.textContent = `
          .equation-scrollbar::-webkit-scrollbar {
              height: 8px;
          }
          
          .equation-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 4px;
          }
          
          .equation-scrollbar::-webkit-scrollbar-thumb {
              background: #ccc;
              border-radius: 4px;
          }
          
          .equation-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #999;
          }
      `;
      document.head.appendChild(style);
      
  }, 2000); // Use a longer timeout to ensure MathJax is fully rendered
}