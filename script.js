// Game state variables
let currentSentence = "";
let score = 0;
let hasScored = false;
let customSentences = [];
let currentSentenceBank = "default";
let gameStarted = false;
let gameComplete = false;

const defaultSentences = [
    "The school bell rings loudly every morning.",
    "Students hurry to their classrooms with heavy backpacks.",
    "Teachers explain lessons with enthusiasm and patience.",
    "The playground is full of laughter during recess.",
    "Lunchtime is the best part of the day.",
    "Students borrow books from the school library.",
    "Group projects teach teamwork and responsibility.",
    "The computer lab is always busy with students.",
    "Teachers check homework carefully every morning.",
    "Classroom discussions make learning more interesting.",
    "Science experiments are fun and exciting.",
    "Art class allows students to express creativity.",
    "Sports day brings energy and excitement.",
    "Music class fills the school with melodies.",
    "The school cafeteria serves delicious hot meals.",
    "Students take notes during important lectures.",
    "After-school clubs offer many activities.",
    "The gym is packed during P.E. class.",
    "Everyone studies hard before exams.",
    "The teacher gives surprise quizzes sometimes.",
    "Math problems can be tricky but fun.",
    "History class takes students back in time.",
    "The school bus arrives right on time.",
    "Field trips make learning more enjoyable.",
    "The principal gives speeches during assemblies.",
    "Students raise hands to answer questions.",
    "The chalkboard is filled with important notes.",
    "Classroom rules help maintain discipline.",
    "English class improves reading and writing skills.",
    "Science fairs showcase amazing student projects.",
    "The school garden is well maintained.",
    "Parents visit during open house events.",
    "Music competitions bring out talented singers.",
    "Every classroom has a big whiteboard.",
    "Teachers encourage students to ask questions.",
    "Students love decorating their classrooms.",
    "The morning announcements share important news.",
    "The lost and found is always full.",
    "School uniforms create a sense of unity.",
    "Library time is quiet and peaceful.",
    "The school nurse helps sick students.",
    "Friendships are made during group activities.",
    "Students celebrate special events at school.",
    "The janitor keeps the school clean.",
    "The drama club rehearses for a play.",
    "Class presentations improve public speaking skills.",
    "The school newspaper shares student stories.",
    "Graduation day is full of emotions.",
    "Homework helps students practice new lessons.",
    "A new school year brings new opportunities."
];

