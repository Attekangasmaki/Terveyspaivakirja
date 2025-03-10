import { fetchData } from './fetch.js';

const registerUser = async (event) => {
  event.preventDefault();

  const registerForm = document.querySelector('.registerForm');
  const username = registerForm.querySelector('#username').value.trim();
  const password = registerForm.querySelector('#password').value.trim();
  const email = registerForm.querySelector('#email').value.trim();

  const bodyData = { username, password, email };
  const url = 'http://localhost:5000/api/users';
  const options = {
    body: JSON.stringify(bodyData),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };

  console.log("Lähetetään pyyntö:", options);

  try {
    const response = await fetchData(url, options); // Haetaan data
    console.log("Palvelimen vastaus:", response); // Tulostetaan koko vastaus

    if (response.error) {
      console.error('Virhe käyttäjän luomisessa:', response.error);
      return;
    }

    // Varmistetaan, että token ja user_id on palautettu
    if (!response.token || !response.user || !response.user.id) {
      console.error('Virhe: Tokenia tai user_id:tä ei palautettu.');
      return;
    }

    console.log("Rekisteröinti onnistui! Token:", response.token);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user_id', response.user.id);  // Tallennetaan user_id
    localStorage.setItem('nimi', response.user.username);
    

    console.log("Ohjataan käyttäjä etusivulle...");
    setTimeout(() => {
      location.href = './userfrontpage.html';
    }, 500);

    registerForm.reset();
  } catch (error) {
    console.error("Rekisteröinti epäonnistui:", error);
  }
};

const loginUser = async (event) => {
  event.preventDefault();

  const loginForm = document.querySelector('.loginForm');
  const username = loginForm.querySelector('input[name=username]').value;
  const password = loginForm.querySelector('input[name=password]').value;

  const bodyData = {
    username: username,
    password: password,
  };

  const url = 'http://localhost:5000/api/auth/login';

  const options = {
    body: JSON.stringify(bodyData),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };
  console.log(options);

  const response = await fetchData(url, options);

  if (response.error) {
    console.error('Virhe kirjautumisessa:', response.error);
    return;
  }

  if (response.token && response.user) {
    console.log('Kirjautuminen onnistui! Token:', response.token);
    localStorage.setItem('token', response.token); // Tallennetaan token
    localStorage.setItem('user_id', response.user.id); // Tallennetaan käyttäjän ID
    localStorage.setItem('nimi', response.user.username);
    location.href = './userfrontpage.html'; // Ohjataan käyttäjän etusivulle
  } else {
    console.error('Virhe: Tokenia tai käyttäjä-ID:tä ei palautettu.');
  }

  console.log(response);
  loginForm.reset(); // tyhjennetään formi
};

const checkuser = async (event) => {
  event.preventDefault();
  
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Sinun täytyy kirjautua ensin!');
    return;
  }

  const url = 'http://localhost:5000/api/auth/me';

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetchData(url, options);

  if (response.error) {
    console.error('Virhe käyttäjää tarkistettaessa:', response.error);
    return;
  }

  console.log(response);
};

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('.registerForm');
  if (registerForm) registerForm.addEventListener('submit', registerUser);

  const loginForm = document.querySelector('.loginForm');
  if (loginForm) loginForm.addEventListener('submit', loginUser);

  const meRequest = document.querySelector('#meRequest');
  if (meRequest) meRequest.addEventListener('click', checkuser);
});
