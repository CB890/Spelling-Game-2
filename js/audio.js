// Audio controller logic will be in this file. 

class AudioController {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.selectedVoice = null;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        this.loadVoices();

        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoices();
        }
    }

    loadVoices() {
        this.voices = this.synth.getVoices();
        // Attempt to find a child-friendly, female, English voice
        this.selectedVoice = this.voices.find(voice => 
            voice.lang.startsWith('en') && 
            voice.name.includes('Google') &&
            !voice.name.includes('Male')
        ) || this.voices.find(voice => voice.lang.startsWith('en')); // Fallback to any English voice
        
        console.log("Available voices:", this.voices);
        console.log("Selected voice:", this.selectedVoice);
    }

    speak(text, onEndCallback = null) {
        if (!text) {
            console.warn("Speak function called with no text.");
            return;
        }
        if (this.synth.speaking) {
            // Optional: queue the utterance or just ignore. For this game, ignoring is fine.
            console.log("Synth is already speaking. New request ignored.");
            return;
        }
        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = this.selectedVoice;
            utterance.pitch = 1.1;
            utterance.rate = 0.9;
            if (onEndCallback) {
                utterance.onend = onEndCallback;
            }
            this.synth.speak(utterance);
        } catch (error) {
            console.error("Speech synthesis failed.", error);
        }
    }

    getSentenceForWord(word) {
        const sentences = {
            cloud: "The fluffy cloud floats in the sky",
            flower: "The pretty flower smells sweet",
            round: "Draw a round circle",
            clown: "The funny clown makes me laugh",
            playground: "Let's play at the playground"
        };
        return sentences[word] || "";
    }

    playWordThenSentence(word) {
        if (!word) return;
        const sentence = this.getSentenceForWord(word);
        this.speak(word, () => {
            // Use a slight delay to make the pause feel more natural
            setTimeout(() => this.speak(sentence), 250);
        });
    }

    playWord(word, inSentence = false) {
        const textToSpeak = inSentence ? this.getSentenceForWord(word) : word;
        this.speak(textToSpeak);
    }

    playSfx(type) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01); // Quick fade in

        if (type === 'success') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
        } else if (type === 'error') {
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
        } else {
            return; // Unknown type
        }

        oscillator.start(this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + 0.2);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    playEffect(effectName) {
        this.playSfx(effectName);
    }

    unlockAudio() {
        // This is a common trick to enable audio on iOS and some other browsers.
        // A silent utterance is spoken on the first user interaction.
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        if (this.synth && !this.synth.speaking) {
            const silentUtterance = new SpeechSynthesisUtterance("");
            this.synth.speak(silentUtterance);
        }
    }
} 