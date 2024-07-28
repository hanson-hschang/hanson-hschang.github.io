// loadPosts.js
async function fetchContentMd(filePath) {
  try {
    // Read the content of the file
    const response = await fetch(filePath);
    const text = await response.text();

    // Split the content of the file into entries
    const entries = text.trim().split('\n\n');
    return entries.map(entry => {

      // Split the table into lines
      entry = entry.trim().split('\n')

      // Remove the header and separator lines
      const content = entry.slice(2);

      // Initialize an object to store the parsed data
      const parsedData = {};

      // Parse each data line
      content.forEach(line => {
        // Split the line by the pipe character and trim each part
        const [key, value] = line.split('|').map(item => item.trim()).filter(item => item !== '');
        
        // Store the key-value pair in the parsedData object
        if (key && value) {
          parsedData[key] = value;
        }
      });
      return parsedData;
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
    .replace('${excerpt}', post.excerpt);
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
