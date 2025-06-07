// UI controller logic will be in this file. 

class UIController {
    constructor() {
        this.mainMenu = document.getElementById('main-menu');
        this.gameScreen = document.getElementById('game-screen');
        this.wordDisplayArea = document.getElementById('word-display-area');
        this.keyboardContainer = document.getElementById('on-screen-keyboard');
        this.inputField = document.getElementById('spell-input');
        this.backspaceBtn = document.getElementById('backspace-btn');
        this.submitBtn = document.getElementById('submit-btn');
        this.scoreValue = document.getElementById('score-value');
        this.feedbackArea = document.getElementById('feedback-area');
        this.resultsScreen = document.getElementById('results-screen');
        this.finalScoreEl = document.getElementById('final-score');
        this.resultsListEl = document.getElementById('results-list');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.mainMenuBtn = document.getElementById('main-menu-btn');
        this.timerDisplay = document.getElementById('timer-display');
        this.avatarOptions = document.querySelectorAll('.avatar-option');
        this.mainMenuModeButtons = document.querySelectorAll('#game-modes .mode-button');
        this.car = document.getElementById('racing-car');
        this.wordReplayBtn = document.getElementById('word-replay-btn');
        this.sentenceReplayBtn = document.getElementById('sentence-replay-btn');
        this.onKeyPress = null; // Callback for key presses
        this.onSubmitCallback = null;
        this.onAvatarSelectCallback = null;
        this.onModeSelectCallback = null;
        this.onKeyPressCallback = null;
        this.onWordReplayCallback = null;
        this.onSentenceReplayCallback = null;
        this.onPlayAgainCallback = null;
        this.onBackToMenuCallback = null;

        this.initKeyboard();
        this.backspaceBtn.addEventListener('click', () => this.handleBackspace());
        this.submitBtn.addEventListener('click', () => this.triggerSubmit());
        this.inputField.addEventListener('input', () => this.updateSubmitButtonState());
        this.initAvatarSelection();
        document.addEventListener('keydown', (e) => this.handlePhysicalKeyboard(e));
        this.bindReplayButtons();
        this.bindResultsButtons();
    }

    handlePhysicalKeyboard(e) {
        // Only handle key presses when the game screen is active
        if (this.gameScreen.classList.contains('hidden')) {
            return;
        }

        e.preventDefault(); // Prevent default browser actions

        if (e.key >= 'a' && e.key <= 'z') {
            this.handleKeyPress(e.key);
        } else if (e.key === 'Backspace') {
            this.handleBackspace();
        } else if (e.key === 'Enter') {
            this.triggerSubmit();
        }
    }

    triggerSubmit() {
        if (this.onSubmitCallback && !this.submitBtn.disabled) {
            this.onSubmitCallback();
        }
    }

