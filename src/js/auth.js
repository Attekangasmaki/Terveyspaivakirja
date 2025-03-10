// Tuodaan fetchData-moduuli, jota käytetään datan hakemiseen palvelimelta
import { fetchData } from './fetch.js';

// Rekisteröintiä käsittelevä asynkroninen funktio
const registerUser = async (event) => {
  event.preventDefault(); // Estetään lomakkeen oletustoiminto (esim. lähetys)

  // Haetaan rekisteröintilomakkeen kenttien arvot
  const registerForm = document.querySelector('.registerForm');
  const username = registerForm.querySelector('#username').value.trim(); // Käyttäjänimi
  const password = registerForm.querySelector('#password').value.trim(); // Salasana
  const email = registerForm.querySelector('#email').value.trim(); // Sähköposti

  // Luodaan objekti, joka sisältää lomakkeesta saadut tiedot
  const bodyData = { username, password, email };

  // Määritellään palvelimen URL ja pyynnön asetukset
  const url = 'http://localhost:5000/api/users';
  const options = {
    body: JSON.stringify(bodyData), // Muutetaan objekti JSON-muotoon
    method: 'POST', // Käytetään POST-pyyntöä
    headers: {
      'Content-type': 'application/json', // Lähetetään JSON-data
    },
  };

  console.log("Lähetetään pyyntö:", options); // Debug-tulostus, ennen pyynnön lähettämistä

  try {
    // Haetaan palvelimelta vastaus
    const response = await fetchData(url, options);
    console.log("Palvelimen vastaus:", response); // Tulostetaan vastaus debuggausta varten

    // Tarkistetaan, onko palvelimella tullut virhe
    if (response.error) {
      console.error('Virhe käyttäjän luomisessa:', response.error);
      return;
    }

    // Varmistetaan, että palvelimelta saatiin tarvittavat tiedot (token ja user_id)
    if (!response.token || !response.user || !response.user.id) {
      console.error('Virhe: Tokenia tai user_id:tä ei palautettu.');
      return;
    }

    console.log("Rekisteröinti onnistui! Token:", response.token);
    // Tallennetaan palvelimelta saatu token ja käyttäjän id paikalliseen tallennustilaan (localStorage)
    localStorage.setItem('token', response.token);
    localStorage.setItem('user_id', response.user.id);
    localStorage.setItem('nimi', response.user.username);

    // Ohjataan käyttäjä etusivulle
    console.log("Ohjataan käyttäjä etusivulle...");
    setTimeout(() => {
      location.href = './userfrontpage.html';
    }, 500); // 0.5 sekunnin viive ennen uudelleensuuntausta

    // Tyhjennetään lomake
    registerForm.reset();
  } catch (error) {
    console.error("Rekisteröinti epäonnistui:", error); // Jos pyynnön suorittamisessa oli ongelma
  }
};

// Kirjautumista käsittelevä asynkroninen funktio
const loginUser = async (event) => {
  event.preventDefault(); // Estetään lomakkeen oletustoiminto

  // Haetaan kirjautumislomakkeen kenttien arvot
  const loginForm = document.querySelector('.loginForm');
  const username = loginForm.querySelector('input[name=username]').value;
  const password = loginForm.querySelector('input[name=password]').value;

  // Luodaan objekti, joka sisältää lomakkeesta saadut tiedot
  const bodyData = { username, password };

  const url = 'http://localhost:5000/api/auth/login'; // Kirjautumis-URL

  const options = {
    body: JSON.stringify(bodyData), // Muutetaan JSON-muotoon
    method: 'POST', // Käytetään POST-pyyntöä
    headers: {
      'Content-type': 'application/json', // Lähetetään JSON-data
    },
  };

  console.log(options); // Debug-tulostus ennen pyynnön lähettämistä

  // Haetaan palvelimelta vastaus
  const response = await fetchData(url, options);

  // Tarkistetaan, onko palvelimelta tullut virhe
  if (response.error) {
    console.error('Virhe kirjautumisessa:', response.error);
    return;
  }

  // Jos palvelin palautti tokenin ja käyttäjätiedot, kirjautuminen onnistui
  if (response.token && response.user) {
    console.log('Kirjautuminen onnistui! Token:', response.token);
    // Tallennetaan token ja käyttäjätiedot localStorageen
    localStorage.setItem('token', response.token);
    localStorage.setItem('user_id', response.user.id);
    localStorage.setItem('nimi', response.user.username);
    location.href = './userfrontpage.html'; // Ohjataan käyttäjän etusivulle
  } else {
    console.error('Virhe: Tokenia tai käyttäjä-ID:tä ei palautettu.');
  }

  console.log(response); // Debug-tulostus
  loginForm.reset(); // Tyhjennetään lomake
};

// Käyttäjän tietojen tarkistus (esimerkiksi, onko käyttäjä kirjautunut)
const checkuser = async (event) => {
  event.preventDefault(); // Estetään lomakkeen oletustoiminto
  
  // Haetaan token paikallisesta tallennustilasta
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Sinun täytyy kirjautua ensin!'); // Jos tokenia ei löydy, ilmoitetaan käyttäjälle
    return;
  }

  const url = 'http://localhost:5000/api/auth/me'; // URL, jolla tarkistetaan käyttäjän tiedot

  const options = {
    headers: {
      Authorization: `Bearer ${token}`, // Lähetetään token Authorization-otsikossa
    },
  };

  // Haetaan palvelimelta käyttäjän tiedot
  const response = await fetchData(url, options);

  if (response.error) {
    console.error('Virhe käyttäjää tarkistettaessa:', response.error); // Virheiden käsittely
    return;
  }

  console.log(response); // Tulostetaan vastaus
};

// Kuuntelijat, jotka käynnistävät edellä kuvatut toiminnot
document.addEventListener('DOMContentLoaded', () => {
  // Rekisteröintilomakkeen tapahtuman käsittelijä
  const registerForm = document.querySelector('.registerForm');
  if (registerForm) registerForm.addEventListener('submit', registerUser);

  // Kirjautumislomakkeen tapahtuman käsittelijä
  const loginForm = document.querySelector('.loginForm');
  if (loginForm) loginForm.addEventListener('submit', loginUser);

  // Käyttäjän tarkistuksen tapahtuman käsittelijä
  const meRequest = document.querySelector('#meRequest');
  if (meRequest) meRequest.addEventListener('click', checkuser);
});
