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
    // Create a new jsPDF instance
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    
    const cards = document.querySelectorAll('.bingo-card');
    const cardWidth = 85;  // Width of each bingo card in mm
    const cardHeight = 85; // Height of each bingo card in mm
    const spaceBetweenCards = 10; // Space between cards
    
    let xOffset = 10;
    let yOffset = 10;

    cards.forEach((card, index) => {
        // Draw a rectangle for each card
        pdf.setDrawColor(0); // Set border color to black
        pdf.setLineWidth(0.5); // Set border thickness
        pdf.rect(xOffset, yOffset, cardWidth, cardHeight); // Draw the card border
        
        // Draw the cells inside the card
        const cells = card.querySelectorAll('.bingo-cell');
        let cellWidth = cardWidth / 5;
        let cellHeight = cardHeight / 5;

        cells.forEach((cell, cellIndex) => {
            const row = Math.floor(cellIndex / 5);
            const col = cellIndex % 5;
            const x = xOffset + col * cellWidth;
            const y = yOffset + row * cellHeight;

            // Draw the cell borders
            pdf.setDrawColor(0);
            pdf.rect(x, y, cellWidth, cellHeight); // Draw individual cell

            // Add text to the cell
            pdf.setFontSize(10);
            pdf.text(cell.textContent, x + 5, y + 12); // Add text inside cell
        });

        // Move to the next position for the second card
        xOffset += cardWidth + spaceBetweenCards;
        
        // If two cards are on one page, move to the second row
        if (xOffset + cardWidth > pdf.internal.pageSize.width) {
            xOffset = 10;
            yOffset += cardHeight + spaceBetweenCards;
        }

        // Add a new page after two cards
        if ((index + 1) % 2 === 0) {
            pdf.addPage();
            xOffset = 10; // Reset X offset for the new page
            yOffset = 10; // Reset Y offset for the new page
        }
    });

    // Save the generated PDF
    pdf.save("bingo-cards.pdf");
});
