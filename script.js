// A mai dátum beállítása (idő nélkül)
const today = new Date();
today.setHours(0, 0, 0, 0);

// Segédfüggvény: Következő szülinap kiszámolása
function getNextBirthday(birthDateString) {
    const birthDate = new Date(birthDateString);
    let nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (nextBday < today) {
        nextBday.setFullYear(today.getFullYear() + 1);
    }
    return nextBday;
}

// ADATOK BEOLVASÁSA (adatok.json fájlból)
fetch('adatok.json')
    .then(response => response.json())
    .then(familyData => {
        
        // 1. Adatok feldolgozása
        const processedData = familyData.map(person => {
            const birthDate = new Date(person.date);
            const nextBday = getNextBirthday(person.date);
            
            // Napok különbsége
            const diffTime = nextBday - today;
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Hány éves LESZ
            let age = nextBday.getFullYear() - birthDate.getFullYear();

            return {
                ...person,
                birthDateObj: birthDate,
                nextBdayObj: nextBday,
                daysLeft: daysLeft,
                turningAge: age
            };
        }).sort((a, b) => a.daysLeft - b.daysLeft); // Rendezés: ki jön hamarabb?

        // Ha nincs adat, ne csináljon semmit
        if (processedData.length === 0) return;

        // 2. Fókusz mód (A soron következő ünnepelt)
        const nextPerson = processedData[0];
        const focusContainer = document.getElementById('focus-card');

        // Vicces statisztikák számolása
        const diffInTime = today.getTime() - nextPerson.birthDateObj.getTime();
        const daysAlive = Math.floor(diffInTime / (1000 * 3600 * 24)); // Hány napja él

        // ÚJ STATISZTIKA: Kaki kalkulátor (napi 0.35 kg átlaggal)
        const poopAmount = (daysAlive * 0.35).toLocaleString('hu-HU', {maximumFractionDigits: 0});

        const breaths = (daysAlive * 1440 * 16).toLocaleString('hu-HU'); // 16 légzés/perc
        const heartBeats = (daysAlive * 1440 * 80).toLocaleString('hu-HU'); // 80 szívverés/perc
        const sleepYears = ((daysAlive / 365) / 3).toFixed(1); // Élet 1/3-a alvás

        focusContainer.innerHTML = `
            <h2>${nextPerson.name}</h2>
            <div class="date">${nextPerson.daysLeft} nap múlva lesz ${nextPerson.turningAge} éves!</div>
            
            <div class="stats-grid">
                <div class="stat-item">
                    <strong>Napja élsz a Földön</strong>
                    ${daysAlive.toLocaleString('hu-HU')}
                </div>
                <div class="stat-item">
                    <strong>Termelt "végtermék"</strong>
                    kb. ${poopAmount} kg 💩
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
                    <strong>Szülinapi torták</strong>
                    ${nextPerson.turningAge - 1} db elfogyasztva
                </div>
            </div>
        `;

        // 3. A többi ember listázása
        const listContainer = document.getElementById('list-container');
        listContainer.innerHTML = ''; // Törlés először
        
        processedData.slice(1).forEach(person => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <span class="name">${person.name} (${person.turningAge})</span>
                <span class="days-left">${person.daysLeft} nap múlva</span>
            `;
            listContainer.appendChild(div);
        });
    })
    .catch(error => {
        console.error('Hiba az adatok betöltésekor:', error);
        document.getElementById('list-container').innerHTML = '<p style="color:red">Nem sikerült betölteni az adatokat. Ellenőrizd az adatok.json fájlt!</p>';
    });
