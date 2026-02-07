// A mai dátum
const today = new Date();
today.setHours(0, 0, 0, 0);

function getNextBirthday(birthDateString) {
    const birthDate = new Date(birthDateString);
    let nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBday < today) {
        nextBday.setFullYear(today.getFullYear() + 1);
    }
    return nextBday;
}

// --- EGYEDI ADATBÁZIS A CSALÁDHOZ (Bespoke) ---
// Itt állítottam be kézzel a pontos horoszkópot és a híres "ikertestvért"
const extraData = {
    "Mammy": { zodiac: "Dragon", celeb: "Britney Spears" },  // 1976 (Dec 02)
    "Papi":  { zodiac: "Rabbit", celeb: "Hugh Hefner" },     // 1951 (Apr 09) - ;)
    "Juli":  { zodiac: "Pig",    celeb: "Johnny Cash" },     // 2007 (Feb 26)
    "Cila":  { zodiac: "Dragon", celeb: "Sean Connery" },    // 1988 (Aug 25)
    "Andris":{ zodiac: "Ox",     celeb: "Elon Musk" },       // 1985 (Jun 28)
    "Zsófi": { zodiac: "Snake",  celeb: "The Weeknd" },      // 2025 (Feb 16)
    "Orsi":  { zodiac: "Goat",   celeb: "Jenna Ortega" },    // 1991 (Sep 27) - Wednesday Addams
    "Marci": { zodiac: "Tiger",  celeb: "Zoë Kravitz" },     // 2022 (Dec 01)
    "Misi":  { zodiac: "Dragon", celeb: "Rod Stewart" },     // 2025 (Jan 10) - Még Sárkány!
    "Bukis": { zodiac: "Horse",  celeb: "Spike Lee" }        // 1990 (Mar 20)
};

// 2026-os (Ló éve) Jóslatok
const zodiacPredictions = {
    "Dragon": "2026-ban tele leszel energiával, csak arra figyelj, hogy ne vállald túl magad!",
    "Rabbit": "Nyugodt, harmonikus év vár rád. A családi életedben sok örömöd lesz.",
    "Pig":    "A társasági életed felpörög, rengeteg új élmény és buli vár!",
    "Ox":     "A kemény munka idén beérik, anyagilag nagyon sikeres éved lesz.",
    "Snake":  "Bölcs döntéseket hozol, végre fellélegezhetsz és pihenhetsz kicsit.",
    "Goat":   "Szerencsés csillagzat alatt állsz, kreativitásod szárnyalni fog!",
    "Tiger":  "Vezetői éned előtör, idén bármit elérhetsz, amit a fejedbe veszel.",
    "Horse":  "Ez a Te éved! Ragyogni fogsz, minden szem rád szegeződik. Hajrá!",
    "Rat":    "Kicsit rázós év lehet, de a leleményességeddel mindent megoldasz.",
    "Dog":    "Hűséges barátok segítenek, nagyon kiegyensúlyozott éved lesz.",
    "Monkey": "Izgalmas utazások és váratlan fordulatok éve. Nem fogsz unatkozni!",
    "Rooster":"A szerelemben és a kapcsolataidban várható nagy előrelépés."
};

// --- JAVÍTOTT ANIMÁCIÓS FÜGGVÉNY ---
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const duration = 2000; 

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const isFloat = counter.getAttribute('data-float') === "true";
        
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1); 

            const currentVal = progress * target;

            if (isFloat) {
                counter.innerText = currentVal.toLocaleString('hu-HU', {
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2
                });
            } else {
                counter.innerText = Math.floor(currentVal).toLocaleString('hu-HU');
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                if (isFloat) {
                    counter.innerText = target.toLocaleString('hu-HU', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                } else {
                    counter.innerText = target.toLocaleString('hu-HU');
                }
            }
        };

        requestAnimationFrame(step);
    });
}

