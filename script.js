document.getElementById("generate").addEventListener("click", function() {
    const generatedCards = new Set();
    generatedCards.clear();
    const inputArea = document.getElementById("input-area");
    const options = inputArea.value.split('\n').filter(opt => opt.trim !== '');
    const cardCount = parseInt(document.getElementById('card-count').value, 10);

    if (options.length < 25) {
        alert("Please provide at least 25 options!");
        return;
    }

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i+1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const createBingoCard = () => {
        let selectedOptions;
        let cardKey;

        do {
            const shuffledOptions = shuffle([options]);
            selectedOptions = shuffledOptions.slice(0, 25);
            cardKey = selectedOptions.join('|');
        } while (generatedCards.has(cardKey));

        generatedCards.add(cardKey);

        const card = document.createElement('div');
        card.className = 'bingo-card';

        selectedOptions.forEach(option => {
            const cell = document.createElement('div');
            cell.className = 'bingo-cell';
            cell.textContent = option;
            card.appendChild(cell);
        });

        return card;
    };

    const sheet = document.getElementById("bingo-sheet");
    sheet.innerHTML = '';

    for (let i = 0; i < cardCount; i++) {
        sheet.appendChild(createBingoCard());
    }
});

document.getElementById('print').addEventListener("click", function() {
    window.print();
});