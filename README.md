# Story Adventures - Visual Novel Game

A choice-based interactive story game engine. Create branching narratives with character interactions and romance tracking.

## 🎮 How to Play

1. **Open the game**: Double-click `index.html` to open in your browser
2. **Mobile**: Works on iPhone/iOS - just open the file in Safari
3. **Enter your name**: Choose what the characters will call you
4. **Make choices**: Click/tap choices to progress the story
5. **Build romance**: Certain choices increase romance points with characters
6. **Save/Load**: Use the menu buttons to save your progress

## ✅ Validate Before Testing

**Before playing or testing**, run the validator to catch errors:

1. Open `validate.html` in your browser
2. Click **"Run Validation"**
3. Fix any ❌ errors shown
4. When you see ✅ **All Tests Passed**, you're ready!

**Run validator after:**
- Editing game.js or index.html
- Adding new story scenes
- If the game won't load

## 📝 How to Add Your Story

### ⭐ RECOMMENDED: Use the Visual Editor

**No coding needed!** Open `editor.html` in your browser for a visual story editor.

**Features:**
- ✏️ Create/edit/delete scenes with simple forms
- 🔀 **Visual story flow diagram** - see how scenes connect with arrows
- 👀 Preview scenes before saving
- 🖼️ See which images exist vs. missing
- 📋 Duplicate scenes as templates
- 💾 Export/import story files

**Workflow:**
1. Open `editor.html`
2. Click "Create New Scene" or click any scene to edit
3. Fill in the form (speaker, text, choices)
4. Click "Save" → it downloads `main-story.md`
5. Replace `story/main-story.md` with the downloaded file
6. Test in `index.html`!

### Advanced: Edit the Markdown File Directly

If you prefer text editing, open `story/main-story.md` and add scenes using this format:

```markdown
---scene---
id: scene_name
background: living_room.jpg
characters: alex, sam
speaker: Alex

Your dialogue text goes here. You can write multiple paragraphs.

Use {{PLAYER_NAME}} to insert the player's name.

→ "Choice 1 text" (next_scene_id)
→ "Choice 2 text with romance" (another_scene, +romance_sam)
```

### Scene Format Explained

- **id**: Unique name for this scene (use lowercase with underscores)
- **background**: Image filename from `assets/backgrounds/` (optional)
- **characters**: Which characters appear (comma-separated, optional)
  - Use character IDs matching your sprite filenames (e.g., `alex`, `sam`, `jordan`)
- **speaker**: Who is talking (appears in pink above dialogue)
- **Text**: The story/dialogue content
- **Choices**: Format: `→ "Text" (next_scene_id, +romance_character)`
  - Romance options: `+romance_alex`, `+romance_sam`, etc.

### Example Scene

```markdown
---scene---
id: kitchen_talk
background: kitchen.jpg
characters: alex, jordan
speaker: Alex

Alex opens your fridge and looks impressed. "Wow, you have good ingredients!"

Jordan peeks over their shoulder. "Think Alex could cook something for us, {{PLAYER_NAME}}?"

→ "I'd love that! What will you make?" (cooking_scene, +romance_alex)
→ "Let's order food instead - let's just talk!" (living_room_talk)
```

## 🎨 Adding Art

### Backgrounds
1. Add images to `assets/backgrounds/`
2. Reference in scene: `background: kitchen.jpg`
3. Recommended: 1920x1080 or similar landscape ratio

### Character Sprites
1. Add character images to `assets/characters/`
2. Name them by character ID: `alex.png`, `sam.png`, `jordan.png`, etc.
3. Recommended: PNG with transparent background, vertical portraits
4. Size: ~600-800px height works well

**Tip**: Start with placeholder images or solid colors to test your story first!

## 💜 Romance Tracking

- Romance points automatically track as players make choices
- Top 3 romances display in the top-right corner
- Use `+romance_charactername` in choice format to increase points
- Example: `→ "Smile at Sam" (next_scene, +romance_sam)`

## 💾 Save System

- **Save**: Stores current progress, romance points, and scene
- **Load**: Restores saved game
- **Auto-saves** to browser localStorage
- Each device has its own save file

## 📱 Mobile Support

Fully optimized for iOS devices (iPhone 13, iPhone 17, etc.):
- Touch-friendly buttons
- Responsive text sizing
- Proper viewport for mobile browsers
- No zoom issues

## 🔧 Technical Details

- **No build tools needed** - just HTML/CSS/JavaScript
- **No server required** - runs entirely in browser
- **Easy editing** - all story content in readable markdown
- **Instant preview** - edit story, refresh browser, see changes

## 📂 File Structure

```
Story-Adventures/
├── index.html          # Main game file (open this to play!)
├── editor.html         # ⭐ Visual story editor (use this to create scenes!)
├── editor.js           # Story editor logic
├── validate.html       # Validator (run before testing)
├── test.html           # Simple test page
├── styles.css          # Visual styling
├── game.js             # Game engine
├── story/
│   └── main-story.md   # Your story content
└── assets/
    ├── backgrounds/    # Background images
    └── characters/     # Character sprite images
```

## ✨ Tips for Writing

1. **Test as you go**: Add 2-3 scenes, then play them
2. **Keep choices meaningful**: Each choice should lead somewhere different
3. **Use {{PLAYER_NAME}}**: Makes the story feel personal
4. **Balance romance**: Don't favor one character too heavily (unless that's your story!)
5. **Scene IDs**: Use descriptive names like `kitchen_talk`, not `scene_7`

## 🚀 Quick Start Workflow

**Complete workflow from idea to playable game:**

1. **Open editor**: `editor.html`
2. **Create scenes**: Click "Create New Scene", fill form, save
3. **Download**: Editor gives you `main-story.md` file
4. **Replace**: Put downloaded file into `story/` folder
5. **Validate**: Open `validate.html`, click "Run Validation"
6. **Test**: Open `index.html` to play your story!
7. **Repeat**: Edit more scenes, add images, refine

**Adding images:**
1. Save character images as: `charactername.png` (matching your character IDs)
2. Put them in `assets/characters/`
3. Put backgrounds in `assets/backgrounds/`
4. Type the filename in the scene editor when creating scenes

---

**Have fun creating your interactive story adventure!** 🎮
