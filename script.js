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

fetch('adatok.json')
    .then(response => response.json())
    .then(familyData => {
        
        // 1. Feldolgozás
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

        // 2. Dashboard generálás
        const nextPerson = processedData[0];
        const gridContainer = document.getElementById('dashboard-grid');

        // Statisztikák számolása a fő emberhez
        const diffInTime = today.getTime() - nextPerson.birthDateObj.getTime();
        const daysAlive = Math.floor(diffInTime / (1000 * 3600 * 24));
        
        // Baba-matek (Zsófi/Misi miatt)
        const poopMultiplier = (nextPerson.turningAge < 2) ? 0.15 : 0.35;
        const poopAmount = (daysAlive * poopMultiplier).toLocaleString('hu-HU', {maximumFractionDigits: 0});
        
        const farts = Math.floor((daysAlive * 1.2) / 14).toLocaleString('hu-HU');
        const toiletDays = Math.floor((daysAlive * 20) / 1440);
        const sleepYears = ((daysAlive / 365) / 3).toFixed(1);

        // ITT A LÉNYEG: A Grid felépítése
        gridContainer.innerHTML = `
            <div class="card grid-item-main next-person-card">
                <div class="next-label">KÖVETKEZŐ ÜNNEPELT</div>
                <div class="next-name">${nextPerson.name}</div>
                <div class="next-details">
                    ${nextPerson.daysLeft} nap múlva ${nextPerson.turningAge} éves!
                </div>
            </div>

            <div class="card stat-card bg-blue">
                <div class="stat-icon">🌍</div>
                <div class="stat-number">${daysAlive.toLocaleString('hu-HU')}</div>
                <div class="stat-desc">Napja élsz</div>
            </div>

            <div class="card stat-card bg-pink">
                <div class="stat-icon">💩</div>
                <div class="stat-number">${poopAmount} kg</div>
                <div class="stat-desc">Végtermék</div>
            </div>

            <div class="card stat-card bg-green">
                <div class="stat-icon">🎈</div>
                <div class="stat-number">${farts} db</div>
                <div class="stat-desc">Puki-lufi</div>
            </div>

            <div class="card stat-card bg-white">
                <div class="stat-icon">😴</div>
                <div class="stat-number">${sleepYears} év</div>
                <div class="stat-desc">Alvás</div>
            </div>
            
             <div class="card stat-card bg-white">
                <div class="stat-icon">🚽</div>
                <div class="stat-number">${toiletDays} nap</div>
                <div class="stat-desc">A retyón</div>
            </div>

             <div class="card stat-card bg-white">
                <div class="stat-icon">🎂</div>
                <div class="stat-number">${nextPerson.turningAge - 1} db</div>
                <div class="stat-desc">Torta</div>
            </div>
        `;

        // 3. Alsó lista
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
