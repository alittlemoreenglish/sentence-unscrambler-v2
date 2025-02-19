// Original default sentences
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

// Settings management functions
function loadSentenceSettings() {
    const savedBank = localStorage.getItem('sentenceBank');
    const savedSentences = localStorage.getItem('customSentences');
    
    if (savedBank) {
        document.getElementById('sentenceSource').value = savedBank;
        currentSentenceBank = savedBank;
    }
    
    if (savedSentences) {
        customSentences = JSON.parse(savedSentences);
    }
}

function saveSentenceSettings() {
    const source = document.getElementById('sentenceSource').value;
    const sentences = document.getElementById('customSentences').value
        .split('\n')
        .filter(s => s.trim());
    
    currentSentenceBank = source;
    customSentences = sentences;
    
    localStorage.setItem('sentenceBank', source);
    localStorage.setItem('customSentences', JSON.stringify(sentences));
    
    closeSettingsModal();
}

function openSettingsModal() {
    const modal = document.getElementById('settingsModal');
    const textarea = document.getElementById('customSentences');
    const sourceSelect = document.getElementById('sentenceSource');
    
    // Load current settings
    sourceSelect.value = currentSentenceBank;
    textarea.value = customSentences.join('\n');
    
    modal.style.display = 'block';
}

function closeSettingsModal() {
    document.getElementById('settingsModal').style.display = 'none';
}

// Get current sentence bank based on settings
function getCurrentSentences() {
    return currentSentenceBank === 'custom' && customSentences.length > 0 
        ? customSentences 
        : defaultSentences;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadSentenceSettings();
    
    document.getElementById('settingsButton').addEventListener('click', openSettingsModal);
    document.getElementById('saveSettings').addEventListener('click', saveSentenceSettings);
    document.getElementById('closeSettings').addEventListener('click', closeSettingsModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('settingsModal');
        if (e.target === modal) {
            closeSettingsModal();
        }
    });
});

// Update the newSentence function to use getCurrentSentences
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
}
