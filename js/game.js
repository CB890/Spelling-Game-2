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
        this.hintUsed = false;
        this.rewards = [
            { id: 'perfect_score', name: 'Perfect Score', icon: '🏆', unlocked: false, condition: (game) => game.gameResults.every(r => r.isCorrect) && game.gameResults.length === game.words.length },
            { id: 'first_word', name: 'First Word!', icon: '⭐', unlocked: false, condition: (game) => game.score > 0 },
            { id: 'streak_3', name: '3 in a Row!', icon: '🔥', unlocked: false, condition: (game) => this.checkStreak(3, game) },
            { id: 'quick_speller', name: 'Quick Speller', icon: '⚡', unlocked: false, condition: (game) => game.gameResults.some(r => r.isCorrect && r.timeBonus > 0) }
        ];
        this.correctStreak = 0;
    }

    setControllers(ui, audio) {
        this.uiController = ui;
        this.audioController = audio;
    }

    checkStreak(length, game) {
        return game.correctStreak >= length;
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
        this.correctStreak = 0;
        this.rewards.forEach(r => r.unlocked = false); // Reset rewards for new game
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
        this.checkEndGameRewards();
        this.uiController.displayRewards(this.rewards);
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

        let timeBonus = 0;
        if (isCorrect) {
            this.correctStreak++;
            let points = (this.mode === 'test') ? 20 : 10;
            if (this.hintUsed) {
                points = 0;
            } else if (this.mode === 'test') {
                if (this.timeRemaining >= 40) {
                    timeBonus = 10;
                } else if (this.timeRemaining >= 20) {
                    timeBonus = 5;
                }
                points += timeBonus;
            }
            this.updateScore(points);
            this.audioController.playEffect('success');
            this.uiController.showFeedback("Great job!", true);
            this.uiController.updateCarPosition(this.currentWordIndex - 1);
        } else {
            this.correctStreak = 0;
            this.audioController.playEffect('error');
            this.uiController.showFeedback(`The word was: ${currentWord}`, false);
        }

        this.gameResults.push({ word: currentWord, attempt: spellingAttempt, isCorrect: isCorrect, timeBonus: timeBonus });
        this.checkMidGameRewards();

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
            this.hintUsed = false;
            this.uiController.resetHintButton();
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
                this.correctStreak = 0;
                this.checkMidGameRewards();
                setTimeout(() => this.proceedToNextWord(), 2000);
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerId);
        this.timerId = null;
    }

    giveHint() {
        this.hintUsed = true;
        const currentWord = this.shuffledWords[this.currentWordIndex - 1];
        if (currentWord) {
            const firstLetter = currentWord.charAt(0);
            this.uiController.showHint(firstLetter);
        }
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

    returnToMenu() {
        this.stopTimer();
        this.uiController.showMainMenu();
    }

    checkMidGameRewards() {
        this.rewards.forEach(reward => {
            if (!reward.unlocked && reward.condition(this)) {
                if (reward.id !== 'perfect_score') { // Defer perfect score to end
                    this.unlockReward(reward);
                }
            }
        });
    }

    checkEndGameRewards() {
        this.rewards.forEach(reward => {
            if (!reward.unlocked && reward.condition(this)) {
                this.unlockReward(reward);
            }
        });
    }

    unlockReward(reward) {
        reward.unlocked = true;
        this.uiController.showRewardToast(reward);
        console.log(`Reward unlocked: ${reward.name}`);
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

    ui.onGoHome(() => {
        game.returnToMenu();
    });

    ui.onAvatarSelect(avatarId => {
        game.setAvatar(avatarId);
    });

    ui.onHint(() => {
        game.giveHint();
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