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

        // --- STATISZTIKÁK SZÁMOLÁSA ---
        const diffInTime = today.getTime() - nextPerson.birthDateObj.getTime();
        const daysAlive = Math.floor(diffInTime / (1000 * 3600 * 24)); // Hány napja él

        // 1. Kaki kalkulátor (napi 0.35 kg)
        const poopAmount = (daysAlive * 0.35).toLocaleString('hu-HU', {maximumFractionDigits: 0});

        // 2. Fingós stat (Lufi egyenérték)
        // Átlag napi 1.2 liter gáz / 14 literes lufi
        const fartsInBalloons = Math.floor((daysAlive * 1.2) / 14).toLocaleString('hu-HU');

        // 3. WC-n töltött idő
        // Napi 20 perc átlagosan -> hány nap jön ki belőle?
        const toiletDays = Math.floor((daysAlive * 20) / 1440); 

        // 4. Elfogyasztott elefántok
        // Napi 1.8 kg kaja / 6000 kg (afrikai elefánt súlya)
        const elephantsEaten = ((daysAlive * 1.8) / 6000).toFixed(2);

        // Alvás (marad, mert durva adat)
        const sleepYears = ((daysAlive / 365) / 3).toFixed(1);

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
                    <strong>Gáztermelésed</strong>
                    ${fartsInBalloons} db lufit fújna fel 🎈
                </div>
                <div class="stat-item">
                    <strong>WC-n töltött idő</strong>
                    ${toiletDays} teljes nap 🚽
                </div>
                <div class="stat-item">
                    <strong>Ennyit ettél meg</strong>
                    ${elephantsEaten} db afrikai elefánt 🐘
                </div>
                <div class="stat-item">
                    <strong>Alvással töltött idő</strong>
                    ${sleepYears} év 😴
                </div>
            </div>
        `;

        // 3. A többi ember listázása
        const listContainer = document.getElementById('list-container');
        listContainer.innerHTML = ''; 
        
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
        document.getElementById('list-container').innerHTML = '<p style="color:red">Hiba: Nem találom az adatok.json fájlt!</p>';
    });
