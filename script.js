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

        const diffInTime = today.getTime() - nextPerson.birthDateObj.getTime();
        const daysAlive = Math.floor(diffInTime / (1000 * 3600 * 24));
        
        const poopMultiplier = (nextPerson.turningAge < 2) ? 0.15 : 0.35;
        const poopAmount = daysAlive * poopMultiplier; 
        
        const farts = Math.floor((daysAlive * 1.2) / 14); 
        const toiletDays = Math.floor((daysAlive * 20) / 1440);
        const sleepYears = ((daysAlive / 365) / 3); 
        const elephantsEaten = ((daysAlive * 1.8) / 6000); 

        // HTML ÉPÍTÉS - ÚJ SZÍNEKKEL!
        gridContainer.innerHTML = `
            <div class="card grid-item-main next-person-card">
                <div class="next-label">KÖVETKEZŐ ÜNNEPELT</div>
                <div class="next-name">${nextPerson.name}</div>
                <div class="next-details">
                    <span class="counter" data-target="${nextPerson.daysLeft}">0</span> nap múlva ${nextPerson.turningAge} éves!
                </div>
            </div>

            <div class="card stat-card bg-retro-blue">
                <div class="stat-icon">🌍</div>
                <div class="stat-number counter" data-target="${daysAlive}">0</div>
                <div class="stat-desc">Napja élsz</div>
            </div>

            <div class="card stat-card bg-retro-pink">
                <div class="stat-icon">💩</div>
                <div class="stat-number"><span class="counter" data-target="${poopAmount}" data-float="${poopAmount < 100 ? 'true' : 'false'}">0</span> kg</div>
                <div class="stat-desc">Végtermék</div>
            </div>

            <div class="card stat-card bg-retro-green">
                <div class="stat-icon">🎈</div>
                <div class="stat-number"><span class="counter" data-target="${farts}">0</span> db</div>
                <div class="stat-desc">Puki-lufi</div>
            </div>

            <div class="card stat-card bg-retro-purple">
                <div class="stat-icon">😴</div>
                <div class="stat-number"><span class="counter" data-target="${sleepYears}" data-float="true">0</span> év</div>
                <div class="stat-desc">Alvás</div>
            </div>
            
             <div class="card stat-card bg-retro-orange">
                <div class="stat-icon">🐘</div>
                <div class="stat-number"><span class="counter" data-target="${elephantsEaten}" data-float="true">0</span> db</div>
                <div class="stat-desc">Elefánt (kaja)</div>
            </div>

             <div class="card stat-card bg-white">
                <div class="stat-icon">🎂</div>
                <div class="stat-number counter" data-target="${nextPerson.turningAge - 1}">0</div>
                <div class="stat-desc">Torta</div>
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
