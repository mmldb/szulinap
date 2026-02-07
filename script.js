// A mai dátum
const today = new Date();
today.setHours(0, 0, 0, 0);
const currentYear = today.getFullYear();

function getNextBirthday(birthDateString) {
    const birthDate = new Date(birthDateString);
    let nextBday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    if (nextBday < today) {
        nextBday.setFullYear(currentYear + 1);
    }
    return nextBday;
}

// --- 1. KÍNAI HOROSZKÓP ADATBÁZIS (Generált) ---
// A születési év maradéka (year % 12) alapján
const zodiacSigns = [
    { name: "Majom", icon: "🐒", text: "Zseniális problémamegoldó vagy, idén a kreativitásod hoz sikert." },      // 0
    { name: "Kakas", icon: "🐓", text: "A pontosságod és szorgalmad idén végre nagy elismerést vált ki." },      // 1
    { name: "Kutya", icon: "🐕", text: "Hűséges barátaid idén mindenben támogatnak. Harmonikus év vár rád." },   // 2
    { name: "Disznó", icon: "🐖", text: "Élvezd az életet! A szerencse most melléd szegődik, használd ki." },     // 3
    { name: "Patkány", icon: "🐀", text: "Leleményességeddel minden akadályt legyőzöl és anyagilag gyarapodsz." },// 4
    { name: "Bivaly", icon: "🐂", text: "A kemény munka beérik. Amit idén felépítesz, az tartós marad." },        // 5
    { name: "Tigris", icon: "🐅", text: "Vezetésre születtél. Idén bátorságod új kalandok felé repít." },         // 6
    { name: "Nyúl", icon: "🐇", text: "A diplomáciai érzéked aranyat ér. Békés, nyugodt időszak következik." },   // 7
    { name: "Sárkány", icon: "🐉", text: "Erőd és karizmád hegyeket mozgat meg. Merj idén nagyot álmodni!" },     // 8
    { name: "Kígyó", icon: "🐍", text: "Bölcs döntéseket hozol. Hallgass a megérzéseidre, nem csapnak be." },     // 9
    { name: "Ló", icon: "🐎", text: "Szabadságvágyad hajt előre. Ez az év a nagy utazásokról szólhat." },        // 10
    { name: "Kecske", icon: "🐐", text: "Művészi vénád szárnyal. Most érdemes valami új hobbiba fogni!" }         // 11
];

// --- 2. HÍRESSÉGEK (Generáció-független ikonok) ---
// Kézzel párosítva a családtagok évéhez, hogy biztosan stimmeljen
const celebDatabase = {
    "Mammy": "Ryan Reynolds",        // 1976 (Sárkány)
    "Papi":  "Robin Williams",       // 1951 (Nyúl)
    "Juli":  "Arnold Schwarzenegger",// 2007 (Disznó) - Vicces kontraszt
    "Cila":  "Rihanna",              // 1988 (Sárkány)
    "Andris": "Cristiano Ronaldo",   // 1985 (Bivaly) - Mindenki ismeri
    "Zsófi": "Taylor Swift",         // 2025 (Kígyó) - A legnagyobb sztár most
    "Orsi":  "Ed Sheeran",           // 1991 (Kecske)
    "Marci": "Leonardo DiCaprio",    // 2022 (Tigris) - Örök klasszikus
    "Misi":  "Lionel Messi",         // 2025/1987 (Nyúl/Kígyó) - Messi mindenhol jó
    "Bukis": "Emma Watson"           // 1990 (Ló) - Harry Potter miatt mindenki ismeri
};

// --- ANIMÁCIÓ (Counter) ---
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const duration = 1500; 

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const isFloat = counter.getAttribute('data-float') === "true";
        
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1); 
            const currentVal = progress * target;

            if (isFloat) {
                counter.innerText = currentVal.toLocaleString('hu-HU', {minimumFractionDigits: 2, maximumFractionDigits: 2});
            } else {
                counter.innerText = Math.floor(currentVal).toLocaleString('hu-HU');
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                // Végleges pontos érték
                const finalVal = isFloat ? target.toLocaleString('hu-HU', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : target.toLocaleString('hu-HU');
                counter.innerText = finalVal;
            }
        };
        requestAnimationFrame(step);
    });
}

