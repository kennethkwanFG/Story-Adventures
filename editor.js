// Story Editor JavaScript

const BTS_MEMBERS = ['jin', 'suga', 'jhope', 'rm', 'jimin', 'v', 'jungkook'];
const MEMBER_NAMES = {
    jin: 'Jin',
    suga: 'Suga',
    jhope: 'J-Hope',
    rm: 'RM',
    jimin: 'Jimin',
    v: 'V',
    jungkook: 'Jungkook'
};

let scenes = {};
let currentEditingScene = null;
let availableImages = {
    backgrounds: [],
    characters: []
};

// Initialize editor
window.addEventListener('DOMContentLoaded', async () => {
    console.log('Story Editor initialized');

    // Show loading message
    const sceneList = document.getElementById('scene-list');
    sceneList.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h3>Loading your story...</h3>
            <p style="color: #666; margin-top: 10px;">If scenes don't appear, click "Load Story File" below</p>
        </div>
    `;

    const loaded = await loadStory();
    await checkAvailableImages();
    renderSceneList();
    renderImageManagement();

    // Hide welcome info if scenes loaded successfully
    if (loaded && Object.keys(scenes).length > 0) {
        const welcomeInfo = document.getElementById('welcome-info');
        if (welcomeInfo) {
            welcomeInfo.style.display = 'none';
        }
        console.log(`✅ Auto-loaded ${Object.keys(scenes).length} scenes`);

        // Pre-render flow diagram (will be shown when tab is clicked)
        renderStoryFlow();
    }
});

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');

    // Render flow diagram when switching to flow tab
    if (tabName === 'flow') {
        renderStoryFlow();
    }
}

// Load story from file
async function loadStory() {
    try {
        const response = await fetch('story/main-story.md');
        if (!response.ok) {
            throw new Error('Failed to fetch story file');
        }
        const text = await response.text();
        scenes = parseMarkdownStory(text);
        console.log('✅ Loaded scenes:', Object.keys(scenes));
        return true;
    } catch (error) {
        console.warn('⚠️ Could not auto-load story (browser security). Use manual load instead.');
        console.error(error);
        scenes = {};
        return false;
    }
}

// Parse markdown story file
function parseMarkdownStory(markdown) {
    const parsed = {};
    const sceneBlocks = markdown.split('---scene---').filter(block => block.trim());

    sceneBlocks.forEach(block => {
        const scene = {
            id: '',
            background: '',
            characters: [],
            speaker: '',
            text: '',
            choices: []
        };

        const lines = block.trim().split('\n');
        let textLines = [];
        let inText = false;

        lines.forEach(line => {
            if (line.startsWith('id:')) {
                scene.id = line.replace('id:', '').trim();
            } else if (line.startsWith('background:')) {
                scene.background = line.replace('background:', '').trim();
            } else if (line.startsWith('characters:')) {
                const chars = line.replace('characters:', '').trim();
                scene.characters = chars ? chars.split(',').map(c => c.trim()) : [];
            } else if (line.startsWith('speaker:')) {
                scene.speaker = line.replace('speaker:', '').trim();
            } else if (line.startsWith('→')) {
                // Parse choice
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
                inText = false;
            } else if (line.trim() && !line.startsWith('id:') && !line.startsWith('background:') &&
                       !line.startsWith('characters:') && !line.startsWith('speaker:')) {
                textLines.push(line);
                inText = true;
            }
        });

        scene.text = textLines.join('\n').trim();

        if (scene.id) {
            parsed[scene.id] = scene;
        }
    });

    return parsed;
}

// Render story flow diagram
function renderStoryFlow() {
    const container = document.getElementById('flow-diagram');

    if (Object.keys(scenes).length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No scenes loaded. Load your story first!</p>';
        return;
    }

    // Build scene graph
    const graph = buildSceneGraph();

    // Create flow visualization
    container.innerHTML = `
        <div class="flow-container" id="flow-nodes" style="position: relative;"></div>
        <div class="flow-legend">
            <div class="flow-legend-item">
                <div class="flow-legend-box" style="background: #E8F5E9; border-color: #4CAF50;"></div>
                <span>Start scene</span>
            </div>
            <div class="flow-legend-item">
                <div class="flow-legend-box" style="background: white; border-color: #667eea;"></div>
                <span>Regular scene</span>
            </div>
            <div class="flow-legend-item">
                <div class="flow-legend-box" style="background: #FFF3E0; border-color: #FF9800;"></div>
                <span>Orphan (no incoming connections)</span>
            </div>
        </div>
    `;

    const nodesContainer = document.getElementById('flow-nodes');

    // Position scenes using tree layout
    const positioned = layoutScenes(graph);

    // Render nodes
    positioned.nodes.forEach(node => {
        const scene = scenes[node.id];
        const nodeDiv = document.createElement('div');
        nodeDiv.className = `flow-node ${node.isStart ? 'start' : ''} ${node.isOrphan ? 'orphan' : ''}`;
        nodeDiv.style.left = node.x + 'px';
        nodeDiv.style.top = node.y + 'px';
        nodeDiv.onclick = () => editScene(node.id);

        const choiceCount = scene.choices.length;

        // Get connections for this scene
        const connections = scene.choices.map(c => c.nextScene).filter((v, i, a) => a.indexOf(v) === i);
        const connectionsText = connections.length > 0
            ? `→ ${connections.join(', ')}`
            : '(no connections)';

        nodeDiv.innerHTML = `
            <div class="flow-node-title">${node.id}</div>
            <div class="flow-node-text">${scene.text.substring(0, 40)}${scene.text.length > 40 ? '...' : ''}</div>
            <div class="flow-node-choices">${choiceCount} choice${choiceCount !== 1 ? 's' : ''}</div>
            <div class="flow-node-connections">${connectionsText}</div>
        `;

        nodesContainer.appendChild(nodeDiv);
    });
}

// Build scene connection graph
function buildSceneGraph() {
    const graph = {
        nodes: {},
        edges: []
    };

    // Create nodes
    Object.keys(scenes).forEach(sceneId => {
        graph.nodes[sceneId] = {
            id: sceneId,
            children: [],
            parents: [],
            scene: scenes[sceneId]
        };
    });

    // Create edges
    Object.values(scenes).forEach(scene => {
        scene.choices.forEach(choice => {
            if (graph.nodes[choice.nextScene]) {
                graph.edges.push({
                    from: scene.id,
                    to: choice.nextScene,
                    label: choice.text.substring(0, 20) + (choice.text.length > 20 ? '...' : '')
                });

                graph.nodes[scene.id].children.push(choice.nextScene);
                graph.nodes[choice.nextScene].parents.push(scene.id);
            }
        });
    });

    return graph;
}

// Layout scenes in tree structure
function layoutScenes(graph) {
    const nodeWidth = 250;
    const nodeHeight = 100;
    const horizontalGap = 200;
    const verticalGap = 200;

    const positioned = {
        nodes: [],
        edges: graph.edges
    };

    // Find start scene
    const startScene = scenes.start ? 'start' : Object.keys(scenes)[0];

    // Find orphans (scenes with no parents)
    const orphans = Object.keys(graph.nodes).filter(id =>
        graph.nodes[id].parents.length === 0 && id !== startScene
    );

    // BFS layout from start scene
    const visited = new Set();
    const levels = [];

    function addToLevel(sceneId, level) {
        if (visited.has(sceneId)) return;
        visited.add(sceneId);

        if (!levels[level]) levels[level] = [];
        levels[level].push(sceneId);

        // Add children to next level
        const children = graph.nodes[sceneId].children;
        children.forEach(childId => {
            addToLevel(childId, level + 1);
        });
    }

    addToLevel(startScene, 0);

    // Position nodes by level
    levels.forEach((level, levelIndex) => {
        const levelWidth = level.length * (nodeWidth + horizontalGap);
        const startX = Math.max(50, (1200 - levelWidth) / 2);

        level.forEach((sceneId, index) => {
            positioned.nodes.push({
                id: sceneId,
                x: startX + index * (nodeWidth + horizontalGap),
                y: 50 + levelIndex * verticalGap,
                isStart: sceneId === startScene,
                isOrphan: false
            });
        });
    });

    // Position orphan scenes at the bottom
    orphans.forEach((sceneId, index) => {
        if (!visited.has(sceneId)) {
            positioned.nodes.push({
                id: sceneId,
                x: 50 + index * (nodeWidth + horizontalGap),
                y: 50 + levels.length * verticalGap,
                isStart: false,
                isOrphan: true
            });
        }
    });

    // Ensure container is tall enough
    const maxY = Math.max(...positioned.nodes.map(n => n.y)) + nodeHeight + 50;
    const container = document.getElementById('flow-nodes');
    container.style.minHeight = maxY + 'px';

    return positioned;
}

// Draw arrows between scenes
function drawFlowArrows(positioned) {
    const svg = document.querySelector('#flow-diagram svg');
    const container = document.getElementById('flow-nodes');

    if (!svg || !container) return;

    // Get container dimensions
    const maxX = Math.max(...positioned.nodes.map(n => n.x)) + 300;
    const maxY = Math.max(...positioned.nodes.map(n => n.y)) + 150;

    svg.setAttribute('width', maxX);
    svg.setAttribute('height', maxY);
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '0';

    // Clear existing arrows (keep defs)
    const defs = svg.querySelector('defs');
    svg.innerHTML = '';
    svg.appendChild(defs);

    // Draw edges
    positioned.edges.forEach(edge => {
        const fromNode = positioned.nodes.find(n => n.id === edge.from);
        const toNode = positioned.nodes.find(n => n.id === edge.to);

        if (!fromNode || !toNode) return;

        // Calculate arrow positions (center of nodes)
        const x1 = fromNode.x + 125;
        const y1 = fromNode.y + 50;
        const x2 = toNode.x + 125;
        const y2 = toNode.y + 50;

        // Create curved path
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const curve = Math.abs(y2 - y1) / 4;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${x1} ${y1} Q ${midX} ${midY - curve}, ${x2} ${y2}`);
        path.setAttribute('class', 'flow-arrow-line');
        path.setAttribute('stroke', '#667eea');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('marker-end', 'url(#arrowhead)');

        svg.appendChild(path);

        // Add label
        if (edge.label) {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', midX);
            text.setAttribute('y', midY - curve - 5);
            text.setAttribute('class', 'flow-arrow-label');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#667eea');
            // Truncate long labels
            const truncatedLabel = edge.label.length > 30 ? edge.label.substring(0, 30) + '...' : edge.label;
            text.textContent = truncatedLabel;

            // Background for readability
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            const bbox = text.getBBox ? text.getBBox() : { x: midX - 50, y: midY - curve - 15, width: 100, height: 15 };
            rect.setAttribute('x', bbox.x - 2);
            rect.setAttribute('y', bbox.y - 2);
            rect.setAttribute('width', bbox.width + 4);
            rect.setAttribute('height', bbox.height + 4);
            rect.setAttribute('fill', 'white');
            rect.setAttribute('opacity', '0.9');

            svg.appendChild(rect);
            svg.appendChild(text);
        }
    });
}

