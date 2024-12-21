document.getElementById("generate").addEventListener("click", function() {
    const inputArea = document.getElementById("input-area");
    const options = inputArea.value.split('\n').map(opt => opt.trim()).filter(opt => opt !== '');
    const cardCount = parseInt(document.getElementById('card-count').value, 10);

    if (options.length < 25) {
        alert("Please provide at least 25 options!");
        return;
    }

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const generateCardIdentifier = (selectedOptions) => {
        // Create a unique string identifier based on the indices of the selected options
        return selectedOptions.map(option => options.indexOf(option)).join(',');
    };

    const createBingoCard = () => {
        const card = document.createElement('div');
        card.className = 'bingo-card';


        // Shuffle options and select the first 25
        const shuffledOptions = shuffle([...options]);
        const selectedOptions = shuffledOptions.slice(0, 25);

        // Ensure there are always 25 options selected
        if (selectedOptions.length !== 25) {
            console.error("There was an issue generating the options.");
            return null; // Return null if the card is not populated correctly
        }

        const cardIdentifier = generateCardIdentifier(selectedOptions);

        // Populate card with cells
        selectedOptions.forEach(option => {
            const cell = document.createElement('div');
            cell.className = 'bingo-cell';
            cell.textContent = option;
            card.appendChild(cell);
        });

        return { card, selectedOptions, cardIdentifier };
    };

    const sheet = document.getElementById("bingo-sheet");
    sheet.innerHTML = '';

    const generatedIdentifiers = new Set(); // To keep track of unique identifiers

    let generatedCount = 0;
    while (generatedCount < cardCount) {
        const { card, selectedOptions, cardIdentifier } = createBingoCard();

        if (!card) {
            // Skip if card creation failed
            continue;
        }

        if (generatedIdentifiers.has(cardIdentifier)) {
            // Skip if this card has the same identifier as a previously generated one
            continue;
        }

        generatedIdentifiers.add(cardIdentifier);
        sheet.appendChild(card);
        generatedCount++;
    }
});

document.getElementById('print').addEventListener("click", function() {
    window.print();
});