fetch('adatok.json')
    .then(response => response.json())
    .then(familyData => {
        
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
                turningAge: age
            };
        }).sort((a, b) => a.daysLeft - b.daysLeft);

        if (processedData.length === 0) return;

        const nextPerson = processedData[0];
        const gridContainer = document.getElementById('dashboard-grid');

        // Statisztikák számolása
        const diffInTime = today.getTime() - nextPerson.birthDateObj.getTime();
        const daysAlive = Math.floor(diffInTime / (1000 * 3600 * 24));
        
        // Kaki matek
        const poopMultiplier = (nextPerson.turningAge < 2) ? 0.15 : 0.35;
        const poopAmount = daysAlive * poopMultiplier; 

        // ÚJ: Testi statisztikák
        // Haj: kb 15 cm / év (0.04 cm / nap)
        const hairGrowth = (daysAlive * 0.04) / 100; // méterben
        // Köröm: kb 3.5 cm / év (0.01 cm / nap)
        const nailGrowth = (daysAlive * 0.01) / 100; // méterben
        // Bőr: kb 0.5 kg / év (0.0014 kg / nap) - ez egy óvatos becslés
        const skinShed = daysAlive * 0.0014;

        // Egyedi adatok betöltése
        const personExtras = extraData[nextPerson.name] || { zodiac: "Tiger", celeb: "Ismeretlen" };
        const horoscopeText = zodiacPredictions[personExtras.zodiac] || "Szerencsés év vár rád!";

        // HTML ÉPÍTÉS
        gridContainer.innerHTML = `
            <div class="card grid-item-main next-person-card">
                <div class="next-label">KÖVETKEZŐ ÜNNEPELT</div>
                <div class="next-name">${nextPerson.name}</div>
                <div class="next-details">
                    <span class="counter" data-target="${nextPerson.daysLeft}">0</span> nap múlva ${nextPerson.turningAge} éves!
                </div>
            </div>

            <div class="card stat-card bg-retro-green">
                <div class="stat-icon">👯‍♂️</div>
                <div class="stat-desc" style="font-size: 0.9rem; margin-bottom:5px;">Szülinapi Iker:</div>
                <div class="stat-number" style="font-size: 1.1rem;">${personExtras.celeb}</div>
            </div>

            <div class="card stat-card bg-retro-purple" style="grid-column: span 2;">
                <div class="stat-icon">🐉</div>
                <div class="stat-number" style="font-size: 1.2rem;">${personExtras.zodiac} éve</div>
                <div class="stat-desc" style="text-transform: none; font-weight: 500; margin-top: 5px;">
                    "${horoscopeText}"
                </div>
            </div>

            <div class="card stat-card bg-retro-blue">
                <div class="stat-icon">💇‍♀️</div>
                <div class="stat-number"><span class="counter" data-target="${hairGrowth}" data-float="true">0</span> m</div>
                <div class="stat-desc">Hajat növesztettél</div>
            </div>

            <div class="card stat-card bg-retro-yellow">
                <div class="stat-icon">💅</div>
                <div class="stat-number"><span class="counter" data-target="${nailGrowth}" data-float="true">0</span> m</div>
                <div class="stat-desc">Körmöt vágtál le</div>
            </div>

            <div class="card stat-card bg-retro-pink">
                <div class="stat-icon">🐍</div>
                <div class="stat-number"><span class="counter" data-target="${skinShed}" data-float="true">0</span> kg</div>
                <div class="stat-desc">Bőrt vedlettél le</div>
            </div>
            
            <div class="card stat-card bg-retro-orange">
                <div class="stat-icon">💩</div>
                <div class="stat-number"><span class="counter" data-target="${poopAmount}" data-float="${poopAmount < 100 ? 'true' : 'false'}">0</span> kg</div>
                <div class="stat-desc">Végtermék</div>
            </div>

             <div class="card stat-card bg-white" style="grid-column: span 2;">
                <div class="stat-icon">🎂</div>
                <div class="stat-number counter" data-target="${nextPerson.turningAge - 1}">0</div>
                <div class="stat-desc">Elfogyasztott torta</div>
            </div>
        `;

        animateCounters();

        const listContainer = document.getElementById('list-container');
        listContainer.innerHTML = '';
        
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
