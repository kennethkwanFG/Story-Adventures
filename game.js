// Game State
const gameState = {
    playerName: 'Daisy',
    currentScene: 'start',
    romance: {
        jin: 0,
        suga: 0,
        jhope: 0,
        rm: 0,
        jimin: 0,
        v: 0,
        jungkook: 0
    },
    visitedScenes: [],
    storyData: {}
};

// BTS Members display names
const btsMembers = {
    jin: 'Jin',
    suga: 'Suga',
    jhope: 'J-Hope',
    rm: 'RM',
    jimin: 'Jimin',
    v: 'V',
    jungkook: 'Jungkook'
};

// Load story data from markdown files
async function loadStoryData() {
    console.log('Loading story data...');
    try {
        // For now, we'll use embedded story data
        // Later you can load from separate .md files
        const response = await fetch('story/main-story.md');
        const text = await response.text();
        gameState.storyData = parseStoryFile(text);
        console.log('Story loaded from file:', Object.keys(gameState.storyData));
    } catch (error) {
        console.log('Using embedded demo story (file loading failed - this is normal when opening HTML directly)');
        // Fallback to demo story if file not found
        gameState.storyData = getDemoStory();
        console.log('Demo story loaded:', Object.keys(gameState.storyData));
    }
}

// Parse markdown story file with YAML frontmatter
function parseStoryFile(fileContent) {
    const scenes = {};
    const sceneBlocks = fileContent.split('---scene---');

    sceneBlocks.forEach(block => {
        if (!block.trim()) return;

        const lines = block.trim().split('\n');
        const scene = {
            background: '',
            characters: [],
            speaker: '',
            text: '',
            choices: []
        };

        let currentSection = 'metadata';
        let textLines = [];

        lines.forEach(line => {
            if (line.startsWith('id:')) {
                scene.id = line.replace('id:', '').trim();
            } else if (line.startsWith('background:')) {
                scene.background = line.replace('background:', '').trim();
            } else if (line.startsWith('characters:')) {
                const chars = line.replace('characters:', '').trim();
                scene.characters = chars.split(',').map(c => c.trim());
            } else if (line.startsWith('speaker:')) {
                scene.speaker = line.replace('speaker:', '').trim();
            } else if (line.startsWith('→')) {
                // Choice format: → "Choice text" (next_scene, +romance_member)
                const match = line.match(/→\s*"([^"]+)"\s*\(([^)]+)\)/);
                if (match) {
                    const choiceText = match[1];
                    const params = match[2].split(',').map(p => p.trim());
                    const nextScene = params[0];
                    const romanceEffect = params.find(p => p.startsWith('+romance_'));

                    scene.choices.push({
                        text: choiceText,
                        nextScene: nextScene,
                        romance: romanceEffect ? romanceEffect.replace('+romance_', '') : null
                    });
                }
            } else if (line.trim() && !line.startsWith('id:') && !line.startsWith('background:') && !line.startsWith('characters:') && !line.startsWith('speaker:')) {
                textLines.push(line);
            }
        });

        scene.text = textLines.join('\n').trim();

        if (scene.id) {
            scenes[scene.id] = scene;
        }
    });

    return scenes;
}

