// Audio controller logic will be in this file. 

class AudioController {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.selectedVoice = null;
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

    playEffect(effectName) {
        const effects = {
            success: "Great job!",
            error: "Almost, try again!"
        };
        this.speak(effects[effectName]);
    }

    unlockAudio() {
        // This is a common trick to enable audio on iOS and some other browsers.
        // A silent utterance is spoken on the first user interaction.
        if (this.synth && !this.synth.speaking) {
            const silentUtterance = new SpeechSynthesisUtterance("");
            this.synth.speak(silentUtterance);
        }
    }
} 