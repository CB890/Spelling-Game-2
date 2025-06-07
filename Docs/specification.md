# Interactive Spelling Assessment Game - Technical Specification

## 1. Project Overview

### 1.1 Purpose
An interactive web-based spelling assessment game designed for 6-year-old children to practice and assess "ou" and "ow" phonetic sound patterns through an engaging racing car theme.

### 1.2 Target Audience
- Primary: 6-year-old children
- Secondary: Parents/teachers monitoring progress

### 1.3 Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla or React - cursor AI friendly)
- **Audio**: Web Audio API or HTML5 Audio
- **Deployment**: GitHub Pages (static hosting)
- **Development**: Optimized for Cursor AI assistance

## 2. Core Features & Requirements

### 2.1 Word List & Content
**Primary Words** (exactly 5):
- cloud
- flower  
- round
- clown
- playground

**Audio Requirements**:
- Each word pronounced clearly with child-friendly voice
- Each word used in a simple sentence context
- Example sentences:
  - "The fluffy **cloud** floats in the sky"
  - "The pretty **flower** smells sweet"
  - "Draw a **round** circle"
  - "The funny **clown** makes me laugh"
  - "Let's play at the **playground**"

### 2.2 Avatar Selection
**Available Avatars**:
- Mr Beast (cartoon style representation)
- Liverpool FC logo/mascot
- Arsenal FC logo/mascot  
- Cristiano Ronaldo (cartoon style representation)

**Implementation**:
- Avatar selection screen before game starts
- Selected avatar appears as the "driver" of the racing car
- Avatar celebration animations for correct answers

## 3. User Stories

### 3.1 Primary User Stories
**As a 6-year-old child, I want to:**
- Select my favorite avatar before playing
- Hear words spoken clearly so I know what to spell
- Use a big, colorful keyboard that's easy to tap
- See my racing car move forward when I spell correctly
- Play without time pressure when I'm learning
- Challenge myself with a timer when I'm ready
- See my final score with fun animations
- Know the correct spelling if I make mistakes

### 3.2 Secondary User Stories
**As a parent/teacher, I want:**
- The child to receive immediate feedback on their spelling
- Clear visual progress indicators
- A simple interface that doesn't require adult supervision
- Educational value focused on phonetic learning

## 4. Game Modes

### 4.1 Practice Mode
**Characteristics**:
- No time pressure
- Unlimited attempts per word
- Encouraging feedback for incorrect attempts
- Focus on learning and building confidence

**User Flow**:
1. Avatar selection
2. Racing car appears at starting line
3. Audio plays: sentence + isolated word
4. Child spells using on-screen keyboard
5. Immediate feedback (correct/incorrect)
6. Car advances on correct spelling
7. Repeat for all 5 words
8. Celebration screen with total score

### 4.2 Test Mode
**Characteristics**:
- Timed challenges for bonus points
- Single attempt per word (with option to see correct answer)
- Performance-based scoring
- Assessment focus

**Timing Structure**:
- 30 seconds per word (age-appropriate)
- Bonus points for quick correct answers:
  - 20+ seconds remaining: 10 bonus points
  - 10+ seconds remaining: 5 bonus points
  - Less than 10 seconds: Standard points

**User Flow**:
1. Avatar selection
2. Racing car at starting line with timer visible
3. Audio plays: sentence + isolated word
4. Timer starts (30 seconds)
5. Child spells using on-screen keyboard
6. Immediate feedback + time bonus calculation
7. Car advances with speed animation based on time bonus
8. Repeat for all 5 words
9. Final score screen with breakdown

## 5. User Interface Design