// Demo story data (embedded)
function getDemoStory() {
    return {
        start: {
            id: 'start',
            background: '',
            characters: [],
            speaker: '',
            text: `It's a quiet Saturday afternoon. You're lounging on your couch, scrolling through your phone, when you hear a knock at the door.\n\nThis is strange - you weren't expecting anyone.`,
            choices: [
                { text: `Open the door`, nextScene: 'door_open', romance: null },
                { text: `Look through the peephole first`, nextScene: 'peephole', romance: null }
            ]
        },
        peephole: {
            id: 'peephole',
            background: '',
            characters: [],
            speaker: 'You',
            text: `You cautiously approach the door and peek through the peephole.\n\nYour heart nearly stops.\n\nThere are SEVEN people standing outside. And they look... impossibly familiar.`,
            choices: [
                { text: `Open the door immediately!`, nextScene: 'door_open', romance: null }
            ]
        },
        door_open: {
            id: 'door_open',
            background: '',
            characters: ['rm'],
            speaker: 'RM',
            text: `"Hi! I'm really sorry to bother you, but our tour bus broke down nearby and... well, this is going to sound crazy, but could we possibly use your phone?"\n\nYou stand there, frozen. It's actually them. BTS. At YOUR door.`,
            choices: [
                { text: `"Of course! Please come in!"`, nextScene: 'invite_in', romance: 'rm' },
                { text: `"Um... yes, one moment!" (try to calm down first)`, nextScene: 'calm_down', romance: null }
            ]
        },
        invite_in: {
            id: 'invite_in',
            background: '',
            characters: ['rm', 'jin'],
            speaker: 'Jin',
            text: `"Thank you so much! You're very kind."\n\nThe seven members file into your living room, looking around with genuine appreciation.\n\nRM smiles warmly at you. "I'm RM, by the way. But I guess you already know that?"`,
            choices: [
                { text: `"I'm {{PLAYER_NAME}}. And yes, I'm a huge fan!"`, nextScene: 'fan_reveal', romance: 'rm' },
                { text: `Try to play it cool: "Nice to meet you all."`, nextScene: 'play_cool', romance: null }
            ]
        },
        calm_down: {
            id: 'calm_down',
            background: '',
            characters: ['jimin'],
            speaker: 'Jimin',
            text: `You take a deep breath, trying to process this surreal moment.\n\nJimin notices your nervousness and gives you the sweetest smile.\n\n"We know this is unexpected. Take your time. We're just grateful you answered the door."`,
            choices: [
                { text: `"Please, come in! I'm {{PLAYER_NAME}}."`, nextScene: 'invite_in', romance: 'jimin' },
                { text: `Nod and gesture them inside silently`, nextScene: 'invite_in', romance: null }
            ]
        },
        fan_reveal: {
            id: 'fan_reveal',
            background: '',
            characters: ['rm', 'jungkook', 'v'],
            speaker: 'Jungkook',
            text: `Jungkook's eyes light up. "Really? That's so cool!"\n\nV leans forward with curiosity. "What's your favorite song?"\n\nThe atmosphere relaxes immediately. They seem genuinely happy to meet a fan.`,
            choices: [
                { text: `"Dynamite! It always makes me smile."`, nextScene: 'continue_story', romance: 'jungkook' },
                { text: `"Spring Day - the lyrics are beautiful."`, nextScene: 'continue_story', romance: 'v' }
            ]
        },
        play_cool: {
            id: 'play_cool',
            background: '',
            characters: ['suga', 'jhope'],
            speaker: 'Suga',
            text: `Suga smirks slightly, as if he can see right through your 'cool' act.\n\n"You're handling this really well," he says with amusement.\n\nJ-Hope laughs. "Better than most people! Usually there's more screaming."`,
            choices: [
                { text: `Laugh: "I'm screaming on the inside, trust me."`, nextScene: 'continue_story', romance: 'jhope' },
                { text: `Smile at Suga: "Just trying not to freak out."`, nextScene: 'continue_story', romance: 'suga' }
            ]
        },
        continue_story: {
            id: 'continue_story',
            background: '',
            characters: ['rm'],
            speaker: 'RM',
            text: `"So about that phone..." RM says, pulling out his own phone with a sheepish grin. "Actually, I'm kidding. The bus is getting fixed right now."\n\nJin elbows him. "RM! You said we needed help!"\n\n"Well... we kind of wanted an excuse to meet locals. Tour life can be lonely."\n\n--- TO BE CONTINUED ---\n\nThis is the end of the demo! You can now add your own scenes in the story/main-story.md file.`,
            choices: [
                { text: `Restart Story`, nextScene: 'start', romance: null }
            ]
        }
    };
}

// Initialize game
async function initGame() {
    console.log('Initializing game...');

    try {
        await loadStoryData();
        console.log('Story data loaded successfully');

        // Event listeners
        console.log('Setting up event listeners...');

        const startBtn = document.getElementById('start-game-btn');
        console.log('Start button element:', startBtn);

        if (startBtn) {
            startBtn.addEventListener('click', startGame);
            console.log('Start button listener attached');
        } else {
            console.error('Start button not found!');
        }

        document.getElementById('menu-btn').addEventListener('click', openMenu);
        document.getElementById('save-btn').addEventListener('click', saveGame);
        document.getElementById('load-btn').addEventListener('click', loadGame);
        document.getElementById('resume-btn').addEventListener('click', closeMenu);
        document.getElementById('close-menu-btn').addEventListener('click', closeMenu);
        document.getElementById('restart-btn').addEventListener('click', restartGame);

        // Click to continue
        document.getElementById('text-box').addEventListener('click', handleTextBoxClick);

        console.log('Game initialized! Ready to play.');
        console.log('Total scenes loaded:', Object.keys(gameState.storyData).length);
    } catch (error) {
        console.error('Error initializing game:', error);
        alert('Error loading game. Please check console for details.');
    }
}

// Add a backup direct click handler in case event listener fails
window.startGameDirect = function() {
    console.log('Direct start function called');
    startGame();
};

function startGame() {
    console.log('Start button clicked!');

    const nameInput = document.getElementById('player-name-input');
    gameState.playerName = nameInput.value.trim() || 'Daisy';

    console.log('Player name:', gameState.playerName);
    console.log('Starting scene:', gameState.currentScene);

    document.getElementById('customization-screen').classList.add('hidden');
    loadScene(gameState.currentScene);
}

