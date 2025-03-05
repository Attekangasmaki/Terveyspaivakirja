import '../css/style.css';
import '../css/snackbar.css';
import {getUsers, addUser } from './user.js';
//import {getEntries} from './entries.js';

document.querySelector('#app').innerHTML = 'Moi tässä oman APIn harjoituksia';

document.querySelector('#app').innerHTML = `Moi kirjautunut käyttäjä ${localStorage.getItem('nimi')}`;

const getitemsbtn = document.querySelector('.get_items');
getitemsbtn.addEventListener('click', getItems);

const getusersbtn = document.querySelector('.get_users');
getusersbtn.addEventListener('click', getUsers);
const adduserForm = document.querySelector('.addform');
adduserForm.addEventListener('submit', addUser);

//const getEntriesBtn = document.querySelector('.get_entries');
//getEntriesBtn.addEventListener('click', getEntries);








