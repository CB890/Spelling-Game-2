console.log("Game loaded");

// Main game logic will be in this file.
// For now, it just confirms the script is connected.

class SpellingGame {
    constructor() {
        this.words = ['cloud', 'flower', 'round', 'clown', 'playground'];
        this.currentWordIndex = 0;
        this.shuffledWords = [];
        this.score = 0;
        this.mode = null; // 'practice' or 'test'
        this.gameResults = [];
        this.timeRemaining = 60;
        this.timerId = null;
        this.selectedAvatar = null;
    }

    setControllers(ui, audio) {
        this.uiController = ui;
        this.audioController = audio;
    }

    /**
     * Sets the player's chosen avatar.
     * @param {string} avatarId The ID of the selected avatar.
     */
    setAvatar(avatarId) {
        this.selectedAvatar = avatarId;
        this.audioController.unlockAudio(); // Unlock audio on first interaction
        console.log(`Avatar selected: ${this.selectedAvatar}`);
    }

    /**
     * Shuffles the word list randomly.
     */
    shuffleWords() {
        this.shuffledWords = [...this.words].sort(() => Math.random() - 0.5);
    }

    /**
     * Starts a new game in the selected mode.
     * @param {string} mode - The selected game mode ('practice' or 'test').
     */
    startGame(mode) {
        this.mode = mode;
        this.score = 0;
        this.gameResults = [];
        this.currentWordIndex = 0;
        this.shuffleWords();
        
        this.uiController.showGameScreen();

        if (this.mode === 'test') {
            this.uiController.showTimer();
        } else {
            this.uiController.hideTimer();
        }

        this.proceedToNextWord();
    }

    /**
     * Advances to the next word in the list.
     * @returns {string|null} The next word or null if the game is over.
     */
    getNextWord() {
        if (this.currentWordIndex < this.shuffledWords.length) {
            const word = this.shuffledWords[this.currentWordIndex];
            this.currentWordIndex++;
            return word;
        } else {
            // Game over
            this.endGame();
            return null;
        }
    }

    endGame() {
        this.stopTimer();
        console.log('Game over! Final score:', this.score);
        this.uiController.showResults(this.score, this.gameResults);
    }

    /**
     * Checks the user's spelling attempt.
     * @param {string} spellingAttempt The word spelled by the user.
     */
    checkSpelling(spellingAttempt) {
        const currentWord = this.shuffledWords[this.currentWordIndex - 1];
        const isCorrect = spellingAttempt.toLowerCase() === currentWord.toLowerCase();
        
        if (this.mode === 'test') {
            this.stopTimer();
        }

        this.gameResults.push({ word: currentWord, attempt: spellingAttempt, isCorrect: isCorrect });

        if (isCorrect) {
            let points = (this.mode === 'test') ? 20 : 10;
            if (this.mode === 'test') {
                if (this.timeRemaining >= 40) {
                    points += 10;
                } else if (this.timeRemaining >= 20) {
                    points += 5;
                }
            }
            this.updateScore(points);
            this.audioController.playEffect('success');
            this.uiController.showFeedback("Great job!", true);
            this.uiController.updateCarPosition(this.currentWordIndex - 1);
        } else {
            this.audioController.playEffect('error');
            this.uiController.showFeedback(`The word was: ${currentWord}`, false);
        }

        setTimeout(() => {
            this.proceedToNextWord();
        }, 2000);
    }

    /**
     * Updates the score.
     * @param {number} points The points to add.
     */
    updateScore(points) {
        this.score += points;
        this.uiController.updateScore(this.score);
    }

    /**
     * Moves to the next word or ends the game.
     */
    proceedToNextWord() {
        const nextWord = this.getNextWord();
        if (nextWord) {
            const sentence = this.audioController.getSentenceForWord(nextWord);
            const blankedSentence = sentence.replace(nextWord, '_______');
            this.uiController.displaySentence(blankedSentence);

            this.audioController.playWordThenSentence(nextWord);

            if (this.mode === 'test') {
                this.startWordTimer();
            }
        }
    }

    startWordTimer() {
        this.timeRemaining = 60;
        this.uiController.updateTimer(this.timeRemaining);
        this.timerId = setInterval(() => {
            this.timeRemaining--;
            this.uiController.updateTimer(this.timeRemaining);
            if (this.timeRemaining <= 0) {
                this.stopTimer();
                const currentWord = this.shuffledWords[this.currentWordIndex - 1];
                this.uiController.showFeedback(`Time's up! The word was: ${currentWord}`, false);
                this.gameResults.push({
                    word: currentWord,
                    attempt: 'timeout',
                    isCorrect: false
                });
                setTimeout(() => this.proceedToNextWord(), 2000);
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerId);
        this.timerId = null;
    }

    replayWord() {
        const currentWord = this.shuffledWords[this.currentWordIndex - 1];
        if (currentWord) {
            this.audioController.playWord(currentWord, false);
        }
    }

    replaySentence() {
        const currentWord = this.shuffledWords[this.currentWordIndex - 1];
        if (currentWord) {
            this.audioController.playWord(currentWord, true);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new SpellingGame();
    const ui = new UIController();
    const audio = new AudioController();
    game.setControllers(ui, audio);

    ui.onSubmit(() => {
        const spellingAttempt = ui.getInputValue();
        game.checkSpelling(spellingAttempt);
    });

    ui.onPlayAgain(() => {
        // Restart the game with the same mode
        game.startGame(game.mode);
    });

    ui.onGoToMenu(() => {
        ui.showMainMenu();
    });

    ui.onAvatarSelect(avatarId => {
        game.setAvatar(avatarId);
    });

    ui.onWordReplay(() => {
        game.replayWord();
    });

    ui.onSentenceReplay(() => {
        game.replaySentence();
    });

    document.getElementById('practice-mode').addEventListener('click', () => {
        game.startGame('practice');
    });

    document.getElementById('test-mode').addEventListener('click', () => {
        game.startGame('test');
    });

    console.log("Game loaded and ready.");
}); 