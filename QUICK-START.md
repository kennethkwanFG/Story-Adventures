# Quick Start Guide - BTS Story Adventures

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
- Use lowercase, underscores: `kitchen_morning`, `meet_jin`
- Cannot change later (delete & recreate instead)

**Speaker**
- Who is talking in this scene
- Options: BTS members, You (player), or blank (narrator)

**Scene Text** (Required)
- The story/dialogue content
- Use `{{PLAYER_NAME}}` to insert the player's name
- Example: "Welcome, {{PLAYER_NAME}}! I'm RM."

**Characters on Screen**
- Click BTS members to show them in this scene
- They appear as sprites over the background
- Can select 1-3 at a time (looks best)

**Background Image**
- Optional image for the scene location
- Shows dropdown of available images
- ⚠️ Missing = scene uses gradient background (still works!)

**Choices**
- Add multiple choices for branching paths
- Each choice needs:
  - **Text**: What the player sees ("Say hello", "Ask about music")
  - **Next Scene**: Which scene it goes to
  - **💜 Romance** (optional): Give points to a BTS member

### Tips

✅ **Start simple**: Create 3-5 connected scenes first
✅ **Preview often**: Click "Refresh Preview" to see how it looks
✅ **Test early**: Don't write 50 scenes before testing!
✅ **No images yet?** Scenes work without images - add art later

---

## 🖼️ Adding Images

### Where Images Go

**Character Sprites** → `assets/characters/`
- Named: `jin.png`, `suga.png`, `jhope.png`, `rm.png`, `jimin.png`, `v.png`, `jungkook.png`
- PNG with transparent background works best
- Portrait orientation (tall)

**Backgrounds** → `assets/backgrounds/`
- Any .jpg or .png filename
- Landscape orientation (wide)
- 1920x1080 or 1280x720 recommended

### How to Add Images

1. Save/download your images
2. Rename character images correctly (see above)
3. Copy files to the folders
4. Refresh `editor.html` - they'll appear in dropdowns!

**The editor shows:**
- ✅ Green = image exists, will appear in game
- ⚠️ Yellow = image missing, scene uses placeholder

---

## 🎮 Scene Flow Example

Let's build a simple story:

### Scene 1: `start`
- Text: "You hear a knock at your door..."
- Choices:
  - "Open the door" → goes to `meet_rm`
  - "Ignore it" → goes to `miss_them`

### Scene 2: `meet_rm`
- Speaker: RM
- Characters: `rm`
- Text: "Hi! I'm RM from BTS. Can we come in?"
- Choices:
  - "Of course!" → `invite_in` (💜 +romance_rm)
  - "Um, who?" → `confused`

### Scene 3: `invite_in`
- Characters: `rm`, `jin`, `jimin`
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
A: Yes! Edit `index.html`, find `value="Daisy"`, change it.

**Q: How do I add more BTS member options?**
A: They're all there: Jin, Suga, J-Hope, RM, Jimin, V, Jungkook

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

**Ready to create?** Open `editor.html` and start building your BTS adventure! 🎮💜
