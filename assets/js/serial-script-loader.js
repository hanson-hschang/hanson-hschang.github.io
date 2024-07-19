// serialScriptLoader.js
(function() {
  /**
   * Loads a single script and returns a promise
   * @param {string} src - The source URL of the script to load
   * @returns {Promise} A promise that resolves when the script is loaded
   */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Loads multiple scripts serially
   * @param {string[]} scripts - An array of script URLs to load
   * @returns {Promise} A promise that resolves when all scripts are loaded
   */
  async function loadScriptsSerially(scripts) {
    for (const script of scripts) {
      try {
        await loadScript(script);
        // console.log(`${script} has finished loading and executing`);
      } catch (error) {
        console.error(`Error loading ${script}:`, error);
        // Optionally, you can choose to break the loop here if you want to stop on first error
        throw error; // Uncomment this line to stop execution on first error
      }
    }
    // console.log('All scripts have been loaded and executed');
  }

  // Add the function to the global scope
  window.loadScriptsSerially = loadScriptsSerially;
})();
