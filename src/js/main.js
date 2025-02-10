import '../css/style.css';
import '../css/snackbar.css';
import {getItems} from './items.js';
import { getUsers } from './user.js';
import { addUser } from './user.js';

document.querySelector('#app').innerHTML = 'Moi tässä oman APIn harjoituksia';

  

const getitemsbtn = document.querySelector('.get_items');
getitemsbtn.addEventListener('click', getItems);

const getusersbtn = document.querySelector('.get_users');
getusersbtn.addEventListener('click', getUsers);


const adduserForm = document.querySelector('.formpost');
getusersbtn.addEventListener('click', addUser);