// Render scene list
function renderSceneList() {
    const container = document.getElementById('scene-list');

    if (Object.keys(scenes).length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3 style="color: #667eea; margin-bottom: 20px;">No Scenes Loaded</h3>
                <p style="color: #666; margin-bottom: 20px;">
                    Due to browser security, the story file couldn't load automatically.<br>
                    Click below to manually load your story file.
                </p>
                <input type="file" id="manual-story-load" accept=".md" style="display: none;" onchange="loadStoryManually(this)">
                <button class="btn" onclick="document.getElementById('manual-story-load').click()">
                    📂 Load story/main-story.md
                </button>
                <p style="color: #999; margin-top: 20px; font-size: 14px;">
                    Or create your first scene to start fresh
                </p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    Object.values(scenes).forEach(scene => {
        const card = document.createElement('div');
        card.className = 'scene-card';
        card.onclick = () => editScene(scene.id);

        const preview = scene.text.substring(0, 100) + (scene.text.length > 100 ? '...' : '');
        const choiceCount = scene.choices.length;
        const charDisplay = scene.characters.length > 0 ? scene.characters.join(', ') : 'none';

        // Build connections display
        let connectionsHTML = '';
        if (scene.choices.length > 0) {
            const nextScenes = scene.choices.map(c => c.nextScene).filter(s => scenes[s]);
            if (nextScenes.length > 0) {
                connectionsHTML = `<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 12px; color: #667eea;">
                    → Goes to: ${nextScenes.join(', ')}
                </div>`;
            }
        }

        card.innerHTML = `
            <h3>${scene.id}${scene.id === 'start' ? ' ⭐' : ''}</h3>
            ${scene.speaker ? `<div class="speaker">${scene.speaker}</div>` : ''}
            <div class="preview">${preview}</div>
            <div class="meta">
                <span>👥 ${charDisplay}</span>
                <span>🔀 ${choiceCount} choice${choiceCount !== 1 ? 's' : ''}</span>
                ${scene.background ? `<span>🖼️ ${scene.background}</span>` : ''}
            </div>
            ${connectionsHTML}
        `;

        container.appendChild(card);
    });
}

// Create new scene
function createNewScene() {
    currentEditingScene = null;
    const scene = {
        id: '',
        background: '',
        characters: [],
        speaker: '',
        text: '',
        choices: []
    };

    renderEditForm(scene, true);
    switchTab('edit');
}

// Edit existing scene
function editScene(sceneId) {
    currentEditingScene = sceneId;
    const scene = scenes[sceneId];
    renderEditForm(scene, false);

    // Switch to edit tab
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab')[1].classList.add('active');
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById('tab-edit').classList.add('active');
}

// Render edit form
function renderEditForm(scene, isNew) {
    const container = document.getElementById('edit-form');

    container.innerHTML = `
        <h2>${isNew ? '➕ Create New Scene' : '✏️ Edit Scene: ' + scene.id}</h2>

        ${!isNew ? `<div class="alert alert-warning">
            You are editing an existing scene. Changes will update the story file.
        </div>` : ''}

        <div class="form-group">
            <label>Scene ID *</label>
            <input type="text" id="scene-id" value="${scene.id}" ${!isNew ? 'readonly' : ''} placeholder="e.g., kitchen_morning">
            <div class="help-text">Unique identifier (use lowercase, underscores, no spaces)</div>
        </div>

        <div class="form-group">
            <label>Speaker</label>
            <select id="scene-speaker">
                <option value="">No speaker / Narrator</option>
                <option value="You" ${scene.speaker === 'You' ? 'selected' : ''}>You (player)</option>
                ${BTS_MEMBERS.map(member =>
                    `<option value="${MEMBER_NAMES[member]}" ${scene.speaker === MEMBER_NAMES[member] ? 'selected' : ''}>${MEMBER_NAMES[member]}</option>`
                ).join('')}
            </select>
        </div>

        <div class="form-group">
            <label>Scene Text / Dialogue *</label>
            <textarea id="scene-text" placeholder="Enter the story text or dialogue here... Use {{PLAYER_NAME}} for the player's name.">${scene.text}</textarea>
            <div class="help-text">Tip: Use {{PLAYER_NAME}} to insert the player's custom name</div>
        </div>

        <div class="form-group">
            <label>Characters on Screen</label>
            <div class="character-selector" id="character-selector">
                ${BTS_MEMBERS.map(member => `
                    <div class="character-chip ${scene.characters.includes(member) ? 'selected' : ''}"
                         data-character="${member}"
                         onclick="toggleCharacter('${member}')">
                        ${MEMBER_NAMES[member]}
                    </div>
                `).join('')}
            </div>
            <div class="help-text">Click to select which BTS members appear in this scene</div>
        </div>

        <div class="form-group">
            <label>Background Image</label>
            <input type="text" id="scene-background" value="${scene.background}" placeholder="e.g., living_room.jpg">
            <div class="help-text">Type the filename from assets/backgrounds/ (e.g., kitchen.jpg, bedroom.png) or leave blank for default gradient</div>
        </div>

        <div class="form-group">
            <label>Choices</label>
            <div id="choices-container"></div>
            <button class="btn btn-secondary btn-small" onclick="addChoice()">➕ Add Choice</button>
        </div>

        <div class="form-group">
            <label>Preview</label>
            <div class="preview-panel">
                <div class="preview-background" id="preview-bg"></div>
                <div class="preview-content">
                    <div class="preview-speaker" id="preview-speaker"></div>
                    <div class="preview-text" id="preview-text"></div>
                    <div id="preview-choices"></div>
                </div>
            </div>
            <button class="btn btn-secondary btn-small" onclick="updatePreview()">🔄 Refresh Preview</button>
        </div>

        <div class="button-group">
            <button class="btn" onclick="saveScene(${isNew})">${isNew ? '💾 Create Scene' : '💾 Save Changes'}</button>
            <button class="btn btn-secondary" onclick="switchTab('scenes')">❌ Cancel</button>
            ${!isNew ? '<button class="btn btn-danger" onclick="deleteScene()">🗑️ Delete Scene</button>' : ''}
            ${!isNew ? '<button class="btn btn-secondary" onclick="duplicateScene()">📋 Duplicate</button>' : ''}
        </div>
    `;

    renderChoices(scene.choices);
    updatePreview();
}

// Toggle character selection
function toggleCharacter(member) {
    const chip = document.querySelector(`[data-character="${member}"]`);
    chip.classList.toggle('selected');
    updatePreview();
}

// Render choices
function renderChoices(choices) {
    const container = document.getElementById('choices-container');
    container.innerHTML = '';

    choices.forEach((choice, index) => {
        addChoiceElement(choice, index);
    });

    if (choices.length === 0) {
        container.innerHTML = '<p style="color: #999;">No choices yet. Add choices to create branching paths.</p>';
    }
}

// Add choice element
function addChoiceElement(choice = null, index = -1) {
    const container = document.getElementById('choices-container');
    const choiceDiv = document.createElement('div');
    choiceDiv.className = 'choice-item';

    const isNew = choice === null;
    const choiceData = choice || { text: '', nextScene: '', romance: null };
    const actualIndex = isNew ? container.children.length : index;

    choiceDiv.innerHTML = `
        <input type="text" placeholder="Choice text" value="${choiceData.text}" data-choice-index="${actualIndex}" data-field="text" onchange="updatePreview()">
        <select data-choice-index="${actualIndex}" data-field="nextScene" onchange="updatePreview()">
            <option value="">Select next scene...</option>
            ${Object.keys(scenes).map(sceneId =>
                `<option value="${sceneId}" ${choiceData.nextScene === sceneId ? 'selected' : ''}>${sceneId}</option>`
            ).join('')}
        </select>
        <div class="romance-toggle">
            <input type="checkbox" id="romance-${actualIndex}" ${choiceData.romance ? 'checked' : ''}
                   onchange="toggleRomance(${actualIndex})">
            <label for="romance-${actualIndex}">💜 Romance choice</label>
        </div>
        <div class="romance-selector" id="romance-selector-${actualIndex}" style="display: ${choiceData.romance ? 'block' : 'none'}">
            <select data-choice-index="${actualIndex}" data-field="romance" onchange="updatePreview()">
                <option value="">Select member...</option>
                ${BTS_MEMBERS.map(member =>
                    `<option value="${member}" ${choiceData.romance === member ? 'selected' : ''}>${MEMBER_NAMES[member]}</option>`
                ).join('')}
            </select>
        </div>
        <div class="choice-controls">
            <button class="btn btn-danger btn-small" onclick="removeChoice(${actualIndex})">🗑️ Remove</button>
        </div>
    `;

    container.appendChild(choiceDiv);
}

// Add choice
function addChoice() {
    addChoiceElement();
    updatePreview();
}

// Remove choice
function removeChoice(index) {
    const container = document.getElementById('choices-container');
    container.children[index].remove();

    // Re-index remaining choices
    Array.from(container.children).forEach((child, newIndex) => {
        child.querySelectorAll('[data-choice-index]').forEach(el => {
            el.setAttribute('data-choice-index', newIndex);
        });
        const checkbox = child.querySelector('input[type="checkbox"]');
        const selector = child.querySelector('.romance-selector');
        if (checkbox) checkbox.id = `romance-${newIndex}`;
        if (selector) selector.id = `romance-selector-${newIndex}`;
    });

    updatePreview();
}

// Toggle romance
function toggleRomance(index) {
    const selector = document.getElementById(`romance-selector-${index}`);
    const checkbox = document.getElementById(`romance-${index}`);
    selector.style.display = checkbox.checked ? 'block' : 'none';
    updatePreview();
}

// Update preview
function updatePreview() {
    const speaker = document.getElementById('scene-speaker')?.value || '';
    const text = document.getElementById('scene-text')?.value || '';
    const background = document.getElementById('scene-background')?.value || '';

    document.getElementById('preview-speaker').textContent = speaker;
    document.getElementById('preview-text').textContent = text;

    if (background && availableImages.backgrounds.includes(background)) {
        document.getElementById('preview-bg').style.backgroundImage = `url('assets/backgrounds/${background}')`;
    } else {
        document.getElementById('preview-bg').style.backgroundImage = '';
    }

    // Preview choices
    const choicesContainer = document.getElementById('preview-choices');
    choicesContainer.innerHTML = '';

    const choiceElements = document.querySelectorAll('.choice-item');
    choiceElements.forEach((choiceEl, index) => {
        const textInput = choiceEl.querySelector('[data-field="text"]');
        const choiceText = textInput?.value || '';

        if (choiceText) {
            const choiceDiv = document.createElement('div');
            choiceDiv.className = 'preview-choice';

            const romanceCheckbox = choiceEl.querySelector(`#romance-${index}`);
            const isRomance = romanceCheckbox?.checked || false;

            choiceDiv.textContent = choiceText + (isRomance ? ' 💜' : '');
            choicesContainer.appendChild(choiceDiv);
        }
    });
}

// Get selected characters
function getSelectedCharacters() {
    const selected = [];
    document.querySelectorAll('.character-chip.selected').forEach(chip => {
        selected.push(chip.getAttribute('data-character'));
    });
    return selected;
}

// Get choices from form
function getChoicesFromForm() {
    const choices = [];
    const choiceElements = document.querySelectorAll('.choice-item');

    choiceElements.forEach((choiceEl, index) => {
        const text = choiceEl.querySelector('[data-field="text"]').value;
        const nextScene = choiceEl.querySelector('[data-field="nextScene"]').value;
        const romanceCheckbox = choiceEl.querySelector(`#romance-${index}`);
        const romanceSelect = choiceEl.querySelector('[data-field="romance"]');

        if (text && nextScene) {
            const choice = {
                text: text,
                nextScene: nextScene,
                romance: (romanceCheckbox?.checked && romanceSelect?.value) ? romanceSelect.value : null
            };
            choices.push(choice);
        }
    });

    return choices;
}

// Save scene
async function saveScene(isNew) {
    const sceneId = document.getElementById('scene-id').value.trim();
    const speaker = document.getElementById('scene-speaker').value;
    const text = document.getElementById('scene-text').value.trim();
    const background = document.getElementById('scene-background').value;
    const characters = getSelectedCharacters();
    const choices = getChoicesFromForm();

    // Validation
    if (!sceneId) {
        alert('❌ Scene ID is required!');
        return;
    }

    if (!text) {
        alert('❌ Scene text is required!');
        return;
    }

    if (isNew && scenes[sceneId]) {
        alert('❌ Scene ID already exists! Choose a different ID.');
        return;
    }

    // Create scene object
    const scene = {
        id: sceneId,
        background: background,
        characters: characters,
        speaker: speaker,
        text: text,
        choices: choices
    };

    // Add/update scene
    if (!isNew && currentEditingScene && currentEditingScene !== sceneId) {
        // Renaming not allowed
        alert('❌ Cannot rename scene ID. Delete and create new instead.');
        return;
    }

    scenes[sceneId] = scene;

    // Generate markdown
    const markdown = generateMarkdown();

    // Save to file (trigger download)
    downloadFile('main-story.md', markdown);

    alert(`✅ Scene "${sceneId}" saved! Download the file and replace story/main-story.md`);

    // Refresh scene list and flow
    renderSceneList();
    renderStoryFlow();
    switchTab('scenes');
}

// Delete scene
function deleteScene() {
    if (!currentEditingScene) return;

    if (!confirm(`Are you sure you want to delete scene "${currentEditingScene}"?`)) {
        return;
    }

    delete scenes[currentEditingScene];

    const markdown = generateMarkdown();
    downloadFile('main-story.md', markdown);

    alert(`✅ Scene "${currentEditingScene}" deleted! Download the file and replace story/main-story.md`);

    renderSceneList();
    renderStoryFlow();
    switchTab('scenes');
}

// Duplicate scene
function duplicateScene() {
    const scene = scenes[currentEditingScene];
    const newScene = JSON.parse(JSON.stringify(scene));
    newScene.id = scene.id + '_copy';

    currentEditingScene = null;
    renderEditForm(newScene, true);
}

// Generate markdown from scenes
function generateMarkdown() {
    let markdown = '';

    Object.values(scenes).forEach(scene => {
        markdown += '---scene---\n';
        markdown += `id: ${scene.id}\n`;
        markdown += `background: ${scene.background}\n`;
        markdown += `characters: ${scene.characters.join(', ')}\n`;
        markdown += `speaker: ${scene.speaker}\n`;
        markdown += '\n';
        markdown += scene.text + '\n';
        markdown += '\n';

        scene.choices.forEach(choice => {
            const romancePart = choice.romance ? `, +romance_${choice.romance}` : '';
            markdown += `→ "${choice.text}" (${choice.nextScene}${romancePart})\n`;
        });

        markdown += '\n';
    });

    return markdown;
}

// Download file
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Export story
function exportStory() {
    const markdown = generateMarkdown();
    downloadFile('main-story.md', markdown);
    alert('✅ Story exported! Save this file as a backup.');
}

// Import story
function importStory() {
    const fileInput = document.getElementById('import-file');
    const file = fileInput.files[0];

    if (!file) {
        alert('❌ Please select a file first!');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        scenes = parseMarkdownStory(content);
        renderSceneList();
        renderStoryFlow();
        alert('✅ Story imported! You now have ' + Object.keys(scenes).length + ' scenes.');
    };
    reader.readAsText(file);
}

// Load story manually (for when auto-load fails)
function loadStoryManually(input) {
    const file = input.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        scenes = parseMarkdownStory(content);
        console.log('✅ Manually loaded scenes:', Object.keys(scenes));
        renderSceneList();

        // Hide welcome info after successful load
        const welcomeInfo = document.getElementById('welcome-info');
        if (welcomeInfo && Object.keys(scenes).length > 0) {
            welcomeInfo.style.display = 'none';
        }

        if (Object.keys(scenes).length > 0) {
            // Render flow diagram
            renderStoryFlow();

            const sceneList = Object.keys(scenes).join(', ');
            alert(`✅ Story loaded!\n\nFound ${Object.keys(scenes).length} scenes:\n${sceneList.substring(0, 200)}${sceneList.length > 200 ? '...' : ''}`);
        } else {
            alert('⚠️ No scenes found in file. The file might be empty or incorrectly formatted.');
        }
    };
    reader.onerror = () => {
        alert('❌ Error reading file!');
    };
    reader.readAsText(file);
}

