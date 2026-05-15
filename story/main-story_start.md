---scene---
id: start
background: 
characters: 
speaker: 

It's a quiet Saturday afternoon. You're lounging on your couch, scrolling through your phone, when you hear a knock at the door.

This is strange - you weren't expecting anyone.

→ "Open the door" (door_open)
→ "Look through the peephole first" (peephole)

---scene---
id: peephole
background: 
characters: 
speaker: You

You cautiously approach the door and peek through the peephole.

Your heart nearly stops.

There are SEVEN people standing outside. And they look... impossibly familiar.

→ "Open the door immediately!" (door_open)

---scene---
id: door_open
background: 
characters: rm
speaker: RM

"Hi! I'm really sorry to bother you, but our tour bus broke down nearby and... well, this is going to sound crazy, but could we possibly use your phone?"

You stand there, frozen. It's actually them. BTS. At YOUR door.

→ "Of course! Please come in!" (invite_in, +romance_rm)
→ "Um... yes, one moment!" (calm_down)

---scene---
id: invite_in
background: 
characters: rm, jin
speaker: Jin

"Thank you so much! You're very kind."

The seven members file into your living room, looking around with genuine appreciation.

RM smiles warmly at you. "I'm RM, by the way. But I guess you already know that?"

→ "I'm {{PLAYER_NAME}}. And yes, I'm a huge fan!" (fan_reveal, +romance_rm)
→ "Try to play it cool: Nice to meet you all." (play_cool)

---scene---
id: calm_down
background: 
characters: jimin
speaker: Jimin

You take a deep breath, trying to process this surreal moment.

Jimin notices your nervousness and gives you the sweetest smile.

"We know this is unexpected. Take your time. We're just grateful you answered the door."

→ "Please, come in! I'm {{PLAYER_NAME}}." (invite_in, +romance_jimin)
→ "Nod and gesture them inside silently" (invite_in)

---scene---
id: fan_reveal
background: 
characters: rm, jungkook, v
speaker: Jungkook

Jungkook's eyes light up. "Really? That's so cool!"

V leans forward with curiosity. "What's your favorite song?"

The atmosphere relaxes immediately. They seem genuinely happy to meet a fan.

→ "Dynamite! It always makes me smile." (continue_story, +romance_jungkook)
→ "Spring Day - the lyrics are beautiful." (continue_story, +romance_v)

---scene---
id: play_cool
background: 
characters: suga, jhope
speaker: Suga

Suga smirks slightly, as if he can see right through your 'cool' act.

"You're handling this really well," he says with amusement.

J-Hope laughs. "Better than most people! Usually there's more screaming."

→ "Laugh: I'm screaming on the inside, trust me." (continue_story, +romance_jhope)
→ "Smile at Suga: Just trying not to freak out." (continue_story, +romance_suga)

---scene---
id: continue_story
background: 
characters: rm
speaker: RM

"So about that phone..." RM says, pulling out his own phone with a sheepish grin. "Actually, I'm kidding. The bus is getting fixed right now."

Jin elbows him. "RM! You said we needed help!"

"Well... we kind of wanted an excuse to meet locals. Tour life can be lonely."

--- TO BE CONTINUED ---

This is the end of the demo! Add more scenes below using the same format.

→ "Restart Story" (start)
