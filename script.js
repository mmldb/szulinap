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

// ADATOK BEOLVASÁSA
fetch('adatok.json')
    .then(response => response.json())
    .then(familyData => {
        
        // 1. Adatok feldolgozása
        const processedData = familyData.map(person => {
            const birthDate = new Date(person.date);
            const nextBday = getNextBirthday(person.date);
            
            const diffTime = nextBday - today;
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

        // 1. Kaki kalkulátor (FINOMÍTVA!)
        // Ha 2 év alatti (baba/kisgyerek), akkor kevesebb (napi 0.15kg),
        // ha idősebb, akkor felnőtt adag (napi 0.35kg).
        const poopMultiplier = (nextPerson.turningAge < 2) ? 0.15 : 0.35;
        const poopAmount = (daysAlive * poopMultiplier).toLocaleString('hu-HU', {maximumFractionDigits: 0});

        // 2. Fingós stat (Lufi egyenérték)
        const fartsInBalloons = Math.floor((daysAlive * 1.2) / 14).toLocaleString('hu-HU');

        // 3. WC-n töltött idő (Napi 20 perc átlagosan)
        const toiletDays = Math.floor((daysAlive * 20) / 1440); 

        // 4. Elfogyasztott elefántok (Napi 1.8 kg kaja / 6000 kg elefánt)
        const elephantsEaten = ((daysAlive * 1.8) / 6000).toFixed(2);

        // 5. Alvás (életünk 1/3-a)
        const sleepYears = ((daysAlive / 365) / 3).toFixed(1);

        // ÚJ HTML GENERÁLÁS (A sávos elrendezéshez)
        focusContainer.innerHTML = `
            <div class="focus-header-panel">
                <h2>${nextPerson.name}</h2>
                <div class="date-info">${nextPerson.daysLeft} nap múlva lesz ${nextPerson.turningAge} éves</div>
            </div>
            
            <div class="stats-container">
                <div class="stat-row">
                    <div class="stat-data">
                        <span class="stat-value">${daysAlive.toLocaleString('hu-HU')}</span>
                        <span class="stat-label">Napja élsz a Földön</span>
                    </div>
                    <span class="stat-emoji">🌍</span>
                </div>
                
                <div class="stat-row">
                    <div class="stat-data">
                        <span class="stat-value">kb. ${poopAmount} kg</span>
                        <span class="stat-label">Termelt "végtermék"</span>
                    </div>
                    <span class="stat-emoji">💩</span>
                </div>

                <div class="stat-row">
                    <div class="stat-data">
                        <span class="stat-value">${fartsInBalloons} db</span>
                        <span class="stat-label">Puki-lufi egyenérték</span>
                    </div>
                    <span class="stat-emoji">🎈</span>
                </div>

                <div class="stat-row">
                    <div class="stat-data">
                        <span class="stat-value">${toiletDays} nap</span>
                        <span class="stat-label">WC-n töltött idő</span>
                    </div>
                    <span class="stat-emoji">🚽</span>
                </div>

                 <div class="stat-row">
                    <div class="stat-data">
                        <span class="stat-value">${sleepYears} év</span>
                        <span class="stat-label">Alvással töltött idő</span>
                    </div>
                    <span class="stat-emoji">😴</span>
                </div>

                 <div class="stat-row">
                    <div class="stat-data">
                        <span class="stat-value">${nextPerson.turningAge - 1} db</span>
                        <span class="stat-label">Elfogyasztott torta</span>
                    </div>
                    <span class="stat-emoji">🎂</span>
                </div>
            </div>
        `;

        // 3. A többiek listázása (Egyszerűsített design)
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
        console.error('Hiba:', error);
        document.getElementById('focus-card').innerHTML = '<p>Nem sikerült betölteni az adatokat!</p>';
    });