// Check available images
async function checkAvailableImages() {
    // This is a mock - in real implementation, you'd need a server to list files
    // For now, we'll just check common filenames
    availableImages.backgrounds = [];
    availableImages.characters = [];

    // Try to load common character sprites
    for (const member of BTS_MEMBERS) {
        const exists = await imageExists(`assets/characters/${member}.png`);
        if (exists) {
            availableImages.characters.push(`${member}.png`);
        }
    }

    // Try common background names
    const commonBackgrounds = [
        'living_room.jpg', 'living_room.png',
        'kitchen.jpg', 'kitchen.png',
        'bedroom.jpg', 'bedroom.png',
        'street.jpg', 'street.png',
        'concert.jpg', 'concert.png'
    ];

    for (const bg of commonBackgrounds) {
        const exists = await imageExists(`assets/backgrounds/${bg}`);
        if (exists) {
            availableImages.backgrounds.push(bg);
        }
    }

    console.log('✅ Available images:', availableImages);
}

// Check if image exists
async function imageExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

// Check image exists helper
function checkImageExists(type, filename) {
    if (!filename) return '';

    const list = type === 'background' ? availableImages.backgrounds : availableImages.characters;
    const exists = list.includes(filename);

    if (exists) {
        return '<div class="image-status exists">✅ Image found</div>';
    } else {
        return '<div class="image-status missing">⚠️ Image missing (scene will still work)</div>';
    }
}

