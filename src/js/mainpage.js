document.addEventListener("DOMContentLoaded", () => {
    updateWelcomeMessage();
    loadDiaryEntries();
    loadHealthData();
    loadActivities();
});

const API_BASE = "http://localhost:5000/api";

// 🏷 Päivitä tervetuloteksti käyttäjän nimellä
function updateWelcomeMessage() {
    const username = localStorage.getItem("nimi") || "Käyttäjä";
    document.getElementById("welcome-message").textContent = `Hei, ${username}`;
};

// 📝 Päiväkirjamerkinnät
async function loadDiaryEntries() {
    await loadData("entries", "diary-entries");
};

// 📊 Terveystiedot
async function loadHealthData() {
    await loadData("metrics", "health-data");
};

// 🏃 Aktiviteetit
async function loadActivities() {
    await loadData("activities", "activity-data");
};

// 🔄 Yleisfunktio tietojen lataukseen
async function loadData(type, elementId) {
    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");
        

        if (!token || !userId) throw new Error("Ei tokenia tai käyttäjä-ID:tä! Käyttäjä ei ole kirjautunut.");

        const response = await fetch(`${API_BASE}/${type}/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Virhe ladattaessa: ${response.status} ${response.statusText}`);

        const data = await response.json();
        document.getElementById(elementId).innerHTML = data.length
            ? data.map(entry => createEntryHTML(type, entry)).join("")
            : `<div class="box">Ei merkintöjä.</div>`;

    } catch (error) {
        console.error("Virhe fetch-haussa:", error);
        document.getElementById(elementId).innerHTML = `<div class="box error">Virhe ladattaessa.</div>`;
    }
};

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
};

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
