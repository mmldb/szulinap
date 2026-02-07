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

// --- 1. KÍNAI HOROSZKÓP ---
const zodiacSigns = [
    { name: "Majom", icon: "🐒", text: "Zseniális problémamegoldó vagy, kreativitásod sikert hoz." },      
    { name: "Kakas", icon: "🐓", text: "Pontosságod és szorgalmad nagy elismerést vált ki." },      
    { name: "Kutya", icon: "🐕", text: "Hűséges barátaid mindenben támogatnak." },   
    { name: "Disznó", icon: "🐖", text: "Élvezd az életet! A szerencse most melléd szegődik." },     
    { name: "Patkány", icon: "🐀", text: "Leleményességeddel minden akadályt legyőzöl." },
    { name: "Bivaly", icon: "🐂", text: "A kemény munka beérik, amit építesz, tartós lesz." },        
    { name: "Tigris", icon: "🐅", text: "Vezetésre születtél, bátorságod új kalandok felé repít." },         
    { name: "Nyúl", icon: "🐇", text: "Diplomáciai érzéked aranyat ér, békés időszak jön." },   
    { name: "Sárkány", icon: "🐉", text: "Erőd hegyeket mozgat meg. Merj nagyot álmodni!" },     
    { name: "Kígyó", icon: "🐍", text: "Bölcs döntéseket hozol, hallgass a megérzéseidre." },     
    { name: "Ló", icon: "🐎", text: "Szabadságvágyad hajt, ez az év a nagy utazásoké." },        
    { name: "Kecske", icon: "🐐", text: "Művészi vénád szárnyal, kezdj új hobbiba!" }         
];

// --- 2. HÍRESSÉGEK ---
const celebDatabase = {
    "Mammy": "Ryan Reynolds",        
    "Papi":  "Robin Williams",       
    "Juli":  "Arnold Schwarzenegger",
    "Cila":  "Rihanna",              
    "Andris": "Cristiano Ronaldo",   
    "Zsófi": "Taylor Swift",         
    "Orsi":  "Ed Sheeran",           
    "Marci": "Leonardo DiCaprio",    
    "Misi":  "Lionel Messi",         
    "Bukis": "Emma Watson"           
};

// --- ANIMÁCIÓ ---
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

        // --- STATISZTIKÁK SZÁMOLÁSA ---
        const diffInTime = today.getTime() - nextPerson.birthDateObj.getTime();
        const daysAlive = Math.floor(diffInTime / (1000 * 3600 * 24));
        
        const poopMultiplier = (nextPerson.turningAge < 2) ? 0.15 : 0.35;
        const poopAmount = daysAlive * poopMultiplier; 
        const farts = Math.floor((daysAlive * 1.2) / 14); 
        const sleepYears = ((daysAlive / 365) / 3); 
        const elephantsEaten = ((daysAlive * 1.8) / 6000); 

        // Horoszkóp
        const zodiacIndex = nextPerson.birthYear % 12;
        const myZodiac = zodiacSigns[zodiacIndex];
        const myCeleb = celebDatabase[nextPerson.name] || "Ismeretlen sztár";

        // --- 1. FŐKÁRTYA BEILLESZTÉSE ---
        const focusHTML = `
            <div class="top-label"><span>Következő ünnepelt</span></div>
            <div class="main-card">
                <div class="main-name">${nextPerson.name}</div>
                <div class="main-details">
                    <span class="counter" data-target="${nextPerson.daysLeft}">0</span> nap múlva ${nextPerson.turningAge} éves!
                </div>
            </div>
        `;
        document.getElementById('focus-container').innerHTML = focusHTML;

        // --- 2. RÁCS BEILLESZTÉSE (RETRO SZÍNEKKEL!) ---
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

        // Animáció indítása
        animateCounters();

        // --- 3. LISTA BEILLESZTÉSE ---
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
    .catch(error => {
        console.error('Hiba:', error);
        document.getElementById('focus-container').innerHTML = '<p style="text-align:center; color:red;">Hiba történt az adatok betöltésekor. Ellenőrizd a konzolt!</p>';
    });
