# Quick Start Guide - Story Adventures

## 🎯 Your Workflow (3 Steps!)

### 1️⃣ Create Your Story
Open **editor.html** in your browser

- Click **"Create New Scene"**
- Fill in the form (no coding needed!)
- Click **"Save Scene"** → downloads `main-story.md`
- **Replace** `story/main-story.md` with the downloaded file

### 2️⃣ Validate (Catch Errors)
Open **validate.html**

- Click **"Run Validation"**
- Fix any ❌ errors
- ✅ All green? Ready to test!

### 3️⃣ Play Your Game
Open **index.html**

- Test your story
- See if choices work
- Check if it looks good

Then **repeat**: Edit → Validate → Test

---

## 📝 Using the Story Editor

### Understanding the Tabs

**📚 All Scenes**
- Grid view of all your scenes
- Shows connections: "→ Goes to: scene1, scene2"
- Click any card to edit

**🔀 Story Flow**
- **Visual flowchart** with arrows showing connections
- Green box = start scene
- Orange box = orphan scene (no incoming connections)
- Click any node to edit
- See the whole story structure at a glance!

**✏️ Edit Scene**
- Form for creating/editing scenes
- Appears when you click a scene

**🖼️ Manage Images**
- Upload backgrounds and character sprites
- See which images exist

**💾 Export Story**
- Download backups
- Import previous versions

### The Form Fields Explained

**Scene ID** (Required)
- Unique name for this scene
- Use lowercase, underscores: `kitchen_morning`, `meet_alex`
- Cannot change later (delete & recreate instead)

**Speaker**
- Who is talking in this scene
- Options: Character names, You (player), or blank (narrator)

**Scene Text** (Required)
- The story/dialogue content
- Use `{{PLAYER_NAME}}` to insert the player's name
- Example: "Welcome, {{PLAYER_NAME}}! I'm Alex."

**Characters on Screen**
- Click characters to show them in this scene
- They appear as sprites over the background
- Can select 1-3 at a time (looks best)

**Background Image**
- Type the filename for the scene location
- Example: `kitchen.jpg`, `bedroom.png`
- ⚠️ Blank = scene uses gradient background (still works!)

**Choices**
- Add multiple choices for branching paths
- Each choice needs:
  - **Text**: What the player sees ("Say hello", "Ask a question")
  - **Next Scene**: Which scene it goes to
  - **💜 Romance** (optional): Give points to a character

### Tips

✅ **Start simple**: Create 3-5 connected scenes first
✅ **Preview often**: Click "Refresh Preview" to see how it looks
✅ **Test early**: Don't write 50 scenes before testing!
✅ **No images yet?** Scenes work without images - add art later

---

## 🖼️ Adding Images

### Where Images Go

**Character Sprites** → `assets/characters/`
- Named: `charactername.png` (e.g., `alex.png`, `sam.png`, `jordan.png`)
- PNG with transparent background works best
- Portrait orientation (tall)

**Backgrounds** → `assets/backgrounds/`
- Any .jpg or .png filename
- Landscape orientation (wide)
- 1920x1080 or 1280x720 recommended

### How to Add Images

1. Save/download your images
2. Name character images to match your character IDs
3. Copy files to the folders
4. Type the filename in the scene editor when creating scenes

**Supported formats:**
- ✅ JPG, PNG, GIF, WebP
- ❌ HEIC does NOT work (convert to JPG/PNG first)

---

## 🎮 Scene Flow Example

Let's build a simple story:

### Scene 1: `start`
- Text: "You hear a knock at your door..."
- Choices:
  - "Open the door" → goes to `meet_visitor`
  - "Ignore it" → goes to `miss_them`

### Scene 2: `meet_visitor`
- Speaker: Alex
- Characters: `alex`
- Text: "Hi! I'm Alex. Can I come in?"
- Choices:
  - "Of course!" → `invite_in` (💜 +romance_alex)
  - "Um, who?" → `confused`

### Scene 3: `invite_in`
- Characters: `alex`, `sam`, `jordan`
- Text: "They walk in, looking around..."
- Choices continue...

---

## ⚡ Common Questions

**Q: Can I edit existing scenes?**
A: Yes! Click any scene card in "All Scenes" tab to edit it.

**Q: How do I delete a scene?**
A: Edit it, then click "Delete Scene" button at bottom.

**Q: Can I copy a scene as a template?**
A: Yes! Edit it, click "Duplicate" button.

**Q: What if I mess up?**
A: Use "Export Story" tab to download backups often!

**Q: Do I need all images before testing?**
A: No! Scenes work without images. Add art when ready.

**Q: Can I change the player's default name?**
A: Yes! Edit `index.html`, find the `value=""` attribute in the name input field and change it.

**Q: How do I add more characters?**
A: Add their sprite images to `assets/characters/` and reference them by filename in your scenes.

---

## 🚨 Troubleshooting

**Editor won't load scenes**
- Make sure `story/main-story.md` exists
- Check browser console (F12) for errors

**Images won't show in editor**
- Refresh the page
- Check files are in correct folders
- Check filenames match exactly (case-sensitive!)

**Game won't start / button doesn't work**
- Run `validate.html` to catch errors
- Check browser console (F12)
- Common issue: quote syntax errors in text

**Can't save changes**
- Editor downloads a new file - you must replace the old one
- Windows: drag downloaded file into `story/` folder

---

## 💡 Pro Tips

1. **Write first, art later**: Get the story working with no images, add art when ready

2. **Use meaningful scene IDs**: `kitchen_morning` not `scene_7`

3. **Preview often**: Catch mistakes before saving

4. **Backup your work**: Use "Export Story" tab regularly

5. **Test on mobile early**: Open `index.html` on your iPhone to see how it looks

6. **Start small**: 10-20 scenes for your first story, expand later

7. **Romance builds over time**: Don't give too many romance points in one scene - spread them out!

---

**Need help?** Check the full README.md or run `validate.html` to catch common errors.

**Ready to create?** Open `editor.html` and start building your interactive story! 🎮