    initAvatarSelection() {
        this.avatarOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove 'selected' from all options
                this.avatarOptions.forEach(opt => opt.classList.remove('selected'));
                // Add 'selected' to the clicked option
                option.classList.add('selected');

                // Enable game mode buttons on the main menu
                this.mainMenuModeButtons.forEach(button => button.disabled = false);

                const avatarId = option.dataset.avatar;
                this.setAvatarInCar(avatarId);

                // Fire callback
                if (this.onAvatarSelectCallback) {
                    this.onAvatarSelectCallback(avatarId);
                }
            });
        });
    }

    initKeyboard() {
        const keysLayout = [
            'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
            'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
            'z', 'x', 'c', 'v', 'b', 'n', 'm'
        ];
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        const focusLetters = ['o', 'u'];

        keysLayout.forEach(key => {
            const keyElement = document.createElement('button');
            keyElement.textContent = key;
            keyElement.classList.add('keyboard-key');
            keyElement.dataset.key = key;

            if (vowels.includes(key)) {
                keyElement.classList.add('vowel');
            }
            if (focusLetters.includes(key)) {
                keyElement.classList.add('focus-letter');
            }

            keyElement.addEventListener('click', () => this.handleKeyPress(key));
            this.keyboardContainer.appendChild(keyElement);
        });
    }

    handleKeyPress(key) {
        // Append character to the input field
        if (this.inputField.value.length < 15) { // Limit input length
            this.inputField.value += key;
        }
        this.updateSubmitButtonState();
    }
    
    handleBackspace() {
        this.inputField.value = this.inputField.value.slice(0, -1);
        this.updateSubmitButtonState();
    }

    clearInput() {
        this.inputField.value = '';
        this.updateSubmitButtonState();
    }

    getInputValue() {
        return this.inputField.value;
    }

    /**
     * Shows a feedback message to the user and applies styling.
     * @param {string} message The text to display.
     * @param {boolean} isCorrect Whether the feedback is for a correct answer.
     */
    showFeedback(message, isCorrect) {
        this.feedbackArea.textContent = message;
        this.feedbackArea.classList.add(isCorrect ? 'correct' : 'incorrect');
        this.inputField.classList.add(isCorrect ? 'correct' : 'incorrect');

        this.disableInput();

        setTimeout(() => {
            this.feedbackArea.textContent = '';
            this.feedbackArea.classList.remove('correct', 'incorrect');
            this.inputField.classList.remove('correct', 'incorrect');
            this.enableInput();
        }, 2000); // Feedback lasts 2 seconds
    }

    disableInput() {
        this.submitBtn.disabled = true;
        this.backspaceBtn.disabled = true;
        this.keyboardContainer.querySelectorAll('.keyboard-key').forEach(key => {
            key.disabled = true;
        });
    }

    enableInput() {
        this.backspaceBtn.disabled = false;
        this.keyboardContainer.querySelectorAll('.keyboard-key').forEach(key => {
            key.disabled = false;
        });
        this.updateSubmitButtonState();
    }

    onSubmit(callback) {
        this.onSubmitCallback = callback;
    }
    
    updateScore(newScore) {
        this.scoreValue.textContent = newScore;
    }

    updateSubmitButtonState() {
        this.submitBtn.disabled = this.inputField.value.length === 0;
    }

    /**
     * Hides the main menu and shows the game screen.
     */
    showGameScreen() {
        this.mainMenu.classList.add('hidden');
        this.resultsScreen.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
        this.updateScore(0);
        this.resetCarPosition();
    }

    /**
     * Hides the game screen and shows the main menu.
     */
    showMainMenu() {
        this.gameScreen.classList.add('hidden');
        this.resultsScreen.classList.add('hidden');
        this.mainMenu.classList.remove('hidden');
        // Reset avatar selection visually
        this.avatarOptions.forEach(opt => opt.classList.remove('selected'));
        this.mainMenuModeButtons.forEach(button => button.disabled = true);
    }

    /**
     * Displays the given word in the word display area.
     * @param {string} sentence The sentence to display.
     */
    displaySentence(sentence) {
        this.wordDisplayArea.textContent = sentence;
        this.clearInput();
    }

    updateTimer(time) {
        this.timerDisplay.textContent = `Time: ${time}`;
    }

    showTimer() {
        this.timerDisplay.style.display = 'block';
    }

    hideTimer() {
        this.timerDisplay.style.display = 'none';
    }

    showResults(score, gameResults) {
        this.gameScreen.classList.add('hidden');
        this.resultsScreen.classList.remove('hidden');
        this.finalScoreEl.textContent = score;

        this.resultsListEl.innerHTML = '';
        if (gameResults.length === 0) {
            this.resultsListEl.innerHTML = '<li>No words were attempted.</li>';
        } else {
            gameResults.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('result-item');
                if (item.isCorrect) {
                    li.classList.add('correct-answer');
                    li.innerHTML = `
                        <span class="result-status">✔</span>
                        <span class="result-word"><strong>${item.word}</strong> - You got it right!</span>
                    `;
                } else {
                    li.classList.add('incorrect-answer');
                    li.innerHTML = `
                        <span class="result-status">❌</span>
                        <span class="result-word"><strong>${item.word}</strong></span>
                        <span class="user-attempt">Your answer: ${item.attempt}</span>
                    `;
                }
                this.resultsListEl.appendChild(li);
            });
        }
    }

    onPlayAgain(callback) {
        this.onPlayAgainCallback = callback;
    }

    onGoToMenu(callback) {
        this.onBackToMenuCallback = callback;
    }

    onAvatarSelect(callback) {
        this.onAvatarSelectCallback = callback;
    }

    onModeSelect(callback) {
        this.onModeSelectCallback = callback;
    }

    onKeyPressCallback(callback) {
        this.onKeyPressCallback = callback;
    }

    onWordReplay(callback) {
        this.onWordReplayCallback = callback;
    }

    onSentenceReplay(callback) {
        this.onSentenceReplayCallback = callback;
    }

    onBackToMenu(callback) {
        this.onBackToMenuCallback = callback;
    }

    setAvatarInCar(avatarId) {
        const extension = (avatarId === 'mrbeast') ? 'jpg' : 'png';
        this.car.innerHTML = `<img src="images/avatars/${avatarId}.${extension}" alt="Player Avatar">`;
    }

    /**
     * Moves the car to a new position on the track.
     * @param {number} wordIndex The index of the word just spelled correctly (0-4).
     */
    updateCarPosition(wordIndex) {
        const progressPercentage = (wordIndex + 1) * 20; // 5 words, so 20% per word
        this.car.style.left = `calc(${progressPercentage}% - 30px)`; // -30px to center the car on the line
    }

    resetCarPosition() {
        this.car.style.transition = 'none'; // Prevent animation on reset
        this.car.style.left = '0';
        // Force a reflow to apply the transition reset immediately
        void this.car.offsetWidth; 
        this.car.style.transition = 'left 2s ease-in-out';
    }

    bindReplayButtons() {
        this.wordReplayBtn.addEventListener('click', () => {
            if (this.onWordReplayCallback) this.onWordReplayCallback();
        });
        this.sentenceReplayBtn.addEventListener('click', () => {
            if (this.onSentenceReplayCallback) this.onSentenceReplayCallback();
        });
    }

    bindResultsButtons() {
        this.playAgainBtn.addEventListener('click', () => {
            if (this.onPlayAgainCallback) this.onPlayAgainCallback();
        });
        this.mainMenuBtn.addEventListener('click', () => {
            if (this.onBackToMenuCallback) this.onBackToMenuCallback();
        });
    }
} 