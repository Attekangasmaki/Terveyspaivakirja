import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */document.addEventListener("DOMContentLoaded",async()=>{console.log("Kalenteri ladattu"),C(),await k(),await w()});const g="http://localhost:5000/api";function C(){const e=localStorage.getItem("nimi")||"Käyttäjä",o=document.getElementById("welcome-message");o&&(o.textContent=`Hei, ${e}`)}function v(e){return e.split("T")[0]}async function w(){try{const[e,o,n]=await Promise.all([y("entries"),y("metrics"),y("activities")]),i=o.filter(t=>t.blood_pressure).map(t=>({date:v(t.metric_date),bloodPressure:t.blood_pressure})).sort((t,r)=>new Date(t.date)-new Date(r.date)),l=o.filter(t=>t.heart_rate).map(t=>({date:v(t.metric_date),heartRate:t.heart_rate})).sort((t,r)=>new Date(t.date)-new Date(r.date)),s=e.filter(t=>t.weight).map(t=>({date:v(t.entry_date),weight:t.weight})).sort((t,r)=>new Date(t.date)-new Date(r.date)),a=n.filter(t=>t.calories_burned).map(t=>({date:v(t.activity_date),calories:t.calories_burned})).sort((t,r)=>new Date(t.date)-new Date(r.date));_(i),P(l),x(s),$(a),B(s,a,i,l)}catch(e){console.error("Virhe haettaessa terveystietoja:",e)}}function B(e,o,n,i){var h,d;const l=((h=e[0])==null?void 0:h.weight)||0,a=(((d=e[e.length-1])==null?void 0:d.weight)||0)-l,t=o.reduce((c,m)=>c+m.calories,0),r=n.reduce((c,m)=>{const[p]=m.bloodPressure.split("/").map(Number);return c+p},0)/n.length||0,u=i.reduce((c,m)=>c+m.heartRate,0)/i.length||0;document.getElementById("weightChange").textContent=`${a.toFixed(2)} kg`,document.getElementById("caloriesBurned").textContent=`${t} kcal`,document.getElementById("averageBloodPressure").textContent=`${r.toFixed(1)} mmHg`,document.getElementById("averageHeartRate").textContent=`${u.toFixed(1)} bpm`}function _(e){const o=document.getElementById("bloodPressureChart").getContext("2d");new Chart(o,{type:"line",data:{labels:e.map(n=>n.date),datasets:[{label:"Verenpaine",data:e.map(n=>parseInt(n.bloodPressure.split("/")[0])),borderColor:"red",backgroundColor:"rgba(255, 0, 0, 0.2)",fill:!0}]},options:{responsive:!0}})}function P(e){const o=document.getElementById("heartRateChart").getContext("2d");new Chart(o,{type:"line",data:{labels:e.map(n=>n.date),datasets:[{label:"Syke (bpm)",data:e.map(n=>n.heartRate),borderColor:"blue",backgroundColor:"rgba(0, 0, 255, 0.2)",fill:!0}]},options:{responsive:!0}})}function x(e){const o=document.getElementById("weightChart").getContext("2d");new Chart(o,{type:"line",data:{labels:e.map(n=>n.date),datasets:[{label:"Paino (kg)",data:e.map(n=>n.weight),borderColor:"green",backgroundColor:"rgba(0, 255, 0, 0.2)",fill:!0}]},options:{responsive:!0}})}function $(e){const o=document.getElementById("caloriesChart").getContext("2d");new Chart(o,{type:"line",data:{labels:e.map(n=>n.date),datasets:[{label:"Poltetut kalorit (kcal)",data:e.map(n=>n.calories),borderColor:"orange",backgroundColor:"rgba(255, 165, 0, 0.2)",fill:!0}]},options:{responsive:!0}})}async function k(){try{const e=localStorage.getItem("token"),o=localStorage.getItem("user_id");if(!e||!o)throw new Error("Ei tokenia tai käyttäjätunnusta! Käyttäjä ei ole kirjautunut.");const[n,i,l]=await Promise.all([y("entries"),y("metrics"),y("activities")]),s=[...n,...i,...l].map(a=>{let t,r;return a.entry_id?(t=a.entry_id,r="diaryentry"):a.metric_id?(t=a.metric_id,r="metrics"):a.activity_id&&(t=a.activity_id,r="activities"),{title:S(a),start:a.entry_date||a.metric_date||a.activity_date,extendedProps:{type:a.type||a.activity_type||a.metric_type,notes:a.notes,id:t,category:r}}});f(s)}catch(e){console.error("Virhe ladattaessa kalenteria:",e),f([])}}async function y(e){const o=localStorage.getItem("token"),n=localStorage.getItem("user_id"),i=await fetch(`${g}/${e}/user/${n}`,{headers:{Authorization:`Bearer ${o}`}});if(!i.ok)throw new Error(`Virhe ladattaessa ${e}`);return i.json()}function S(e){return e.activity_type?`🏃 ${e.activity_type} (${e.duration_minutes} min)`:e.blood_pressure?`💓 Verenpaine: ${e.blood_pressure}`:e.mood?`😊 Mieliala: ${e.mood}`:"📌 Merkintä"}function D(e){const o=document.createElement("div");o.id="add-entry-form-dialog",o.innerHTML=`
        <div class="dialog-content">
            <h2>Lisää uusi merkintä</h2>
            <p><strong>Päivämäärä:</strong> ${new Date(e).toLocaleDateString()}</p>
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
    `,document.body.appendChild(o);const n=document.getElementById("entry-type"),i=document.getElementById("dynamic-fields");n.addEventListener("change",l),l();function l(){const s=n.value;i.innerHTML="",s==="diaryentry"?i.innerHTML=`
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
            `:s==="metrics"?i.innerHTML=`
                <label for="blood-pressure">Verenpaine:</label>
                <input type="text" id="blood-pressure" placeholder="Esim. 120/80">
                <label for="heart-rate">Syke:</label>
                <input type="number" id="heart-rate" placeholder="Syke bpm">
            `:s==="activities"&&(i.innerHTML=`
                <label for="activity-type">Tyyppi:</label>
                <input type="text" id="activity-type" placeholder="Esim. Juoksu, Kuntosali">
                <label for="duration">Kesto (min):</label>
                <input type="number" id="duration" placeholder="Kesto minuuteissa">
                <label for="calories">Poltetut kalorit:</label>
                <input type="number" id="calories" placeholder="Kalorit kcal">
            `)}document.getElementById("add-entry-form").addEventListener("submit",async s=>{s.preventDefault();const a=n.value,t=document.getElementById("notes").value,r=localStorage.getItem("user_id"),u=localStorage.getItem("token");if(!r||r==="undefined"||r===null){console.error("Käyttäjätunnus puuttuu! localStorage: ",localStorage),alert("Käyttäjätunnus puuttuu! Varmista, että olet kirjautunut sisään.");return}if(!t){alert("Muistiinpanot ovat pakollisia.");return}const h=new Date(e).toISOString().split("T")[0];let d={user_id:r,notes:t,entry_date:h},c,m="POST";a==="diaryentry"?(d.mood=document.getElementById("mood").value,d.weight=parseFloat(document.getElementById("weight").value)||null,d.sleep=parseFloat(document.getElementById("sleep").value)||null,c=`${g}/entries/insert`):a==="metrics"?(d.blood_pressure=document.getElementById("blood-pressure").value,d.heart_rate=parseInt(document.getElementById("heart-rate").value)||null,c=`${g}/metrics/insert`):a==="activities"&&(d.activity_type=document.getElementById("activity-type").value,d.duration_minutes=parseInt(document.getElementById("duration").value)||null,d.calories_burned=parseInt(document.getElementById("calories").value)||null,c=`${g}/activities/insert`),console.log("Lähetettävät tiedot:",d);try{const p=await fetch(c,{method:m,headers:{Authorization:`Bearer ${u}`,"Content-Type":"application/json"},body:JSON.stringify(d)}),b=await p.json();if(console.log("API-vastaus:",b),p.ok)alert("Merkintä lisätty!"),o.remove(),k();else{const E=b.errors?b.errors.map(I=>I.message).join(", "):"Tuntematon virhe";console.error("Virhe API-vastauksessa:",b),alert("Virhe lisättäessä merkintää: "+E)}}catch(p){console.error("Virhe lisättäessä merkintää:",p),alert("Virhe lisättäessä merkintää.")}}),document.getElementById("close-form-button").addEventListener("click",()=>{o.remove()})}function f(e){const o=document.getElementById("calendar");new FullCalendar.Calendar(o,{initialView:"dayGridMonth",locale:"fi",events:e,dateClick:function(i){D(i.dateStr)},eventClick:function(i){const l=i.event,s=l.extendedProps.id,a=l.extendedProps.category,t=document.createElement("div");t.id="event-dialog",t.innerHTML=`
                <div class="dialog-content">
                    <h2>Valitse toiminto</h2>
                    <p><strong>${l.title}</strong></p>
                    <p>${l.extendedProps.notes||"Ei muistiinpanoja"}</p>
                    <div class="dialog-buttons">
                        <button id="edit-button">Muokkaa</button>
                        <button id="delete-button">Poista</button>
                        <button id="close-button">Sulje</button>
                    </div>
                </div>
            `,document.body.appendChild(t),document.getElementById("close-button").addEventListener("click",()=>{t.remove()}),document.getElementById("edit-button").addEventListener("click",()=>{T(l),t.remove()}),document.getElementById("delete-button").addEventListener("click",async()=>{if(!s||!a){console.error("Virheellinen ID tai kategoria",{entryId:s,category:a}),alert("Virhe: ID tai kategoria puuttuu!");return}const r=`${g}/${a}/${s}`;console.log("Poistetaan merkintä URL:stä:",r);try{const u=localStorage.getItem("token");(await fetch(r,{method:"DELETE",headers:{Authorization:`Bearer ${u}`,"Content-Type":"application/json"}})).ok?(alert("Merkintä poistettu!"),t.remove(),i.event.remove()):alert("Virhe poistettaessa merkintää!")}catch(u){console.error("Virhe poistettaessa merkintää:",u),alert("Virhe poistettaessa merkintää!")}})}}).render()}function T(e){const o=document.createElement("div");o.id="edit-form-dialog",o.innerHTML=`
        <div class="form-content">
            <h2>Muokkaa merkintää</h2>
            <form id="edit-form">
                <label for="title">Otsikko:</label>
                <input type="text" id="title" value="${e.title}" required>
                <label for="notes">Muistiinpanot:</label>
                <textarea id="notes">${e.extendedProps.notes||""}</textarea>
                <div class="form-buttons">
                    <button type="submit">Tallenna</button>
                    <button type="button" id="cancel-button">Peruuta</button>
                </div>
            </form>
        </div>
    `,document.body.appendChild(o),document.getElementById("cancel-button").addEventListener("click",()=>{o.remove()}),document.getElementById("edit-form").addEventListener("submit",async n=>{n.preventDefault();const i=document.getElementById("title").value,l=document.getElementById("notes").value,s={title:i,notes:l},a=localStorage.getItem("token"),t=`${g}/${e.extendedProps.category}/${e.extendedProps.id}`;try{(await fetch(t,{method:"PUT",headers:{Authorization:`Bearer ${a}`,"Content-Type":"application/json"},body:JSON.stringify(s)})).ok?(alert("Merkintä päivitetty!"),e.setProp("title",i),e.setExtendedProp("notes",l),o.remove()):alert("Virhe päivittäessä merkintää!")}catch(r){console.error("Virhe päivittäessä merkintää:",r),alert("Virhe päivittäessä merkintää!")}})}