fetch('adatok.json')
    .then(response => response.json())
    .then(familyData => {
        
        // Adatok feldolgozása
        const processedData = familyData.map(person => {
            const birthDate = new Date(person.date);
            const nextBday = getNextBirthday(person.date);
            const diffTime = nextBday - today;
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            let age = nextBday.getFullYear() - birthDate.getFullYear();

            return {
                ...person,
                birthDateObj: birthDate,
                daysLeft: daysLeft,
                turningAge: age,
                birthYear: birthDate.getFullYear()
            };
        }).sort((a, b) => a.daysLeft - b.daysLeft);

        if (processedData.length === 0) return;

        const nextPerson = processedData[0];
        const gridContainer = document.getElementById('dashboard-grid');

        // --- STATISZTIKÁK SZÁMOLÁSA ---
        const diffInTime = today.getTime() - nextPerson.birthDateObj.getTime();
        const daysAlive = Math.floor(diffInTime / (1000 * 3600 * 24));
        
        // 1. Kaki (Babáknak kevesebb)
        const poopMultiplier = (nextPerson.turningAge < 2) ? 0.15 : 0.35;
        const poopAmount = daysAlive * poopMultiplier; 

        // 2. Puki
        const farts = Math.floor((daysAlive * 1.2) / 14); 

        // 3. Alvás
        const sleepYears = ((daysAlive / 365) / 3); 
        
        // 4. Elefánt (Kaja)
        const elephantsEaten = ((daysAlive * 1.8) / 6000); 

        // 5. Horoszkóp generálása (Évszám alapján)
        // A kínai horoszkóp 12 éves ciklus, 0-tól indul. 
        // A "zodiacSigns" tömböm sorrendje a maradékos osztáshoz van igazítva.
        const zodiacIndex = nextPerson.birthYear % 12;
        const myZodiac = zodiacSigns[zodiacIndex];

        // 6. Híresség keresése
        const myCeleb = celebDatabase[nextPerson.name] || "Ismeretlen sztár";

        // --- HTML ÉPÍTÉS (Vissza a referenciaképhez!) ---
        
        // FŐ KÁRTYA (Külön divben)
        document.querySelector('.container').innerHTML = `
            <div class="top-label"><span>Következő ünnepelt</span></div>
            <div class="main-card">
                <div class="main-name">${nextPerson.name}</div>
                <div class="main-details">
                    <span class="counter" data-target="${nextPerson.daysLeft}">0</span> nap múlva ${nextPerson.turningAge} éves!
                </div>
            </div>
            
            <div id="dashboard-grid" class="dashboard-grid">
                </div>

            <div id="list-container" class="list-container"></div>
        `;

        // KIS KÁRTYÁK
        const gridHTML = `
            <div class="card bg-blue">
                <div class="stat-icon">🌍</div>
                <div class="stat-number counter" data-target="${daysAlive}">0</div>
                <div class="stat-desc">Napja élsz</div>
            </div>

            <div class="card bg-pink">
                <div class="stat-icon">💩</div>
                <div class="stat-number"><span class="counter" data-target="${poopAmount}" data-float="${poopAmount < 100 ? 'true' : 'false'}">0</span> kg</div>
                <div class="stat-desc">Végtermék</div>
            </div>

            <div class="card bg-green">
                <div class="stat-icon">🎈</div>
                <div class="stat-number"><span class="counter" data-target="${farts}">0</span> db</div>
                <div class="stat-desc">Puki-lufi</div>
            </div>

            <div class="card bg-white">
                <div class="stat-icon">😴</div>
                <div class="stat-number"><span class="counter" data-target="${sleepYears}" data-float="true">0</span> év</div>
                <div class="stat-desc">Alvás</div>
            </div>
            
             <div class="card bg-white">
                <div class="stat-icon">🐘</div>
                <div class="stat-number"><span class="counter" data-target="${elephantsEaten}" data-float="true">0</span> db</div>
                <div class="stat-desc">Elefánt (kaja)</div>
            </div>

             <div class="card bg-white">
                <div class="stat-icon">🎂</div>
                <div class="stat-number counter" data-target="${nextPerson.turningAge - 1}">0</div>
                <div class="stat-desc">Torta</div>
            </div>

            <div class="card bg-orange" style="grid-column: span 2;">
                <div class="stat-icon">🌟</div>
                <div class="stat-desc" style="margin-bottom: 5px; opacity:1;">Szülinapi Iker</div>
                <div class="stat-number" style="font-size: 1.2rem;">${myCeleb}</div>
            </div>

            <div class="card bg-purple" style="grid-column: span 2;">
                <div class="stat-icon">${myZodiac.icon}</div>
                <div class="stat-desc" style="margin-bottom: 5px; opacity:1;">${myZodiac.name} éve</div>
                <div class="stat-desc" style="text-transform: none; font-weight: 500; font-size: 0.8rem; line-height: 1.3;">
                    "${myZodiac.text}"
                </div>
            </div>
        `;

        document.getElementById('dashboard-grid').innerHTML = gridHTML;
        animateCounters();

        // Lista alul
        const listContainer = document.getElementById('list-container');
        processedData.slice(1).forEach(person => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <div class="list-name">${person.name} (${person.turningAge})</div>
                <div class="list-days">${person.daysLeft} nap</div>
            `;
            listContainer.appendChild(div);
        });

    })
    .catch(error => console.error('Hiba:', error));
