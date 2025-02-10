/*
 * Fetches JSON data from APIs
 *
 * @param {string} url - api endpoint url
 * @param {Object} options - request options
 *
 * @returns {Object} response json data
 */
const fetchData = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
  
      if (!response.ok) {
        const errorText = await response.text(); 
        try {
          const errorData = JSON.parse(errorText); 
          return { error: errorData.message || "An error occurred" };
        } catch (jsonError) {
          return { error: `Server error: ${errorText}` };
        }
      }
  
      return await response.json();
    } catch (error) {
      console.error("fetchData() error:", error.message);
      return { error: error.message };
    }
  };

  export{fetchData};