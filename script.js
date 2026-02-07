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
        }).sort((a, b) => a.daysLeft - b.daysLeft); // Rendezés

        if (processedData.length === 0) return;

        // 2. Fókusz mód (A soron következő ünnepelt)
        const nextPerson = processedData[0];
        const focusContainer = document.getElementById('focus-card');

        // --- STATISZTIKÁK SZÁMOLÁSA ---
        const diffInTime = today.getTime() - nextPerson.birthDateObj.getTime();
        const daysAlive = Math.floor(diffInTime / (1000 * 3600 * 24)); // Hány napja él

        // 1. Kaki kalkulátor (napi 0.35 kg átlag)
        const poopAmount = (daysAlive * 0.35).toLocaleString('hu-HU', {maximumFractionDigits: 0});

        // 2. Fingós stat (Lufi egyenérték: 1.2 liter gáz / 14 literes lufi)
        const fartsInBalloons = Math.floor((daysAlive * 1.2) / 14).toLocaleString('hu-HU');

        // 3. WC-n töltött idő (Napi 20 perc átlagosan)
        const toiletDays = Math.floor((daysAlive * 20) / 1440); 

        // 4. Elfogyasztott elefántok (Napi 1.8 kg kaja / 6000 kg elefánt)
        const elephantsEaten = ((daysAlive * 1.8) / 6000).toFixed(2);

        // 5. Alvás (életünk 1/3-a)
        const sleepYears = ((daysAlive / 365) / 3).toFixed(1);

        // HTML Generálás
        focusContainer.innerHTML = `
            <h2>${nextPerson.name}</h2>
            <div class="date">${nextPerson.daysLeft} nap múlva ${nextPerson.turningAge}!</div>
            
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-emoji">🌍</span>
                    <span class="stat-value">${daysAlive.toLocaleString('hu-HU')}</span>
                    <span class="stat-label">Napja élsz</span>
                </div>
                <div class="stat-item">
                    <span class="stat-emoji">💩</span>
                    <span class="stat-value">${poopAmount} kg</span>
                    <span class="stat-label">Végtermék</span>
                </div>
                <div class="stat-item">
                    <span class="stat-emoji">🎈</span>
                    <span class="stat-value">${fartsInBalloons} db</span>
                    <span class="stat-label">Puki-lufi</span>
                </div>
                <div class="stat-item">
                    <span class="stat-emoji">🚽</span>
                    <span class="stat-value">${toiletDays} nap</span>
                    <span class="stat-label">WC-n ülve</span>
                </div>
                <div class="stat-item">
                    <span class="stat-emoji">🐘</span>
                    <span class="stat-value">${elephantsEaten} db</span>
                    <span class="stat-label">Elefánt (kaja)</span>
                </div>
                <div class="stat-item">
                    <span class="stat-emoji">😴</span>
                    <span class="stat-value">${sleepYears} év</span>
                    <span class="stat-label">Alvás</span>
                </div>
            </div>
        `;

        // 3. A többiek listázása
        const listContainer = document.getElementById('list-container');
        listContainer.innerHTML = ''; 
        
        processedData.slice(1).forEach(person => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `
                <div class="name">${person.name} (${person.turningAge})</div>
                <div class="days-badge">${person.daysLeft} nap</div>
            `;
            listContainer.appendChild(div);
        });
    })
    .catch(error => {
        console.error('Hiba:', error);
        document.getElementById('focus-card').innerHTML = '<p>Nem sikerült betölteni az adatokat!</p>';
    });
