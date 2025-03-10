import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */document.addEventListener("DOMContentLoaded",()=>{console.log("Sivu ladattu"),d(),u(),g(),m()});const l="http://localhost:5000/api";function d(){const e=localStorage.getItem("nimi")||"Käyttäjä",t=document.getElementById("welcome-message");t?t.textContent=`Hei, ${e}`:console.error("Elementti 'welcome-message' ei löytynyt.")}async function u(){await n("entries","diary-entries")}async function g(){await n("metrics","health-data")}async function m(){await n("activities","activity-data")}async function n(e,t){try{const i=localStorage.getItem("token"),o=localStorage.getItem("user_id");if(!i||!o)throw new Error("Ei tokenia tai käyttäjä-ID:tä! Käyttäjä ei ole kirjautunut.");const a=await fetch(`${l}/${e}/user/${o}`,{headers:{Authorization:`Bearer ${i}`}});if(!a.ok)throw new Error(`Virhe ladattaessa: ${a.status} ${a.statusText}`);const s=await a.json(),r=document.getElementById(t);r?r.innerHTML=s.length?s.map(c=>p(e,c)).join(""):'<div class="box">Ei merkintöjä.</div>':console.error(`Elementti '${t}' ei löytynyt.`)}catch(i){console.error("Virhe fetch-haussa:",i);const o=document.getElementById(t);o&&(o.innerHTML='<div class="box error">Virhe ladattaessa.</div>')}}function p(e,t){return`
        <div class="box">
            <h3>Päivämäärä: ${t.entry_date||t.metric_date||t.activity_date}</h3>
            
            ${e==="entries"?`
                <p><strong>Mieliala:</strong> ${t.mood||"Ei tietoa"}</p>
                <p><strong>Paino:</strong> ${t.weight?t.weight+" kg":"Ei tietoa"}</p>
            `:""}
            
            ${e==="metrics"?`
                <p><strong>Verenpaine:</strong> ${t.blood_pressure||"Ei tietoa"}</p>
                <p><strong>Syke:</strong> ${t.heart_rate?t.heart_rate+" bpm":"Ei tietoa"}</p>
            `:""}
            
            ${e==="activities"?`
                <p><strong>Tyyppi:</strong> ${t.activity_type}</p>
                <p><strong>Kesto:</strong> ${t.duration_minutes} min</p>
                <p><strong>Poltetut kalorit:</strong> ${t.calories_burned?t.calories_burned+" kcal":"Ei tietoa"}</p>
            `:""}
            
            <p><strong>Muistiinpanot:</strong> ${t.notes||"Ei merkintöjä"}</p>
            
            <button class="edit-btn" onclick="editEntry('${e}', ${t.id})">✏️ Muokkaa</button>
        </div>
    `}