### 5.1 Color Scheme & Visual Theme
**Primary Colors**:
- Bright blue (#3498db) - main interface elements
- Vibrant green (#2ecc71) - correct answers/success
- Warm red (#e74c3c) - incorrect answers/errors
- Sunny yellow (#f1c40f) - highlights and accents
- Pure white (#ffffff) - backgrounds and text contrast

**Racing Theme Elements**:
- Colorful race track with checkered patterns
- Cartoon-style racing car (changes based on avatar)
- Progress markers (flags, cones, finish line)
- Cheering crowd animations for correct answers
- Speed lines and celebration confetti

### 5.2 Layout Specifications

#### 5.2.1 Main Menu Screen
```
[Game Title - Large, Colorful Font]
[Avatar Selection Grid - 2x2]
[Practice Mode Button - Large, Green]
[Test Mode Button - Large, Orange]
```

#### 5.2.2 Game Screen Layout
```
[Progress Bar with Racing Car]
[Current Word Display Area]
[Audio Control Button - Speaker Icon]
[On-Screen Keyboard - Large Keys]
[Submit Button]
[Score Display]
```

#### 5.2.3 Results Screen
```
[Celebration Animation]
[Final Score - Large Display]
[Correct/Incorrect Breakdown]
[Missed Words Review]
[Play Again Button]
[Back to Menu Button]
```

### 5.3 Typography
**Primary Font**: Comic Sans MS or similar child-friendly font
**Font Sizes**:
- Headings: 32px minimum
- Body text: 24px minimum  
- Button text: 28px minimum
- Keyboard keys: 20px minimum

### 5.4 On-Screen Keyboard Design
**Layout**: QWERTY layout with large, touch-friendly keys
**Key Specifications**:
- Minimum 60px x 60px per key
- 10px spacing between keys
- Rounded corners (10px border-radius)
- Distinct color for vowels vs consonants
- Haptic feedback simulation (visual press animation)
- Special highlighting for 'O' and 'U' keys (since they're focus letters)

## 6. Audio System

### 6.1 Audio Requirements
**Voice Characteristics**:
- Clear, child-friendly voice (preferably British accent for consistency)
- Moderate speaking pace
- Enthusiastic but not overwhelming tone

**Audio Files Needed**:
- 5 word pronunciations (isolated)
- 5 sentence pronunciations (with word emphasized)
- Success sound effects (car engine, cheering)
- Error sound effects (gentle, not discouraging)
- Background music (optional, toggleable)

### 6.2 Audio Implementation
```javascript
// Example audio structure
const gameAudio = {
  words: {
    cloud: {
      word: 'audio/cloud.mp3',
      sentence: 'audio/cloud_sentence.mp3'
    },
    // ... other words
  },
  effects: {
    success: 'audio/success.mp3',
    error: 'audio/error.mp3',
    carEngine: 'audio/car_engine.mp3'
  }
};
```

## 7. Game Mechanics & Scoring

### 7.1 Scoring System
**Base Points**:
- Correct spelling: 20 points
- Incorrect spelling: 0 points

**Time Bonuses (Test Mode Only)**:
- 20+ seconds remaining: +10 points
- 10-19 seconds remaining: +5 points
- 1-9 seconds remaining: +0 points

**Maximum Possible Score**:
- Practice Mode: 100 points (5 words × 20 points)
- Test Mode: 150 points (5 words × 30 points max)

### 7.2 Racing Car Progress System
**Track Design**:
- 5 segments (one per word)
- Each segment has visual landmarks:
  1. Starting line with checkered flag
  2. Forest section with trees
  3. City section with buildings  
  4. Mountain section with hills
  5. Finish line with trophy

**Car Movement**:
- Smooth CSS animations (2-second duration)
- Speed varies based on time bonus in Test Mode
- Celebration animation at each checkpoint
- Victory lap animation at finish line

### 7.3 Feedback System
**Correct Answer Feedback**:
- Green checkmark animation
- Car advancement with speed lines
- Positive sound effect
- Brief text: "Great job!" or "Excellent!"

**Incorrect Answer Feedback**:
- Gentle red highlight (not harsh)
- Correct spelling displayed for 3 seconds
- Encouraging text: "Try again!" or "Almost there!"
- Car pauses but doesn't move backwards

## 8. Technical Architecture

### 8.1 File Structure
```
spelling-game/
├── index.html
├── css/
│   ├── styles.css
│   └── animations.css
├── js/
│   ├── game.js
│   ├── audio.js
│   └── ui.js
├── audio/
│   ├── words/
│   └── effects/
├── images/
│   ├── avatars/
│   ├── cars/
│   └── track/
└── README.md
```

### 8.2 Core JavaScript Modules

#### 8.2.1 Game Controller
```javascript
class SpellingGame {
  constructor() {
    this.words = ['cloud', 'flower', 'round', 'clown', 'playground'];
    this.currentWordIndex = 0;
    this.score = 0;
    this.mode = 'practice'; // or 'test'
    this.selectedAvatar = null;
    this.timeRemaining = 30;
  }
  
  // Core game methods
  startGame(mode) { }
  nextWord() { }
  checkSpelling(input) { }
  updateScore(points) { }
  endGame() { }
}
```

#### 8.2.2 UI Controller
```javascript
class UIController {
  constructor(game) {
    this.game = game;
    this.keyboard = new VirtualKeyboard();
  }
  
  // UI management methods
  showAvatarSelection() { }
  displayWord() { }
  updateProgress() { }
  showResults() { }
  animateCarMovement() { }
}
```

#### 8.2.3 Audio Controller
```javascript
class AudioController {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.sounds = {};
  }
  
  // Audio methods
  loadAudio() { }
  playWord(word) { }
  playSentence(word) { }
  playEffect(effect) { }
}
```

### 8.3 Data Flow
1. **Initialization**: Load audio files, initialize game state
2. **Avatar Selection**: User chooses avatar, stored in game state
3. **Mode Selection**: User chooses Practice or Test mode
4. **Game Loop**: 
   - Shuffle word order
   - For each word: play audio → capture input → validate → provide feedback → update progress
5. **Results**: Calculate final score, show missed words, offer replay

## 9. Responsive Design

### 9.1 Breakpoints
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px  
- **Mobile**: 320px - 767px

### 9.2 Touch Optimization
- Minimum 44px touch targets (following Apple guidelines)
- Adequate spacing between interactive elements
- Visual feedback for all touch interactions
- Support for both portrait and landscape orientations

### 9.3 Device Considerations
- **iPads/Tablets**: Optimized layout with larger keyboard
- **Phones**: Stackable UI elements, simplified navigation
- **Desktop**: Mouse hover effects, keyboard shortcuts (optional)

## 10. Performance Requirements

### 10.1 Loading Performance
- **Target**: Page load under 3 seconds on average connection
- **Audio preloading**: Background loading of audio files
- **Image optimization**: Compressed images under 100KB each
- **Lazy loading**: Non-critical assets loaded after initial render

### 10.2 Runtime Performance
- **Animations**: 60fps target for car movement
- **Memory usage**: Under 50MB total
- **Audio latency**: Under 100ms for button press to sound
- **Touch response**: Under 50ms for visual feedback

### 10.3 Optimization Strategies
- CSS animations over JavaScript animations
- Audio sprite sheets for sound effects
- Image sprites for UI elements
- Minimal DOM manipulation during gameplay

## 11. Accessibility Features

### 11.1 Visual Accessibility
- High contrast color combinations (4.5:1 minimum ratio)
- Large, clear fonts
- Visual focus indicators for keyboard navigation
- Alt text for all images

### 11.2 Motor Accessibility
- Large touch targets (minimum 60px)
- Generous spacing between interactive elements
- No precise timing requirements in Practice mode
- Alternative input methods (keyboard support)

### 11.3 Cognitive Accessibility
- Simple, clear instructions
- Consistent navigation patterns
- Visual progress indicators
- Error messages in plain language

## 12. Error Handling

### 12.1 Audio Errors
- Fallback text if audio fails to load
- Visual indicators when audio is playing
- Manual replay option for each word

### 12.2 Input Validation
- Real-time spelling validation
- Prevent submission of empty inputs
- Clear indication of acceptable characters

### 12.3 Browser Compatibility
- Graceful degradation for older browsers
- Feature detection for audio support
- Fallback options for unsupported features

## 13. Testing Strategy

### 13.1 Functional Testing
- All words spell correctly in both modes
- Audio plays correctly for all words and sentences
- Scoring system calculates accurately
- Car animation progresses properly
- Avatar selection persists through game

### 13.2 Usability Testing
- 6-year-old children can navigate independently
- Instructions are clear and understandable
- Visual feedback is immediate and clear
- Game completion time is appropriate (5-10 minutes)

### 13.3 Cross-Platform Testing
- Multiple browsers (Chrome, Firefox, Safari, Edge)
- Various screen sizes and orientations
- Touch and mouse input methods
- Different audio capabilities

## 14. Deployment Specifications

### 14.1 GitHub Pages Setup
- Repository structure optimized for GitHub Pages
- All assets referenced with relative paths
- HTTPS compatibility ensured
- Custom domain support (optional)

### 14.2 Build Process
- No build process required (vanilla HTML/CSS/JS)
- Asset optimization through manual compression
- Version control through Git tags
- Easy deployment through GitHub Actions (optional)

## 15. Future Enhancement Opportunities

### 15.1 Phase 2 Features
- Additional word lists for different phonetic patterns
- Multiplayer racing mode
- Achievement badges and rewards
- Parent/teacher progress reports

### 15.2 Technical Improvements
- Progressive Web App (PWA) capabilities
- Offline functionality
- Voice recognition for spelling input
- Advanced analytics and learning insights

## 16. Success Metrics

### 16.1 Educational Effectiveness
- Spelling accuracy improvement over multiple sessions
- Time to completion improvement
- Error pattern analysis

### 16.2 Engagement Metrics
- Session completion rate
- Time spent in game
- Mode preference (Practice vs Test)
- Avatar selection distribution

---

*This specification provides a comprehensive foundation for developing an engaging, educational spelling assessment game optimized for 6-year-old children and cursor AI development assistance.*