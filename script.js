// Game state variables
let currentSentence = "";
let selectedWords = [];
let score = 0;
let hasScored = false;
let customSentences = [];
let currentSentenceBank = "default"; // "default" or "custom"
let gameStarted = false;

// Default sentences for presentation
const defaultSentences = [
    "Good morning, everyone. Thank you for being here today.",
    "Let's begin with a brief introduction to our topic.",
    "I will discuss three main points in my presentation.",
    "This slide shows our key findings from the research.",
    "To summarize the main points we covered today.",
    "Are there any questions about what we discussed?",
    "Thank you for your attention and participation.",
    "The data clearly demonstrates our conclusions.",
    "Let me explain this concept in more detail.",
    "We can move on to the next section now."
];

// Settings Management Functions
function loadSettings() {
    const savedBank = localStorage.getItem('sentenceBank');
    const savedSentences = localStorage.getItem('customSentences');
    
    if (savedBank) {
        currentSentenceBank = savedBank;
        document.getElementById('sentenceSource').value = savedBank;
    }
    
    if (savedSentences) {
        customSentences = JSON.parse(savedSentences);
    }
}

function saveSettings() {
    const source = document.getElementById('sentenceSource').value;
    const sentences = document.getElementById('customSentences').value
        .split('\n')
        .filter(s => s.trim());
    
    // Validate that we have enough sentences if switching to custom
    if (source === 'custom' && sentences.length < 5) {
        alert('Please enter at least 5 sentences for the custom sentence bank.');
        return;
    }
    
    currentSentenceBank = source;
    customSentences = sentences;
    
    localStorage.setItem('sentenceBank', source);
    localStorage.setItem('customSentences', JSON.stringify(sentences));
    
    document.getElementById('settingsModal').style.display = 'none';
    
    // If game is in progress, get a new sentence from the updated bank
    if (gameStarted) {
        newSentence();
    }
}

// Game Logic Functions
function getCurrentSentences() {
    return currentSentenceBank === 'custom' && customSentences.length > 0 
        ? customSentences 
        : defaultSentences;
}

function startGame() {
    gameStarted = true;
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
    const sentences = getCurrentSentences();
    const randomIndex = Math.floor(Math.random() * sentences.length);
    currentSentence = sentences[randomIndex];
    
    // Split sentence into words and shuffle
    const words = currentSentence.split(/\s+/);
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    
    // Update display
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
            document.getElementById('score').textContent = `Score: ${score}`;
        }
        
        document.getElementById('feedback').textContent = '✨ Correct! ✨';
        
        if (score >= 5) {
            // Game complete - show Pokemon reward
            document.getElementById('checkButton').style.display = 'none';
            document.getElementById('skipButton').style.display = 'none';
            document.getElementById('feedback').textContent = '🎉 Congratulations! You\'ve earned a Pokemon! 🎉';
            // Add Pokemon reward logic here
        } else {
            // Continue to next sentence after brief delay
            setTimeout(newSentence, 1500);
        }
    } else {
        document.getElementById('feedback').textContent = '❌ Try again! ❌';
    }
}

// UI Event Handlers
function handleWordSelection(event) {
    const clickedElement = event.target;
    if (!clickedElement.classList.contains('word')) return;
    
    const sourceArea = clickedElement.parentElement.id;
    const targetArea = sourceArea === 'scrambledWords' ? 'answerArea' : 'scrambledWords';
    
    document.getElementById(targetArea).appendChild(clickedElement);
    
    if (targetArea === 'answerArea') {
        selectedWords.push(clickedElement.dataset.index);
    } else {
        selectedWords = selectedWords.filter(index => index !== clickedElement.dataset.index);
    }
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
    
    // Settings Modal Event Listeners
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
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
