// Recursive function to include HTML
function includeHTML(root = document) {
  const elements = root.querySelectorAll('[include-html]');

  elements.forEach((element) => {
    fetch(element.getAttribute('include-html'))
      .then(response => response.text())
      .then(html => {
        // Get the classes from the original element
        const originalClasses = element.className.split(' ');

        // Create a temporary container
        const temp = document.createElement('div');
        // Set the innerHTML of the temporary container
        temp.innerHTML = html;

        // Function to copy attributes
        const copyAttributes = (source, target) => {
          Array.from(source.attributes).forEach(attr => {
            // Skip the 'include-html' and 'class' attributes
            if (attr.name !== 'include-html' && attr.name !== 'class') {
              target.setAttribute(attr.name, attr.value);
            }
          });
        };
        

        // Replace the original element with the contents of the temporary container
        
        // Get the first child of the temporary container
        const newElement = temp.firstChild;
        const newElementClasses = newElement.className.split(' ');

        // Add the original classes to the new element
        if (newElementClasses[0] !== '') { 
          for (let i = 0; i < newElementClasses.length; i++) {
            element.classList.add(newElementClasses[i]);
          }
        }
        newElement.className = element.className;

        // Copy all attributes from the original element
        copyAttributes(element, newElement);

        // Insert the new element before the original element
        element.parentNode.insertBefore(newElement, element);
        
        // Get the parent of the original element
        const parentNode = element.parentNode

        // Remove the original element
        parentNode.removeChild(element);
        
        // Recursively call includeHTML on the parent of the new content
        includeHTML(newElement);
      })
      .catch(error => {
        console.error('Error fetching include-html content:', error);
      });
  });
}

// Initial call to start the process
includeHTML();