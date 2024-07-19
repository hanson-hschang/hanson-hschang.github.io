// loadPosts.js
async function fetchContentMd(filePath) {
  try {
    const response = await fetch(filePath);
    const text = await response.text();
    const entries = text.trim().split('\n\n');
    return entries.map(entry => {
      const [title, date, link, content] = entry.split('\n');
      return { title, date, link, content};
    });
  } catch (error) {
    console.error('Error fetching content.md:', error);
    return [];
  }
}

// Function to fetch the template HTML file
async function fetchTemplate(templatePath) {
  try {
    const response = await fetch(templatePath);
    return await response.text();
  } catch (error) {
    console.error(`Error fetching template ${templatePath}:`, error);
    return '';
  }
}

// Function to create a post entry HTML element
function createPostEntry(post, template) {
  const filledTemplate = template
    .replace('${link}', post.link)
    .replace('${title}', post.title)
    .replace('${date}', post.date)
    .replace('${content}', post.content);
  const element = document.createElement('div');
  element.innerHTML = filledTemplate.trim();
  return element.firstChild;
}

// Main function to load and insert posts
async function loadPosts(contentFilePath, templateFilePath) {
  const postEntries = document.getElementById('post-entries');
  const [posts, template] = await Promise.all([
    fetchContentMd(contentFilePath),
    fetchTemplate(templateFilePath)
  ]);

  posts.forEach(post => {
    const postElement = createPostEntry(post, template);
    postEntries.appendChild(postElement);
  });
}

// Export loadPosts function to make it accessible from HTML
window.loadPosts = loadPosts;
