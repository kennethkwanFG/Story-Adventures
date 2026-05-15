# Assets Guide

## Adding Images

### Backgrounds (`backgrounds/` folder)

**What to add:**
- Room scenes (living room, kitchen, bedroom, etc.)
- Outdoor locations (street, park, concert venue)
- Any location where scenes take place

**Recommended specs:**
- Format: JPG or PNG
- Size: 1920x1080 (landscape ratio)
- Or: 1280x720 for smaller files
- Quality: Medium-high (don't need ultra-HD)

**How to use:**
```markdown
---scene---
background: living_room.jpg
```

### Character Sprites (`characters/` folder)

**What to add:**
- Individual portraits of BTS members
- Different expressions optional (happy, surprised, etc.)

**File naming:**
```
jin.png
suga.png
jhope.png
rm.png
jimin.png
v.png
jungkook.png
```

For different expressions:
```
jin-happy.png
jin-surprised.png
rm-serious.png
```

**Recommended specs:**
- Format: PNG (transparent background preferred)
- Orientation: Vertical/portrait
- Height: 600-800px
- Keep faces centered

**How to use:**
```markdown
---scene---
characters: rm, jimin
```

## Quick Start: Use Placeholders First!

Don't have art yet? No problem!

1. **No background** = automatic gradient background
2. **No character sprites** = story still works perfectly
3. Test your story flow first, add art later

## Where to Find Images

**Free resources:**
- Unsplash.com (backgrounds/rooms)
- Pexels.com (backgrounds)
- For BTS images: Search for promotional photos, fan art (respect copyright!)

**AI-generated:**
- Use AI art tools to create custom backgrounds
- Generate character sprites in your preferred style

## Tips

- Start with 1-2 backgrounds to test
- You can use the same background for multiple scenes
- Characters can be simple - even anime-style works
- Quality matters less than quantity when starting out
