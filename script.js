// --- ADATOK (Ide írd be a családtagokat!) ---
const familyData = [
    { name: "Anya", date: "1975-05-20" },
    { name: "Apa", date: "1972-08-15" },
    { name: "Bence", date: "2010-02-12" },
    { name: "Nagyi", date: "1950-12-05" },
    { name: "Kutya (Bodri)", date: "2018-06-01" }
];

// --- LOGIKA ---

const today = new Date();
today.setHours(0, 0, 0, 0); // Csak a dátum számítson, az idő ne

// Segédfüggvény: Következő szülinap kiszámolása
function getNextBirthday(birthDateString) {
    const birthDate = new Date(birthDateString);
    let nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (nextBday < today) {
        // Ha idén már volt, akkor jövőre lesz
        nextBday.setFullYear(today.getFullYear() + 1);
    }
    return nextBday;
}

// 1. Adatok feldolgozása és rendezése
const processedData = familyData.map(person => {
    const birthDate = new Date(person.date);
    const nextBday = getNextBirthday(person.date);
    const diffTime = nextBday - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Életkor kiszámítása (hány éves LESZ)
    let age = nextBday.getFullYear() - birthDate.getFullYear();

    return {
        ...person,
        birthDateObj: birthDate,
        nextBdayObj: nextBday,
        daysLeft: daysLeft,
        turningAge: age
    };
}).sort((a, b) => a.daysLeft - b.daysLeft); // Rendezzük, hogy ki a következő

// 2. Fókusz mód (A legelső ember a listán)
const nextPerson = processedData[0];
const focusContainer = document.getElementById('focus-card');

// Vicces statisztikák számolása
const diffInTime = today.getTime() - nextPerson.birthDateObj.getTime();
const daysAlive = Math.floor(diffInTime / (1000 * 3600 * 24));
const dogYears = Math.floor((daysAlive / 365) * 7);
const breaths = (daysAlive * 1440 * 16).toLocaleString('hu-HU'); // Átlag 16 légzés/perc
const heartBeats = (daysAlive * 1440 * 80).toLocaleString('hu-HU'); // Átlag 80 szívverés/perc
const sleepYears = ((daysAlive / 365) / 3).toFixed(1); // Életünk 1/3-át alvással töltjük

focusContainer.innerHTML = `
    <h2>${nextPerson.name}</h2>
    <div class="date">${nextPerson.daysLeft} nap múlva lesz ${nextPerson.turningAge} éves!</div>
    
    <div class="stats-grid">
        <div class="stat-item">
            <strong>Napja élsz a Földön</strong>
            ${daysAlive.toLocaleString('hu-HU')}
        </div>
        <div class="stat-item">
            <strong>Kutyaévekben</strong>
            ${dogYears} éves lennél
        </div>
        <div class="stat-item">
            <strong>Szívdobbanások</strong>
            ${heartBeats}
        </div>
        <div class="stat-item">
            <strong>Légvételek száma</strong>
            ${breaths}
        </div>
        <div class="stat-item">
            <strong>Alvással töltött idő</strong>
            ${sleepYears} év 😴
        </div>
        <div class="stat-item">
            <strong>Torták száma</strong>
            ${nextPerson.turningAge - 1} db elfogyasztva
        </div>
    </div>
`;

// 3. A többi ember listázása
const listContainer = document.getElementById('list-container');
processedData.slice(1).forEach(person => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
        <span class="name">${person.name} (${person.turningAge})</span>
        <span class="days-left">${person.daysLeft} nap múlva</span>
    `;
    listContainer.appendChild(div);
});
