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

      // Tarkistetaan, onko status koodilla 2xx (OK)
      if (!response.ok) {
          // Haetaan virheteksti
          const errorText = await response.text();

          // Jos virheviesti on pelkkää tekstiä, palautetaan se sellaisenaan
          return { error: errorText || 'Tuntematon virhe' };
      }

      // Jos vastaus on ok, palautetaan JSON-muotoinen data
      try {
          return await response.json();
      } catch (jsonError) {
          // Jos JSON-parse epäonnistuu (esim. tyhjä vastaus tai ei JSON-muotoista dataa)
          return { error: "Vastaus ei ole kelvollista JSON-muotoa" };
      }
  } catch (error) {
      console.error("fetchData() error:", error.message);
      // Jos tapahtuu virhe pyyntöä tehdessä, palautetaan virhe
      return { error: error.message };
  }
};




  export{fetchData};