function loadScene(sceneId) {
    console.log('Loading scene:', sceneId);
    console.log('Available scenes:', Object.keys(gameState.storyData));

    const scene = gameState.storyData[sceneId];
    if (!scene) {
        console.error('Scene not found:', sceneId);
        console.error('Available scenes are:', Object.keys(gameState.storyData));
        alert('Error: Scene "' + sceneId + '" not found. Check console for details.');
        return;
    }

    console.log('Scene data:', scene);

    gameState.currentScene = sceneId;
    if (!gameState.visitedScenes.includes(sceneId)) {
        gameState.visitedScenes.push(sceneId);
    }

    // Update background
    if (scene.background) {
        document.getElementById('background').style.backgroundImage = `url('assets/backgrounds/${scene.background}')`;
    } else {
        // Default gradient background
        document.getElementById('background').style.backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    // Update characters
    updateCharacters(scene.characters);

    // Update text
    const dialogueText = scene.text.replace(/\{\{PLAYER_NAME\}\}/g, gameState.playerName);
    document.getElementById('speaker-name').textContent = scene.speaker || '';
    document.getElementById('dialogue-text').textContent = dialogueText;

    // Update choices
    displayChoices(scene.choices);

    // Update romance display
    updateRomanceDisplay();

    // Show/hide continue indicator
    if (scene.choices.length === 0) {
        document.getElementById('continue-indicator').classList.add('visible');
    } else {
        document.getElementById('continue-indicator').classList.remove('visible');
    }
}

function updateCharacters(characters) {
    // Hide all characters first
    document.querySelectorAll('.character').forEach(char => {
        char.classList.remove('visible');
        char.style.backgroundImage = '';
    });

    // Show specified characters
    if (characters.length > 0) {
        characters.forEach((char, index) => {
            let position = 'center';
            if (characters.length === 2) {
                position = index === 0 ? 'left' : 'right';
            } else if (characters.length === 3) {
                position = index === 0 ? 'left' : index === 1 ? 'center' : 'right';
            }

            const charElement = document.getElementById(`char-${position}`);
            charElement.style.backgroundImage = `url('assets/characters/${char}.png')`;
            charElement.classList.add('visible');
        });
    }
}

function displayChoices(choices) {
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';

    if (choices.length === 0) return;

    choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        if (choice.romance) {
            button.classList.add('romance');
        }

        const choiceText = choice.text.replace(/\{\{PLAYER_NAME\}\}/g, gameState.playerName);
        button.textContent = choiceText;

        button.addEventListener('click', () => {
            if (choice.romance) {
                gameState.romance[choice.romance] = (gameState.romance[choice.romance] || 0) + 1;
            }
            loadScene(choice.nextScene);
        });

        choicesContainer.appendChild(button);
    });
}

function handleTextBoxClick(e) {
    // Only advance if clicking dialogue area and no choices are present
    if (e.target.id === 'dialogue-text' || e.target.id === 'text-box') {
        const scene = gameState.storyData[gameState.currentScene];
        if (scene.choices.length === 0 && scene.nextScene) {
            loadScene(scene.nextScene);
        }
    }
}

function updateRomanceDisplay() {
    const display = document.getElementById('romance-display');
    const romanceEntries = Object.entries(gameState.romance)
        .filter(([_, points]) => points > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([member, points]) => `${btsMembers[member]}: ${points}💜`);

    if (romanceEntries.length > 0) {
        display.textContent = romanceEntries.join(' | ');
        display.style.display = 'block';
    } else {
        display.style.display = 'none';
    }
}

function openMenu() {
    document.getElementById('menu-overlay').classList.remove('hidden');
}

function closeMenu() {
    document.getElementById('menu-overlay').classList.add('hidden');
}

function saveGame() {
    const saveData = {
        playerName: gameState.playerName,
        currentScene: gameState.currentScene,
        romance: gameState.romance,
        visitedScenes: gameState.visitedScenes,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('bts_story_save', JSON.stringify(saveData));
    alert('Game saved successfully!');
}

function loadGame() {
    const saveData = localStorage.getItem('bts_story_save');
    if (!saveData) {
        alert('No save data found!');
        return;
    }

    const data = JSON.parse(saveData);
    gameState.playerName = data.playerName;
    gameState.currentScene = data.currentScene;
    gameState.romance = data.romance;
    gameState.visitedScenes = data.visitedScenes;

    document.getElementById('customization-screen').classList.add('hidden');
    loadScene(gameState.currentScene);
    closeMenu();

    alert('Game loaded successfully!');
}

function restartGame() {
    if (confirm('Are you sure you want to restart? Unsaved progress will be lost.')) {
        gameState.currentScene = 'start';
        gameState.romance = {
            jin: 0,
            suga: 0,
            jhope: 0,
            rm: 0,
            jimin: 0,
            v: 0,
            jungkook: 0
        };
        gameState.visitedScenes = [];

        closeMenu();
        loadScene('start');
    }
}

// Start the game when page loads
console.log('Game script loaded');
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, starting init...');
    initGame();
});
