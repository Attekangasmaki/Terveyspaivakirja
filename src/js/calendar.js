document.addEventListener("DOMContentLoaded", async () => {
    console.log("Kalenteri ladattu");
    updateWelcomeMessage();
    await loadCalendar();
    await fetchHealthData(); // Ladataan terveystiedot kuvaajia varten
});
// 🌍 API-osoite
const API_BASE = "http://localhost:5000/api";

// Päivitä tervetuloteksti
function updateWelcomeMessage() {
    const username = localStorage.getItem("nimi") || "Käyttäjä";
    const welcomeMessageElement = document.getElementById("welcome-message");
    if (welcomeMessageElement) {
        welcomeMessageElement.textContent = `Hei, ${username}`;
    }
}

function formatDate(dateString) {
    return dateString.split("T")[0]; // Poistaa ajan ja jättää vain päivämäärän
}

// Hae terveystiedot API:sta ja luo kuvaajat
async function fetchHealthData() {
    try {
        const [entries, metrics, activities] = await Promise.all([
            fetchData("entries"),  
            fetchData("metrics"),  
            fetchData("activities")  
        ]);

        // Erotellaan verenpaine ja syke omiin taulukoihin
        const bloodPressureData = metrics
            .filter(entry => entry.blood_pressure)
            .map(entry => ({
                date: formatDate(entry.metric_date),
                bloodPressure: entry.blood_pressure
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
            

        const heartRateData = metrics
            .filter(entry => entry.heart_rate)
            .map(entry => ({
                date: formatDate(entry.metric_date),
                heartRate: entry.heart_rate
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
            

        const weightData = entries
            .filter(entry => entry.weight)
            .map(entry => ({
                date: formatDate(entry.entry_date),
                weight: entry.weight
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const caloriesData = activities
            .filter(entry => entry.calories_burned)
            .map(entry => ({
                date: formatDate(entry.activity_date),
                calories: entry.calories_burned
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        renderBloodPressureChart(bloodPressureData);
        renderHeartRateChart(heartRateData);
        renderWeightChart(weightData);
        renderCaloriesChart(caloriesData);

        updateSummaryBox(weightData, caloriesData, bloodPressureData, heartRateData);
    } catch (error) {
        console.error("Virhe haettaessa terveystietoja:", error);
    }
}

function updateSummaryBox(weightData, caloriesData, bloodPressureData, heartRateData) {
    // Painon muutos kuukauden aikana
    const firstWeight = weightData[0]?.weight || 0;
    const lastWeight = weightData[weightData.length - 1]?.weight || 0;
    const weightChange = lastWeight - firstWeight;

    // Poltetut kalorit kuukauden aikana
    const totalCalories = caloriesData.reduce((sum, entry) => sum + entry.calories, 0);

    // Keskimääräinen verenpaine (systolinen)
    const averageBloodPressure = bloodPressureData.reduce((sum, entry) => {
        const [systolic] = entry.bloodPressure.split('/').map(Number);
        return sum + systolic;
    }, 0) / bloodPressureData.length || 0;

    // Keskimääräinen syke
    const averageHeartRate = heartRateData.reduce((sum, entry) => sum + entry.heartRate, 0) / heartRateData.length || 0;

    // Päivitä laatikon sisällöt
    document.getElementById("weightChange").textContent = `${weightChange.toFixed(2)} kg`;
    document.getElementById("caloriesBurned").textContent = `${totalCalories} kcal`;
    document.getElementById("averageBloodPressure").textContent = `${averageBloodPressure.toFixed(1)} mmHg`;
    document.getElementById("averageHeartRate").textContent = `${averageHeartRate.toFixed(1)} bpm`;
}

// Luo kuvaaja Chart.js:llä
function renderBloodPressureChart(data) {
    const ctx = document.getElementById("bloodPressureChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: data.map(entry => entry.date),
            datasets: [{
                label: "Verenpaine",
                data: data.map(entry => parseInt(entry.bloodPressure.split('/')[0])), // Oletetaan, että arvo on muodossa "120/80"
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                fill: true
            }]
        },
        options: { responsive: true }
    });
}

function renderHeartRateChart(data) {
    const ctx = document.getElementById("heartRateChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: data.map(entry => entry.date),
            datasets: [{
                label: "Syke (bpm)",
                data: data.map(entry => entry.heartRate),
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                fill: true
            }]
        },
        options: { responsive: true }
    });
}

function renderWeightChart(data) {
    const ctx = document.getElementById("weightChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: data.map(entry => entry.date),
            datasets: [{
                label: "Paino (kg)",
                data: data.map(entry => entry.weight),
                borderColor: "green",
                backgroundColor: "rgba(0, 255, 0, 0.2)",
                fill: true
            }]
        },
        options: { responsive: true }
    });
}

function renderCaloriesChart(data) {
    const ctx = document.getElementById("caloriesChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: data.map(entry => entry.date),
            datasets: [{
                label: "Poltetut kalorit (kcal)",
                data: data.map(entry => entry.calories),
                borderColor: "orange",
                backgroundColor: "rgba(255, 165, 0, 0.2)",
                fill: true
            }]
        },
        options: { responsive: true }
    });
}
// 🔄 Lataa kaikki merkinnät ja lisää kalenteriin
async function loadCalendar() {
    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");

        if (!token || !userId) {
            throw new Error("Ei tokenia tai käyttäjätunnusta! Käyttäjä ei ole kirjautunut.");
        }

        // Hae kaikki merkinnät API:sta, vaikka ei olisi merkintöjä
        const [entries, health, activities] = await Promise.all([
            fetchData("entries"),
            fetchData("metrics"),
            fetchData("activities")
        ]);

        // Muodosta tapahtumat kalenteriin
        const events = [...entries, ...health, ...activities].map(entry => {
            let entryId, category;

            // Tarkista, mihin kategoriaan merkintä kuuluu
            if (entry.entry_id) {
                entryId = entry.entry_id;
                category = "diaryentry";
            } else if (entry.metric_id) {
                entryId = entry.metric_id;
                category = "metrics";
            } else if (entry.activity_id) {
                entryId = entry.activity_id;
                category = "activities";
            }

            return {
                title: getEntryTitle(entry),
                start: entry.entry_date || entry.metric_date || entry.activity_date,
                extendedProps: { 
                    type: entry.type || entry.activity_type || entry.metric_type,
                    notes: entry.notes,
                    id: entryId,
                    category: category 
                }
            };
        });

        renderCalendar(events); // Renderöi kalenteri
    } catch (error) {
        console.error("Virhe ladattaessa kalenteria:", error);
        renderCalendar([]); // Jos ei ole merkintöjä, renderöi tyhjä kalenteri
    }
}
// 📦 Hae tietoja API:sta
async function fetchData(type) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    const response = await fetch(`${API_BASE}/${type}/user/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error(`Virhe ladattaessa ${type}`);
    return response.json();
    
};

// 🔖 Luo otsikko eri merkinnöille
function getEntryTitle(entry) {
    if (entry.activity_type) return `🏃 ${entry.activity_type} (${entry.duration_minutes} min)`;
    if (entry.blood_pressure) return `💓 Verenpaine: ${entry.blood_pressure}`;
    if (entry.mood) return `😊 Mieliala: ${entry.mood}`;
    return "📌 Merkintä";
};

function openAddEntryForm(date) {
    const formDialog = document.createElement("div");
    formDialog.id = "add-entry-form-dialog";
    formDialog.innerHTML = `
        <div class="dialog-content">
            <h2>Lisää uusi merkintä</h2>
            <p><strong>Päivämäärä:</strong> ${new Date(date).toLocaleDateString()}</p>
            <form id="add-entry-form">
                <label for="entry-type">Valitse merkintätyyppi:</label>
                <select id="entry-type" required>
                    <option value="diaryentry">Päiväkirja</option>
                    <option value="metrics">Terveystieto</option>
                    <option value="activities">Aktiviteetti</option>
                </select>
                <div id="dynamic-fields"></div> <!-- Tänne lisätään kentät dynaamisesti -->
                <label for="notes">Muistiinpanot:</label>
                <textarea id="notes" rows="4" placeholder="Lisää muistiinpanot..."></textarea>
                <br/>
                <button type="submit">Lisää merkintä</button>
                <button type="button" id="close-form-button">Peruuta</button>
            </form>
        </div>
    `;
    document.body.appendChild(formDialog);

    const entryTypeSelect = document.getElementById("entry-type");
    const dynamicFieldsDiv = document.getElementById("dynamic-fields");

    // Päivitetään lomake, kun valinta muuttuu
    entryTypeSelect.addEventListener("change", updateFormFields);
    updateFormFields(); // Kutsutaan heti, jotta ensimmäinen valinta näkyy oikein

    function updateFormFields() {
        const selectedType = entryTypeSelect.value;
        dynamicFieldsDiv.innerHTML = ""; // Tyhjennetään aiemmat kentät

        if (selectedType === "diaryentry") {
            dynamicFieldsDiv.innerHTML = `
                <label for="mieliala">Mieliala:</label>
                <select id="mood" required>
                    <option value="ilo">Iloinen</option>
                    <option value="neutraali">Neutraali</option>
                    <option value="surullinen">Surullinen</option>
                    <option value="stressaantunut">Stressaantunut</option>
                    <option value="väsynyt">Väsynyt</option>
                </select>
                <label for="weight">Paino (kg):</label>
                <input type="number" id="weight" placeholder="Paino kilogrammoina">
                <label for="sleep">Unen määrä (tuntia):</label>
                <input type="number" id="sleep" placeholder="Esim. 7.5">
            `;
        } else if (selectedType === "metrics") {
            dynamicFieldsDiv.innerHTML = `
                <label for="blood-pressure">Verenpaine:</label>
                <input type="text" id="blood-pressure" placeholder="Esim. 120/80">
                <label for="heart-rate">Syke:</label>
                <input type="number" id="heart-rate" placeholder="Syke bpm">
            `;
        } else if (selectedType === "activities") {
            dynamicFieldsDiv.innerHTML = `
                <label for="activity-type">Tyyppi:</label>
                <input type="text" id="activity-type" placeholder="Esim. Juoksu, Kuntosali">
                <label for="duration">Kesto (min):</label>
                <input type="number" id="duration" placeholder="Kesto minuuteissa">
                <label for="calories">Poltetut kalorit:</label>
                <input type="number" id="calories" placeholder="Kalorit kcal">
            `;
        }
    }

    // Lisää lomakkeen submit-toiminnon käsittelijä sen jälkeen, kun lomake on lisätty DOM:iin
    document.getElementById("add-entry-form").addEventListener("submit", async (event) => {
        event.preventDefault();
    
        const entryType = entryTypeSelect.value;
        const notes = document.getElementById("notes").value;
        const userId = localStorage.getItem("user_id");
        const token = localStorage.getItem("token");
    
        // Tarkistetaan, että user_id on määritelty oikein
        if (!userId || userId === "undefined" || userId === null) {
            console.error("Käyttäjätunnus puuttuu! localStorage: ", localStorage);
            alert("Käyttäjätunnus puuttuu! Varmista, että olet kirjautunut sisään.");
            return;
        }
    
        // Tarkistetaan, että muistiinpanot on täytetty
        if (!notes) {
            alert("Muistiinpanot ovat pakollisia.");
            return;
        }
    
        // Muutetaan päivämäärä oikeaan muotoon (yyyy-mm-dd)
        const formattedDate = new Date(date).toISOString().split("T")[0];
    
        let newEntry = { 
            user_id: userId, 
            notes: notes, 
            entry_date: formattedDate // Päivämäärä oikeassa muodossa
        };
    
        let url, method = "POST";
    
        if (entryType === "diaryentry") {
            newEntry.mood = document.getElementById("mood").value;
            newEntry.weight = parseFloat(document.getElementById("weight").value) || null;
            newEntry.sleep = parseFloat(document.getElementById("sleep").value) || null;
            url = `${API_BASE}/entries/insert`;
        } else if (entryType === "metrics") {
            newEntry.blood_pressure = document.getElementById("blood-pressure").value;
            newEntry.heart_rate = parseInt(document.getElementById("heart-rate").value) || null;
            url = `${API_BASE}/metrics/insert`;
        } else if (entryType === "activities") {
            newEntry.activity_type = document.getElementById("activity-type").value;
            newEntry.duration_minutes = parseInt(document.getElementById("duration").value) || null;
            newEntry.calories_burned = parseInt(document.getElementById("calories").value) || null;
            url = `${API_BASE}/activities/insert`;
        }
    
        // Tarkistetaan, että newEntry sisältää oikeat tiedot
        console.log("Lähetettävät tiedot:", newEntry);
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newEntry)
            });
    
            const responseData = await response.json(); // Luetaan vastauksen JSON
            console.log("API-vastaus:", responseData);
    
            if (response.ok) {
                alert("Merkintä lisätty!");
                formDialog.remove(); // Suljetaan lomake
                loadCalendar(); // Päivitetään kalenteri
            } else {
                // Tarkistetaan virheviesti ja näytetään se käyttäjälle
                const errorMessage = responseData.errors ? responseData.errors.map(err => err.message).join(", ") : "Tuntematon virhe";
                console.error("Virhe API-vastauksessa:", responseData);
                alert("Virhe lisättäessä merkintää: " + errorMessage);
            }
        } catch (error) {
            console.error("Virhe lisättäessä merkintää:", error);
            alert("Virhe lisättäessä merkintää.");
        }
    });
    
    // Sulje lomake
    document.getElementById("close-form-button").addEventListener("click", () => {
        formDialog.remove();
    });
}


// 📅 Luo kalenteri ja lisää tapahtumat
function renderCalendar(events) {
    const calendarEl = document.getElementById("calendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        locale: "fi",  // Suomi
        events: events, // Tapahtumat kalenteriin
        
        // Lisää uuden merkinnän lomake, kun päivämäärää klikataan
        dateClick: function(info) {
            openAddEntryForm(info.dateStr); // Avaa lomake uuden merkinnän lisäämiseksi
        },

        // Avaa dialogi olemassa olevan merkinnän muokkaamiseksi ja poistamiseksi
        eventClick: function(info) {
            const event = info.event;
            const entryId = event.extendedProps.id;
            const category = event.extendedProps.category;

            // Luo dialogi poistamista ja muokkaamista varten
            const dialog = document.createElement("div");
            dialog.id = "event-dialog";
            dialog.innerHTML = `
                <div class="dialog-content">
                    <h2>Valitse toiminto</h2>
                    <p><strong>${event.title}</strong></p>
                    <p>${event.extendedProps.notes || "Ei muistiinpanoja"}</p>
                    <div class="dialog-buttons">
                        <button id="edit-button">Muokkaa</button>
                        <button id="delete-button">Poista</button>
                        <button id="close-button">Sulje</button>
                    </div>
                </div>
            `;
            document.body.appendChild(dialog);

            // Sulje dialogi
            document.getElementById("close-button").addEventListener("click", () => {
                dialog.remove();
            });

            // Muokkaa-toiminto
            document.getElementById("edit-button").addEventListener("click", () => {
                openEditForm(event);
                dialog.remove();  // Poistetaan nykyinen dialogi
            });

            // Poista-toiminto
            document.getElementById("delete-button").addEventListener("click", async () => {
                if (!entryId || !category) {
                    console.error("Virheellinen ID tai kategoria", { entryId, category });
                    alert("Virhe: ID tai kategoria puuttuu!");
                    return;
                }

                const deleteUrl = `${API_BASE}/${category}/${entryId}`;
                console.log("Poistetaan merkintä URL:stä:", deleteUrl); // Tarkistetaan URL konsolissa

                try {
                    const token = localStorage.getItem("token");

                    const response = await fetch(deleteUrl, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (response.ok) {
                        alert("Merkintä poistettu!");
                        dialog.remove();
                        info.event.remove(); // Poistetaan tapahtuma kalenterista
                    } else {
                        alert("Virhe poistettaessa merkintää!");
                    }
                } catch (error) {
                    console.error("Virhe poistettaessa merkintää:", error);
                    alert("Virhe poistettaessa merkintää!");
                }
            });
        }
    });
    calendar.render();
}

function openEditForm(event) {
    // Luo lomake muokkaukseen
    const formDialog = document.createElement("div");
    formDialog.id = "edit-form-dialog";
    formDialog.innerHTML = `
        <div class="form-content">
            <h2>Muokkaa merkintää</h2>
            <form id="edit-form">
                <label for="title">Otsikko:</label>
                <input type="text" id="title" value="${event.title}" required>
                <label for="notes">Muistiinpanot:</label>
                <textarea id="notes">${event.extendedProps.notes || ""}</textarea>
                <div class="form-buttons">
                    <button type="submit">Tallenna</button>
                    <button type="button" id="cancel-button">Peruuta</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(formDialog);

    // Peruuta-toiminto
    document.getElementById("cancel-button").addEventListener("click", () => {
        formDialog.remove();
    });

    // Tallenna-toiminto
    document.getElementById("edit-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedTitle = document.getElementById("title").value;
        const updatedNotes = document.getElementById("notes").value;

        const updatedEvent = {
            title: updatedTitle,
            notes: updatedNotes,
        };

        const token = localStorage.getItem("token");

        // Muodosta oikea URL päivitykselle
        const updateUrl = `${API_BASE}/${event.extendedProps.category}/${event.extendedProps.id}`;

        try {
            // Lähetä PUT-pyyntö API:lle
            const response = await fetch(updateUrl, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedEvent)
            });

            if (response.ok) {
                alert("Merkintä päivitetty!");
                event.setProp("title", updatedTitle); // Päivitetään tapahtuman otsikko
                event.setExtendedProp("notes", updatedNotes); // Päivitetään muistiinpanot
                formDialog.remove(); // Suljetaan lomake
            } else {
                alert("Virhe päivittäessä merkintää!");
            }
        } catch (error) {
            console.error("Virhe päivittäessä merkintää:", error);
            alert("Virhe päivittäessä merkintää!");
        }
    });
}
