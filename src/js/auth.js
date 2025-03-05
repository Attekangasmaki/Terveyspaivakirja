import '../css/style.css';
import '../css/snackbar.css';
import {fetchData} from './fetch.js';

console.log('Moi luodaan nyt tokeneita ja kirjaudutaan sisään');

// Esimerkin takia haut ovat nyt suoraan tässä tiedostossa, jotta harjoitus ei sekoita
// teidän omaa projektin rakennetta

const registerUser = async (event) => {
  event.preventDefault();

  // Haetaan oikea formi
  const registerForm = document.querySelector('.registerForm');

  // Haetaan formista arvot
  const username = registerForm.querySelector('#username').value.trim();
  const password = registerForm.querySelector('#password').value.trim();
  const email = registerForm.querySelector('#email').value.trim();

  // Luodaan body lähetystä varten taustapalvelun vaatimaan muotoon
  const bodyData = {
    username: username,
    password: password,
    email: email,
  };

  // Endpoint
  const url = 'http://localhost:5000/api/users';

  // Options
  const options = {
    body: JSON.stringify(bodyData),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };
  console.log(options);

  // Hae data
  const response = await fetchData(url, options);

  if (response.error) {
    console.error('Error adding a new user:', response.error);
    return;
  }

  if (response.message) {
    console.log(response.message, 'success');
  }

  console.log(response);
  registerForm.reset(); // tyhjennetään formi
};

const loginUser = async (event) => {
  event.preventDefault();

  // Haetaan oikea formi
  const loginForm = document.querySelector('.loginForm');

  // haetaan formista arvot tällä kertaa 
  const username = loginForm.querySelector('input[name=username]').value;
  const password = loginForm.querySelector('input[name=password]').value;

  // Luodaan body lähetystä varten taustapalvelun vaatimaan muotoon
  const bodyData = {
    username: username,
    password: password,
  };

  // Endpoint
  const url = 'http://localhost:5000/api/auth/login';

  // Options
  const options = {
    body: JSON.stringify(bodyData),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };
  console.log(options);

  // Hae data
  const response = await fetchData(url, options);

  if (response.error) {
    console.error('Error loginning in:', response.error);
    return;
  }
  if (response.token && response.user) {
    console.log('Kirjautuminen onnistui! Token:', response.token);
    localStorage.setItem('token', response.token); // ✅ Tallennetaan token
    localStorage.setItem('user_id', response.user.id); // ✅ Tallennetaan käyttäjän ID
    localStorage.setItem('nimi', response.user.username);
    location.href = './userfrontpage.html'; // ✅ Ohjataan käyttäjän etusivulle
} else {
    console.error('Virhe: Tokenia tai käyttäjä-ID:tä ei palautettu.');
}

  if (response.message) {
    console.log(response.message, 'success');
  }

  console.log(response);
  loginForm.reset(); // tyhjennetään formi
};

  const checkuser = async (event) => {
    event.preventDefault();
  
  
    // Endpoint
    const url = 'http://localhost:5000/api/auth/me';
    
    let headers = {};

    const token = localStorage.getItem('token');

    headers = {
        Authorization: `Bearer ${token}`
    };
    // Options
    const options = {
      headers: headers,
    };
    console.log(options);
  
    // Hae data
    const response = await fetchData(url, options);
  
    if (response.error) {
      console.error('Error cheking new user:', response.error);
      return;
    }
  
    if (response.message) {
        console.log(response.message, 'success');
        localStorage.setItem('token', response.token);
      

    }
  
    console.log(response);
    loginForm.reset(); // tyhjennetään formi
  };

  document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.registerForm');
    if (registerForm) registerForm.addEventListener('submit', registerUser);

    const loginForm = document.querySelector('.loginForm');
    if (loginForm) loginForm.addEventListener('submit', loginUser);

    const meRequest = document.querySelector('#meRequest');
    if (meRequest) meRequest.addEventListener('click', checkuser);
});