function loadSettings() {
    try {
        const savedBank = localStorage.getItem('sentenceBank');
        const savedSentences = localStorage.getItem('customSentences');
        
        if (savedBank) {
            currentSentenceBank = savedBank;
            document.getElementById('sentenceSource').value = savedBank;
        }
        
        if (savedSentences) {
            customSentences = JSON.parse(savedSentences);
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        // Reset to defaults if there's an error
        currentSentenceBank = "default";
        customSentences = [];
    }
}

function saveSettings() {
    const source = document.getElementById('sentenceSource').value;
    const sentences = document.getElementById('customSentences').value
        .split('\n')
        .filter(s => s.trim());
    
    if (source === 'custom' && sentences.length < 5) {
        alert('Please enter at least 5 sentences for the custom sentence bank.');
        document.getElementById('sentenceSource').value = currentSentenceBank;
        return;
    }
    
    currentSentenceBank = source;
    customSentences = sentences;
    
    try {
        localStorage.setItem('sentenceBank', source);
        localStorage.setItem('customSentences', JSON.stringify(sentences));
        document.getElementById('settingsModal').style.display = 'none';
        
        // Only get a new sentence if the game is in progress and not complete
        if (gameStarted && !gameComplete) {
            newSentence();
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Failed to save settings. Please try again.');
    }
}

function getCurrentSentences() {
    return currentSentenceBank === 'custom' && customSentences.length > 0 
        ? customSentences 
        : defaultSentences;
}

function startGame() {
    gameStarted = true;
    gameComplete = false;
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('checkButton').style.display = 'inline';
    document.getElementById('skipButton').style.display = 'inline';
    document.getElementById('settingsButton').style.display = 'none';
    document.getElementById('directions').style.display = 'none';
    score = 0;
    document.getElementById('score').textContent = 'Score: 0';
    newSentence();
}

function newSentence() {
    if (gameComplete) return;
    
    const sentences = getCurrentSentences();
    const randomIndex = Math.floor(Math.random() * sentences.length);
    currentSentence = sentences[randomIndex];
    
    const words = currentSentence.split(/\s+/);
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    
    const scrambledWordsDiv = document.getElementById('scrambledWords');
    scrambledWordsDiv.innerHTML = '';
    
    shuffledWords.forEach((word, index) => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word';
        wordDiv.textContent = word;
        wordDiv.dataset.index = index;
        scrambledWordsDiv.appendChild(wordDiv);
    });
    
    document.getElementById('answerArea').innerHTML = '';
    selectedWords = [];
    hasScored = false;
    document.getElementById('feedback').textContent = '';
}

function checkAnswer() {
    const userAnswer = Array.from(document.getElementById('answerArea').children)
        .map(word => word.textContent)
        .join(' ');
    
    if (userAnswer.toLowerCase() === currentSentence.toLowerCase()) {
        if (!hasScored) {
            score++;
            hasScored = true;
            document.getElementById('score').textContent = `${score}`;
        }
        
        document.getElementById('feedback').textContent = '✨ Correct! ✨';
        
        if (score >= 5) {
            gameComplete = true;
            document.getElementById('checkButton').style.display = 'none';
            document.getElementById('skipButton').style.display = 'none';
            showVictoryModal(); // Show the victory modal
        } else {
            // Only continue if game isn't complete
            setTimeout(() => {
                if (!gameComplete) {
                    newSentence();
                }
            }, 1500);
        }
    } else {
        document.getElementById('feedback').textContent = '❌ Try again! ❌';
    }
}

async function showVictoryModal() {
    const modal = document.getElementById("victoryModal");
    const pokemonId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    const pokemonImageDiv = document.getElementById("pokemonImage");
    const img = document.createElement("img");
    img.src = data.sprites.other["official-artwork"].front_default;
    img.alt = `${data.name} Pokemon artwork`;
    img.width = 300;
    img.height = 300;
    pokemonImageDiv.innerHTML = "";
    pokemonImageDiv.appendChild(img);
    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("victoryModal").style.display = "none";
    resetGame();
}

function resetGame() {
    gameStarted = false;
    gameComplete = false;
    score = 0;
    document.getElementById('score').textContent = 'Score: 0';
    document.getElementById('startButton').style.display = 'inline';
    document.getElementById('checkButton').style.display = 'none';
    document.getElementById('skipButton').style.display = 'none';
    document.getElementById('feedback').textContent = '';
    document.getElementById('scrambledWords').innerHTML = '';
    document.getElementById('answerArea').innerHTML = '';
}

function handleWordSelection(event) {
    if (!gameStarted || gameComplete) return;
    
    const clickedElement = event.target;
    if (!clickedElement.classList.contains('word')) return;
    
    const sourceArea = clickedElement.parentElement.id;
    const targetArea = sourceArea === 'scrambledWords' ? 'answerArea' : 'scrambledWords';
    
    document.getElementById(targetArea).appendChild(clickedElement);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    
    // Event Listeners
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('checkButton').addEventListener('click', checkAnswer);
    document.getElementById('skipButton').addEventListener('click', newSentence);
    document.getElementById('scrambledWords').addEventListener('click', handleWordSelection);
    document.getElementById('answerArea').addEventListener('click', handleWordSelection);
    
    // Add directions button handler
    document.getElementById('directionsButton').addEventListener('click', () => {
        const directions = document.getElementById('directions');
        directions.style.display = directions.style.display === 'none' ? 'block' : 'none';
    });
    
    document.getElementById('settingsButton').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'block';
        document.getElementById('customSentences').value = customSentences.join('\n');
        document.getElementById('sentenceSource').value = currentSentenceBank;
    });
    
    document.getElementById('saveSettings').addEventListener('click', saveSettings);
    
    document.getElementById('closeSettings').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('settingsModal');
        const modalContent = modal.querySelector('.modal-content');
        if (event.target === modal && !modalContent.contains(event.target)) {
            modal.style.display = 'none';
        }
    });
});
