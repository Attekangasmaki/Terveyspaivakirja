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
    const url = 'http://localhost:5000/api/users';
    const users = await fetchData(url);

    if (users.error) {
        console.log('Virhe fetch-haussa');
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
            <td><button class="check" data-id="${user.user_id}">Info</button></td>
            <td><button class="del" data-id="${user.user_id}">Delete</button></td>
            <td>${user.user_id}</td>
        `;

        tableBody.appendChild(row);
    });

    addEventListeners(); // Lisätään event listenerit uusille napeille
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
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        const user = await response.json();
        alert(`User Info:\nID: ${user.user_id}\nName: ${user.username}\nEmail: ${user.email}`);
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
};


getUsers();

const addUser = async (event) => { // Lisää event-parametri
    event.preventDefault(); // Estetään lomakkeen oletusarvoinen lähetys

    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();
    const email = document.querySelector('#email').value.trim();

    if (!username || !password || !email) {
        alert("Täytä kaikki kentät!");
        return;
    }

    const bodyData = { username, password, email };

    const url = 'http://localhost:5000/api/users';
    const options = {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(bodyData),
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            alert("Käyttäjä lisätty onnistuneesti!");
            document.querySelector('.addform').reset(); // Lomakkeen tyhjennys
            getUsers(); // Päivitetään käyttäjälista
        } else {
            alert(`Virhe: ${data.message || 'Tuntematon virhe'}`);
        }
    } catch (error) {
        console.error('Virhe käyttäjän lisäyksessä:', error);
        alert("Jotain meni pieleen!");
    }
};


// Lisää event-kuuntelija LOMAKKEELLE
document.querySelector('.formpost').addEventListener('submit', addUser);

const dialog = document.querySelector('.info_dialog');
const closeButton = document.querySelector('.info_dialog button');

// "Close" button closes the dialog
closeButton.addEventListener('click', () => {
  dialog.close();
});

// Funktio yksittäisen käyttäjän hakemiseen ID:n perusteella
const getUserById = async (userId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}`);
    if (!response.ok) {
      throw new Error('Käyttäjän tietojen haku epäonnistui');
    }
    return await response.json();
  } catch (error) {
    console.error('Virhe käyttäjän tietojen haussa:', error);
    return null;
  }
};

// Lisää tapahtumakuuntelijat kaikille "Info"-napeille
const addEventListeners = () => {
    document.querySelectorAll('.check').forEach((button) => {
        button.addEventListener('click', async (event) => {
            console.log('Klikkasit nappulaa:', event.target);
            const userId = event.target.dataset.id;
            console.log('Haetaan tietoja käyttäjälle id:llä:', userId);

            const user = await getUserById(userId);

            if (user) {
                // Täytetään modal käyttäjän tiedoilla
                document.querySelector('#dialog-user-id').textContent = user.user_id;
                document.querySelector('#dialog-username').textContent = user.username;
                document.querySelector('#dialog-email').textContent = user.email;
                document.querySelector('#dialog-role').textContent = user.user_level;

                // Avataan modal
                dialog.showModal();

                // Ladataan päiväkirjamerkinnät
                loadDiaryEntries(user.user_id);
            }
        });
    });
};
const getUserDiaries = async (userId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/entries/${userId}`);
        if (!response.ok) {
            throw new Error('Päiväkirjamerkintöjen haku epäonnistui');
        }
        return await response.json();
    } catch (error) {
        console.error('Virhe päiväkirjan haussa:', error);
        return [];
    }
};

const loadDiaryEntries = async (userId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/entries/${userId}`);
        let diaries = await response.json();

        console.log("Haetut merkinnät:", diaries); // Debuggausta varten

        // Varmistetaan, että data on taulukko
        if (!Array.isArray(diaries)) {
            console.warn("Palautettu data ei ollut taulukko, muutetaan se taulukoksi.");
            diaries = [diaries]; // Muunnetaan yksittäinen objekti taulukoksi
        }

        const cardArea = document.querySelector('.card-area');
        cardArea.innerHTML = ''; // Tyhjennetään vanhat kortit

        diaries.forEach(entry => { 
            const card = document.createElement('div');
            card.classList.add('card');

            card.innerHTML = `
                <div class="card-img">
                    <img src="/img/diary.jpg" alt="Diary Image">
                </div>
                <div class="card-diary">
                    <h4>Päivämäärä: ${new Date(entry.entry_date).toLocaleDateString()}</h4>
                    <p><strong>Mieliala:</strong> ${entry.mood}</p>
                    <p><strong>Paino:</strong> ${entry.weight} kg</p>
                    <p><strong>Uni:</strong> ${entry.sleep_hours} tuntia</p>
                    <p><strong>Muistiinpanot:</strong> ${entry.notes}</p>
                </div>
            `;

            cardArea.appendChild(card);
        });

    } catch (error) {
        console.error('Virhe päiväkirjamerkintöjen hakemisessa:', error);
    }
};

    
export { getUsers, addUser, addEventListeners, getUserDiaries, loadDiaryEntries };

