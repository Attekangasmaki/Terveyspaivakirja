document.addEventListener("DOMContentLoaded", () => {
    console.log("Sivu ladattu");
    updateWelcomeMessage();
    loadDiaryEntries();
    loadHealthData();
    loadActivities();
});

const API_BASE = "http://localhost:5000/api";

// 🏷 Päivitä tervetuloteksti käyttäjän nimellä
function updateWelcomeMessage() {
    const username = localStorage.getItem("nimi") || "Käyttäjä";
    const welcomeMessageElement = document.getElementById("welcome-message");
    if (welcomeMessageElement) {
        welcomeMessageElement.textContent = `Hei, ${username}`;
    } else {
        console.error("Elementti 'welcome-message' ei löytynyt.");
    }
}

// 📝 Päiväkirjamerkinnät
async function loadDiaryEntries() {
    await loadData("entries", "diary-entries");
}

// 📊 Terveystiedot
async function loadHealthData() {
    await loadData("metrics", "health-data");
}

// 🏃 Aktiviteetit
async function loadActivities() {
    await loadData("activities", "activity-data");
}

// 🔄 Yleisfunktio tietojen lataukseen
async function loadData(type, elementId) {
    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");

        if (!token || !userId) throw new Error("Ei tokenia tai käyttäjä-ID:tä! Käyttäjä ei ole kirjautunut.");

        const response = await fetch(`${API_BASE}/${type}/user/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Virhe ladattaessa: ${response.status} ${response.statusText}`);

        const data = await response.json();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = data.length
                ? data.map(entry => createEntryHTML(type, entry)).join("")
                : `<div class="box">Ei merkintöjä.</div>`;
        } else {
            console.error(`Elementti '${elementId}' ei löytynyt.`);
        }
    } catch (error) {
        console.error("Virhe fetch-haussa:", error);
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `<div class="box error">Virhe ladattaessa.</div>`;
        }
    }
}

// 📦 Luo HTML-koodi eri tietotyypeille
function createEntryHTML(type, entry) {
    return `
        <div class="box">
            <h3>Päivämäärä: ${entry.entry_date || entry.metric_date || entry.activity_date}</h3>
            
            ${type === "entries" ? `
                <p><strong>Mieliala:</strong> ${entry.mood || "Ei tietoa"}</p>
                <p><strong>Paino:</strong> ${entry.weight ? entry.weight + " kg" : "Ei tietoa"}</p>
            ` : ""}
            
            ${type === "metrics" ? `
                <p><strong>Verenpaine:</strong> ${entry.blood_pressure || "Ei tietoa"}</p>
                <p><strong>Syke:</strong> ${entry.heart_rate ? entry.heart_rate + " bpm" : "Ei tietoa"}</p>
            ` : ""}
            
            ${type === "activities" ? `
                <p><strong>Tyyppi:</strong> ${entry.activity_type}</p>
                <p><strong>Kesto:</strong> ${entry.duration_minutes} min</p>
                <p><strong>Poltetut kalorit:</strong> ${entry.calories_burned ? entry.calories_burned + " kcal" : "Ei tietoa"}</p>
            ` : ""}
            
            <p><strong>Muistiinpanot:</strong> ${entry.notes || "Ei merkintöjä"}</p>
            
            <button class="edit-btn" onclick="editEntry('${type}', ${entry.id})">✏️ Muokkaa</button>
        </div>
    `;
}

