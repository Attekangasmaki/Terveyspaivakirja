import { fetchData } from "./fetch";
/* const getUsers = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/users');
        const data = await response.json();
        console.log(response);
        console.log('Haetaan käyttäjiä ja mitä ikinä');
        console.log(data);
        data.forEach(element => {
            console.log(element);
            console.log(element.name);
        });
    } catch (error) {
        console.error('Virhe:', error);
    }
} */



    const getUsers = async () => {
        const url = 'http://localhost:3000/api/users';
        const users = await fetchData(url);

        if (users.error) {
            console.log('Virhe fetch-haussa, hirveää');
            return;
        }
        console.log(users);
        const tableBody = document.querySelector('.tbody');
        tableBody.innerHTML = '';

        users.forEach((user) => {
            const row = document.createElement('tr');
        
            row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td><button class="check" data-id="${user.id}">Info</button></td>
            <td><button class="del" data-id="${user.id}">Delete</button></td>
            <td>${user.id}</td>
            `;
        
            tableBody.appendChild(row);
    });
    addButtonEventListeners();
};
const addButtonEventListeners = () => {
    document     .querySelectorAll('.check').forEach((button) => {
   button.addEventListener('click', async (event) => {
            const userId = event.target.dataset.id;
            fetchUserInfo(userId);
        });
    });
};

const fetchUserInfo = async (userId) => {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        const user = await response.json();
        alert(`User Info:\nID: ${user.id}\nName: ${user.username}\nEmail: ${user.email}`);
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
};

getUsers();

const addUser = async () => {
    event.preventDefault();
    
    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();
    const email = document.querySelector('#email').value.trim();

    const bodyData = {
        username: username,
        password: password,
        email: email,
      }

    const url = 'http://localhost:3000/api/users';
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
        console.log('Virhe fetch-haussa, hirveää');
        console.log(response.error);
        return;
    }
    if (response.message){
        alert(response.message);
    }
    console.log(response);
    document.querySelector('.addform').reset();
    getUsers();
}





export{getUsers, addUser};