// Render image management
function renderImageManagement() {
    const bgContainer = document.getElementById('background-images');
    const charContainer = document.getElementById('character-images');

    if (availableImages.backgrounds.length === 0) {
        bgContainer.innerHTML = '<p style="color: #999;">No background images uploaded yet.</p>';
    } else {
        bgContainer.innerHTML = availableImages.backgrounds.map(bg =>
            `<div style="margin: 10px 0;">✅ ${bg}</div>`
        ).join('');
    }

    if (availableImages.characters.length === 0) {
        charContainer.innerHTML = '<p style="color: #999;">No character sprites uploaded yet. Upload them below!</p>';
    } else {
        charContainer.innerHTML = availableImages.characters.map(char =>
            `<div style="margin: 10px 0;">✅ ${char}</div>`
        ).join('');
    }

    // Add file upload handlers
    setupFileUpload('background-upload', 'backgrounds');
    setupFileUpload('character-upload', 'characters');
}

// Setup file upload
function setupFileUpload(inputId, type) {
    const input = document.getElementById(inputId);

    input.addEventListener('change', (e) => {
        const files = e.target.files;

        if (files.length === 0) return;

        alert(`⚠️ File upload requires a server.\n\nFor now, manually copy these files to:\n\nassets/${type}/\n\nThen refresh this page.`);

        // List files to copy
        const fileList = Array.from(files).map(f => f.name).join('\n');
        console.log('Files to upload:', fileList);
    });
}