// Muokkaa merkintää
function editEntry(type, entryId) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Et ole kirjautunut sisään!");
        return;
    }

    fetch(`${API_BASE}/${type}/${entryId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) throw new Error(`Virhe haettaessa: ${response.status}`);
        return response.json();
    })
    .then(entry => {
        showForm(type, entry);
    })
    .catch(error => {
        console.error("Virhe haettaessa merkintää:", error);
        alert("Merkinnän hakeminen epäonnistui.");
    });
};

function openDialog(title, content) {
    const dialog = document.getElementById("myDialog");
    document.getElementById("dialog-title").innerText = title;
    document.getElementById("dialog-body").innerHTML = content;
    dialog.showModal();
}

function closeDialog() {
    const dialog = document.getElementById("myDialog");
    if (dialog) {
        console.log("Suljetaan dialogi...");
        dialog.close();
        console.log("Dialogi pitäisi olla suljettu.");
    } else {
        console.error("Virhe: Dialog-elementtiä ei löytynyt.");
    }
}



function addEntry() {
    const formHtml = `
        <label for="entry_date">Päivämäärä:</label>
        <input type="date" id="entry_date" required>

        <label for="mood">Mieliala:</label>
        <select id="mood" required>
            <option value="ilo">Iloinen</option>
            <option value="neutraali">Neutraali</option>
            <option value="surullinen">Surullinen</option>
            <option value="stressaantunut">Stressaantunut</option>
            <option value="väsynyt">Väsynyt</option>
        </select>

        <label for="weight">Paino (kg):</label>
        <input type="number" id="weight" step="0.1" required>

        <label for="sleep_hours">Unen määrä (h):</label>
        <input type="number" id="sleep_hours" step="0.1" required>

        <label for="notes">Muistiinpanot:</label>
        <textarea id="notes" rows="4" required></textarea>

        <button onclick="submitEntry()">Tallenna</button>
    `;
    openDialog("Lisää päiväkirjamerkintä", formHtml);
}
function addHealthData() {
    const formHtml = `
        <label for="metric_date">Päivämäärä:</label>
        <input type="date" id="metric_date" required>

        <label for="blood_pressure">Verenpaine:</label>
        <input type="text" id="blood_pressure" placeholder="120/80" required>

        <label for="heart_rate">Syke (bpm):</label>
        <input type="number" id="heart_rate" required>

        <label for="notes">Muistiinpanot:</label>
        <textarea id="notes" rows="3"></textarea>

        <button onclick="submitHealthData()">Tallenna</button>
    `;
    openDialog("Lisää terveystietoja", formHtml);
}


// Aktiviteetti - lisää aktiviteetti
function addActivity() {
    const formHtml = `
        <label for="activity_date">Päivämäärä:</label>
        <input type="date" id="activity_date" required>

        <label for="activity_type">Tyyppi:</label>
        <input type="text" id="activity_type" required>

        <label for="duration_minutes">Kesto (min):</label>
        <input type="number" id="duration_minutes" required>

        <label for="calories_burned">Poltetut kalorit:</label>
        <input type="number" id="calories_burned">

        <label for="notes">Muistiinpanot:</label>
        <textarea id="notes" rows="3"></textarea>

        <button onclick="submitActivity()">Tallenna</button>
    `;
    openDialog("Lisää aktiviteetti", formHtml);
}

// Aktiviteetti - Lähettää tietoja palvelimelle
function submitActivity() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    const activity_date = document.getElementById("activity_date").value;
    const activity_type = document.getElementById("activity_type").value;
    const duration_minutes = document.getElementById("duration_minutes").value;
    const calories_burned = document.getElementById("calories_burned").value || null;
    const notes = document.getElementById("notes").value;

    if (!token || !userId) {
        alert("Et ole kirjautunut sisään!");
        return;
    }

    fetch(`${API_BASE}/activities/insert`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            activity_date,
            activity_type,
            duration_minutes,
            calories_burned,
            notes,
            user_id: userId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Activity added") {
            alert("Aktiviteetti lisätty!");
            loadActivities();  // Päivitetään aktiviteettinäkymä
        } else {
            console.log(data.message);
        }
        closeDialog();  // Suljetaan lomake, vaikka lisäys ei onnistuisi
    })
    .catch(error => {
        console.error("Virhe lisäyksessä:", error);
        closeDialog();  // Suljetaan lomake virhetilanteessa
    });
}



// Lähetä päiväkirjamerkintä
function submitEntry() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    const entry_date = document.getElementById("entry_date").value;
    const mood = document.getElementById("mood").value;
    const weight = document.getElementById("weight").value;
    const sleep_hours = document.getElementById("sleep_hours").value; // ✅ Lisätty kenttä
    const notes = document.getElementById("notes").value;

    if (!token || !userId) {
        alert("Et ole kirjautunut sisään!");
        return;
    }

    fetch(`${API_BASE}/entries/insert`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            entry_date,
            mood,
            weight,
            sleep_hours,  // ✅ Lähetetään nyt backendille
            notes,
            user_id: userId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Entry added") {
            console.log(data.message);
            loadDiaryEntries();
        } else {
            console.log(data.message);
        }
        closeDialog();
    })
    .catch(error => {
        console.error("Virhe lisäyksessä:", error);
        console.log(error);
        closeDialog();
    });
}

// Lähetä terveysdata
function submitHealthData() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    const metric_date = document.getElementById("metric_date").value;
    const blood_pressure = document.getElementById("blood_pressure").value;
    const heart_rate = document.getElementById("heart_rate").value;
    const notes = document.getElementById("notes").value;

    if (!token || !userId) {
        alert("Et ole kirjautunut sisään!");
        return;
    }

    fetch(`${API_BASE}/metrics/insert`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            metric_date,
            blood_pressure,
            heart_rate,
            notes,
            user_id: userId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Data added") {
            console.log(data.message);
            loadHealthData();
        } else {
            console.log(data.message);
        }
        closeDialog();
    })
    .catch(error => {
        console.error("Virhe lisäyksessä:", error);
        alert("Virhe lisäyksessä.");
        closeDialog();
    });
}
