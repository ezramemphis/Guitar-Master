# Guitar Master - The Whole Process

So just to start off, I will say that I really should have just taken little notes and logs of what I did each day, so that it wouldn't be so much recap work that I'm doing right now trying to put together the whole README once the project is mostly done. But for the most part I'll be able to walk back through each step of how this project was put together, the difficulties at each step, and onwards. So anyways, let's get into it. 

# Exercises

## Exercises - HTML

So the very first thing that I wanted to start on were the actual exercises themselves, since these were sort of the most important part of the project. I want to make sure that we can atleast get this functioning.

I started with the simplest thing which is just laying out the html file for the scale exercise itself. I just wanted to lay out all of the containers that I would need to build out the whole thing once I add in the CSS and Javascript. My main layout for every single exercise that I repeated over and over pretty much went as follows:

LAYOUT:

Exercise-container (main container):
- scale-output (where the generated scales will go)
- controls
-   Generate Button (click to generate scale)
-   Auto Controls (Toggles auto-mode)
-   Timer Circle (still inside the controls area for aesthetics)

Metronome-container (Metronome to the side)
- metronome-controls
- button to toggle metronome

Extra:
- Tab button to bring up sheet music
- Sheet-container (containers sheet music when generated)
- Toggle-rainbow button (was bored and wanted the border around the exercise container to do a rainbow)

I pretty much copied this exact layout for every other exercise, making slight tweaks for wording like at the top of the exerice-container when it says what level it is, but other than that it's identical. 

## Exercises - Javascript     

I will say at the point that I started the javascript, I did already work on the CSS a bit for the exercises, but the last thing I ended up touching up was the CSS so I decided to walk through this first. This was definitely one of the longest and most frustrating parts of the project to get through, because I was basically taking the very limited knowledge and experience I've had with arrays, and putting it onto a massive scale from what I've ever attempted to do. 

The initial setup for how I wanted to lay out the javascript was pretty simple. I started by just putting in all of the notes an individual constants so that I could call them. And I made sure to include enharmonics so that I could differentiate that down the road to make the scales really accurate. 

```Javascript
const ENHARMONICS = [
  ["C"], ["C#", "Db"], ["D"], ["D#", "Eb"], ["E", "Fb"], ["F", "E#"],
  ["F#", "Gb"], ["G"], ["G#", "Ab"], ["A"], ["A#", "Bb"], ["B", "Cb"]
];
```
Then I set up the intervals for the scales. This was so that when I called any of the scales, they would have the proper intervals in order to be occampanied by the notes in the scale (given the root of the scale). 

```Javascript
// Modes Level 1
const MODE_INTERVALS = {
  "Ionian": [2,2,1,2,2,2,1], // The first interval is the distance to the 2nd degree (C -> D = 2 semitones)
  "Dorian": [2,1,2,2,2,1,2],
  "Phrygian": [1,2,2,2,1,2,2], // Phrygian has a flat 2, hence only 1 semitone to the 2nd degree (C -> Db = 1 semitone)
  "Lydian": [2,2,2,1,2,2,1],
  "Mixolydian": [2,2,1,2,2,1,2],
  "Aeolian": [2,1,2,2,1,2,2],
  "Locrian": [1,2,2,1,2,2,2],
}
```
Now of course, I needed to make sure to also create constants of all the scales (between all the levels) so that was the next thing that I added. 

```Javascript
const LEVEL_SCALES = {
  1: ["Ionian","Dorian","Phrygian","Lydian","Mixolydian","Aeolian","Locrian"],
  2: ["Melodic Minor","Dorian b2","Lydian Augmented","Lydian b7","Mixolydian b6","Aeolian b5","Altered"],
  3: ["Harmonic Minor","Locrian natural 6","Ionian #5","Dorian #4","Phrygian Major","Lydian #2","Altered dim 7"],
  4: ["Harmonic Major","Dorian b5","Phrygian b4","Lydian diminished","Mixolydian b2","Lydian Augmented #2","Locrian dim 7"]
};
```

Alright so I would say this is really the main setup, now we have all the notes, scales, and their intervals in how they're constructed. So now we need to make the code that randomly generates all of these. And then more importantly figures out the notes that are in each scale. (This was a very fun task)

So I started by just getting the scale randomization function working. And since I was using one javascript for all 4 scale exercises, I had to add in a little more detail to make sure it can give you the proper scales based on the level. And this is what that code looks like. 

```Javascript
// Scale Randomization Function
function randomScale(level = currentLevel) {
  const modePool = LEVEL_SCALES[level] || LEVEL_SCALES[1];
  const mode = modePool[Math.floor(Math.random() * modePool.length)];
  const rootGroup = ENHARMONICS[Math.floor(Math.random() * ENHARMONICS.length)];
  const root = rootGroup[Math.floor(Math.random() * rootGroup.length)];
  const scale = generateScale(root, mode);
  return { name: `${root} ${mode}`, notes: scale.join(" - ") };
}
```

And now that this is setup, that pretty much got it working to a certain degree. Just needed to make sure that everything in the HTML is linked and looks right, but now we just get this button to run it and we're good to go. 

`<button id="generate-btn" class="main-btn">🎵 Generate Scale</button>`
```Javascript
genBtn.addEventListener("click", () => {
  const data = randomScale();
  output.innerHTML = `<strong>${data.name}</strong><br>${data.notes}`;
});
```

And now at this point, the exercise was officially functional. When we would press the generate button, we would see a scale generate and the notes that are in that scale. There ar e

#### Troubleshooting Enharmonic Issues - Exercises Javascript 

What I ended up doing first to get a little more control was to go back to the top of the scales javascript and add in another constant for just letters themselves 

`const LETTERS = ["C","D","E","F","G","A","B"];`

I knew that if I wanted to somehow get this code to behave, I was going to have to be very explicit about how I ask for things to make sure it will always work.

As I started making more and more tweaks, I started doing some run through and check the scale outputs to see if there's any improvemenet, what percentage are still going wrong, and if so what is tripping them up. I noticed over time certain enharmonics like Cb and Fb were no longer an issue thankfully, but it was double flats and sharps that were absolutely tripping them up. So I'll deal with that in a second, but first we could help deal with this problem quite a bit by just putting some restrictions of what scales the code can generate. 

One of the best examples of what I mean, there was an instance where it generated the scale "D# Ionian". Now of course, this scale sucks because there's 9 sharps, everything is sharp and 2 double sharps of course. But the thing is this scale is simply the enharmonic of Eb Ionian, which is a much easier scale that my code was already able to do correctly. And the thing is you're never going to be asked for D# Ionian in a jury, unless they have some sort of vindetta against you. So I made sure in the javascript to add in some restrictions for the scales selected, so that it was always the "preferred" scale and didn't seep into territories where you're in double sharp or flat madness. And I decided to put in the scale restrictions with pretty firm manual language since it's pretty strict and will never be broken. There won't be a single instance I want a G# major scale, it will always be Ab. 

I entered in some hard restrictions for what notes can be used as the root of the scale, and thankfully it worked with no issues. 

```Javascript
// Only allow certain roots for "clean" spellings (avoiding excessive sharps/flats)
const ALLOWED_ROOTS = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];

function randomScale(level = currentLevel) {
  const modePool = LEVEL_SCALES[level] || LEVEL_SCALES[1];
  const mode = modePool[Math.floor(Math.random() * modePool.length)];

  // pick a root from allowed roots only
  const rootGroup = ENHARMONICS.filter(group => group.some(n => ALLOWED_ROOTS.includes(n)));
  const rootGroupChoice = rootGroup[Math.floor(Math.random() * rootGroup.length)];

  // pick the first note in group that is allowed
  const root = rootGroupChoice.find(n => ALLOWED_ROOTS.includes(n));

  const scale = generateScale(root, mode);
  return { name: `${root} ${mode}`, notes: scale.join(" - ") };
}
```
And honestly, this fixed up so many of the issues that I had since now all the roots for the scales have decent key signatures. I did still have to deal with the double flat and sharp situation. I knew that I needed to implement them, but I wanted to make sure it identified where a double flat or sharp would appropriately be. It basically just took a ton of troubleshooting, and you can see my javascript is sort of a graveyard of attempts, which little by little fixed the problem. There are still little instances where it sometimes doesnt work, but I would say the percentage of the scales that are outputted do have the proper notes with them. And lowkey the most important thing about the generator is just giving you the scale, you shouldn't need the notes given to you to be able to play it. It's just a nice thing I wanted to add to the generator. 

So anyways I would wrap it up there, that's pretty much it for how I made the scales.js. So now lets see how I copied that logic for the chords and arpeggios.

#### Implementing for chords and arpeggios  

I will be honest, this portion was pretty simple. Took a while to switch out the logic and knowledge, but for the most part this was a pretty smooth process. All of the functionality with generating, notes, the CSS, everything was already setup.  Just a pretty boring process that I just had to pop on some Netflix and get at it, but thankfully this process didn't take too long.

Also something that's funny that I realized as I worked on these exercises, you get the exact same chords and arpeggios from levels 1 + 2 to 3 + 4. The only difference is that you have to know 2 voices for each chords in Levels 3 + 4 instead of just one. Now I never ended up implementing anything solid to differentiate the experiences of the two level sets, but I just put in the little descriptions of the exercises up top that little detail in case the user wanted to know the difference. 

For now I think this is good. I'm in and out of these notes, but things are getting a little busy now.

#### Implementing VexFlow

So sadly I must report, I tried to implement the VexFlow but it was a little too hard and I couldn't figure it out. The issue is that the logic that I used to make the scales, chords, and arpeggios was one thing, but the way that Vexflow takes information to create notes and everything is also different. I'm not sure if there's a way for me to somehow make a type of translator to get it all to work, but I'm not sure. My plate just got completely filled and I wasn't able to get this working sadly. But the core functionality of the exercise is there. 


## Exercises CSS

So last but not least, it's worth mentioning the CSS that went into making the exercises look like they do. I started with a pretty dark blue and grey theme, but I realized that it didn't have a lot of depth. I wanted the main exercise container and metronome container to both feel like they were coming above everything else on the window. 

The first and most obvious thing that I did in order to be able to add that depth was by adding a drop shadow to both containers. For the main exercises container it's a dark shadow, where as for the metronome container it's more like a soft light glow. I did this because the metronome container I made pretty transparent and blurred, and so with a nice light border and glow, it just looks like a clean glass panel. And to add a little more depth, I made the background an image of a metal sort of wall. And using sort of the same logic as we did with the tiling before, I made some tiles with that texture to create a repeating pattern for the back wall, and I created a little animation where the wall pushes in and out in time intervals, pretty subtly but just to add a little more depth.

I was thinking of adding a little more particles and little things to add even a tiny bit more depth, but honestly I don't want to overwhelm the user or overdue the design. Sometimes it's better to keep it on the simpler side, and just let the software speak for itself in its performance.

With the rest of the things inside of the containers, I just went with a general theme and made them look nice. 

One of the more fun things that I'd love to discuss about what made the CSS fun was the rainbow toggle button. The reason why I got this idea, I created a nice animated gradient border for the main exercise container, so that it just kind of had a glowing blue border effect. And I was thinking as I did it, "Is there a way I could as this animation cycled through, doing it's sort of glowy thing, could I have another animation going at the same time shifting its hue to make it do a full rainbow." And surely enough, this was possible to do, and honestly not that hard. 

```CSS
@keyframes hueCycle {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}
```

So with this setup, now I was able to call it here.

```CSS
.exercise-container.rainbow::before {
  animation: 
    borderShift 14s linear infinite, 
    hueCycle 10s linear infinite;
}
```

So basically, that ::before part is creating a “layer” in front of the exercise container that we can style separately without touching the actual content. Here, we’re using it to run the borderShift and hueCycle animations so the border smoothly moves and cycles through rainbow colors.

Anyways, so all that was left was to put in the proper Javascript in order to make sure that this properly links with our Rainbow Toggle button, and makes it turn on and off. And this was the code for that.

```Javascript
  // Rainbow Mode Toggle
  const toggleBtn = document.getElementById('toggleRainbow');
  const exerciseContainer = document.querySelector('.exercise-container');
  if(toggleBtn && exerciseContainer) {
    toggleBtn.classList.add('off');
    toggleBtn.addEventListener('click', () => {
      exerciseContainer.classList.toggle('rainbow');
      const isOn = exerciseContainer.classList.contains('rainbow');
      toggleBtn.classList.toggle('on', isOn);
      toggleBtn.classList.toggle('off', !isOn);
    });
  }
```
Now using the toggleRainbow button that we put into our HTML, we can toggle the CSS with Javascript to make a rainbow border go around the border. 

Lastly a little fun thing that I loved, I learned how to edit the "perspective" of an object in CSS so that it looks like it's tilted in a certain way. I used this with my sheet container so that when it animates up into the window, it turns left slightly and looks pretty cool. This was all the code that went into that. 

```CSS
.sheet-container.open {
  transform: translateY(-250px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
  transform: perspective(700px) rotateX(0deg) rotateY(-6deg) translateY(-250px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
}
```
Now the last sort of thing for this CSS that was special is the progress wheel thing for the auto mode. Now I did use AI to help add that in, and although I have studied it now and understand the fundmentals of how it was done, I just ended up keeping the version that was done with AI. And it looks really nice, and with proper labeling it's very easy to edit how it looks. 

Anyways I would say this officially wraps up everything that went into doing the exercises, so now let's discuss everything that went into making the front page, exercise selection, the overall theme, and any special features that make this website shine like a diamond. 

# Front Page

### Index.html - The Structure

With this index, I started very very simple. I knew that there were 3 objects starting off that I wanted to have. A circle in the center when you open the page, that when you click slides to the left a bit, and then 2 panels come in from the right side and from the top. I mainly got this idea because I wanted it to feel like a video game, where you press the start button and it sends you into the selection window. 

Honestly the HTML was very simple because I did a lot of the heavily lifting with javascript and CSS. I mainly just used the HTML whenever I needed to add in a new div or container or something, but I was usually in and out to be honest. All of the cool stuff will be cover in CSS and Javascript.

### CSS - To Infinity and Beyond

So by this point, I now had finally decided the theme that I was going to go for. I wanted a sort of ambient, dark, liminal space theme, with a futuristic sort of pallet to make it look cool


Now I know this last thing is Javascript, but I'll put it in this section because it pretty much solely partains to the background of the front page. I learned about something called Three.js, which is really cool. It's a JavaScript library that makes it really easy to create 3D graphics in a browser. You can work with lights, cameras, objects, animations, and visual effects. You can go really really deep with this library as I've seen from various projects. 

With a combination of looking at a bunch of open-source projects, youtube tutorials, and some AI assistance, I was able to get some pretty cool themes. I have a whole collection of them in my themes folder, but my most developed and coolest looking theme is the stars.js file. And then easily enough with a little more code I was able to set that as a background theme, and it was good to go. And this is the inline script I used to call the stars.js to be the background of the website whenever I entered. I did have a theme selection menu I tried to setup, but it failed miserably and I haven't gotten it to work. But hopefully soon I can change that. 

```Javascript
  // Default theme on load
    window.addEventListener("DOMContentLoaded", () => {
      loadTheme("stars.js");
    });
```
```CSS
/* 3D canvas behind everything */
#bgCanvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* behind all UI */
}
```

Anyways, for some actual CSS now. I added a glassy/foggy sort of effect to both of the panels by messing with the opacity, alongside a few other fun parameters. 

```CSS
/* GLASS LAYER — glossy chaotic shimmer */
.panel-glass {
  position: absolute;
  inset: 0;
  background-color: rgba(75, 84, 93, 0.02); /* glassy transparency */
  opacity: 0.5; /* control glass opacity here */
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
}
```

Honestly looking back through the CSS, there is so much that can be mentioned it's overwhelming. And I want to make sure to catch the main big picture things because I know Rachel Rome can look at all the code more in depth on her own time. So I will just add in a few of my favorite things that I ended up figuring out in the CSS that were pretty significant, or just satisfying. 

This one will be a more satisfying one. With the way that I had the buttons set up with javascript instead of directly putting each button, I wanted a sleek way in order to design how they look in a pretty mathy way. And honestly I just wanted as much control over these buttons as I could, and so I put together this CSS so that it creates a nice tilted effect. 

And this fixed my problem that when I would hover over one button, they would move weirdly because another button was based off the first button, and the positions were all screwed up. And so it just really tied down everything to be correct. And by this point of the project, I just couldn't deal with things failing on me anymore, and this locked it down. 

```CSS
/* CASCADING BUTTON OFFSET */
.panel-btn:nth-child(1) { transform: translateX(0); }
.panel-btn:nth-child(2) { transform: translateX(-45px); }
.panel-btn:nth-child(3) { transform: translateX(-90px); }
.panel-btn:nth-child(4) { transform: translateX(-135px); }

/* HOVER EFFECTS */
.panel-btn:nth-child(1):hover { transform: translateX(0) scale(1.05); }
.panel-btn:nth-child(2):hover { transform: translateX(-45px) scale(1.05); }
.panel-btn:nth-child(3):hover { transform: translateX(-90px) scale(1.05); }
.panel-btn:nth-child(4):hover { transform: translateX(-135px) scale(1.05); }
```

Honestly one of my favorite things to design was the header panel. I really wanted to add a lot of depth,and so I really started experimenting with gradients, and the blur that I used before to create a real glossy and unique panel to go across the top. We can just take a little scan through it pasted below. And honestly a good bit of it might be a little redundant, but I don't want to accidentally ruin it so I'm just leaving it as is. 

```CSS
/* Header panel (top bar) */
.header-panel {
  position: absolute;
  top: -100px; /* hidden initially */
  left: 0;
  width: 100%;
  height: 13.6%; /* top 1/6 of screen */

  /* Deeper metallic gradient (less see-through) */
  background: linear-gradient(
    to bottom,
    rgba(10, 20, 40, 0.97) 0%,    /* deeper and richer navy */
    rgba(20, 40, 70, 0.95) 50%, 
    rgba(35, 70, 110, 0.92) 100%
  );

  /* Glossy top shine (stronger highlight band) */
  background-image:
    linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.06) 15%,
      rgba(255, 255, 255, 0) 40%
    );
  background-blend-mode: overlay;

  /* Stronger glass blur + more opacity */
  backdrop-filter: blur(20px) saturate(180%) brightness(1.1);
  -webkit-backdrop-filter: blur(20px) saturate(180%) brightness(1.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);

  /* Depth + subtle reflective shadow */
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.5),
    inset 0 3px 6px rgba(255, 255, 255, 0.15),
    inset 0 -3px 10px rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  transition: top 0.8s cubic-bezier(.6, .5, .1, .9);
}
```

Another little detail that I added which I really like was a sort of shining animation that goes over certain parts inside the header panel to add a shimmering effect in a way. I added it to both the title and the text-slider. And I think it just adds a little spice that I like. 

```CSS
/* Gothic Title with Metallic Shine */
.header-title {
  position: absolute;
  left: 8%; /* responsive offset from left edge */
  top: 50%;
  transform: translateY(-50%);
  font-family: 'UnifrakturMaguntia', cursive;
  font-size: 2.3rem;
  font-weight: bold;
  letter-spacing: 1px;

  /* Metallic base look */
  color: rgb(200, 200, 200);
  background: linear-gradient(
    120deg,
    #9a9a9a 0%,
    #cbcdce 30%,
    #a0a0a0 45%,
    #6f6f6f 60%,
    #b9babb 80%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  /* Shine animation */
  animation: shine 18s linear infinite;
}

/* Keyframes for moving shine */
@keyframes shine {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}
```
I think maybe the last thing that I'd want to bring up are the cute little social icon buttons that I have. I got a bunch of copyright free svg icons online for different social medias, and I created a button for each one that had a hyperlink going to my socials. I just made the button pretty subtle, dark grey and transparent with the black cutout on each one, but when you hover over it the background turns to a blue gradient that really makes the logo pop. This one was sort of an accidental discovery while just trying stuff out with the hover effects and boom. 

```CSS
/* Individual Icon Styles */
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  overflow: hidden;
}

/* Ensure SVG fits nicely inside the button */
.social-icon img {
  width: 70%;  /* scale down inside the button */
  height: 70%;
  object-fit: contain;
}

/* Hover Effect */
.social-icon:hover {
  background: linear-gradient(135deg, #00ffff, #0077ff);
  transform: scale(1.1) rotate(-2deg);
  box-shadow: 0 4px 16px rgba(0,200,255,0.5);
}
```

Ok I think that wraps up a majority of the big things that created what is the front page. There are a bunch of other fun things that I didn't mention, but the code is here for anyone to explore. Anyways let's move into the fun stuff that I was able to do with javascript to really tie this website together. 

### Javascript - Special Implementations & Features

So basically with all of the javascript on the front page, it was pretty much just all for fun and giggles at this point. The mission was pretty much complete, I just wanted to experiment and make this website cool now. So I decided the best way to organize this last bit would be to just have little sections for each cool thing I did with Javascript in this part. 

#### Music Player - Shuffle, Mute, Scrolling 

Everyone knows that any good video game is going to have background music. For now I'm just using a collection of my favorite liminal ambient tracks just to have a solid setlist going. I set up all of the songs as constants so that we can call and work with them, as shown below. 

```Javascript
// SONG DATA
const songs = [
  "music/All For Nothing - Zachariehs.mp3",
  "music/a way out - my head is empty.mp3",
  "music/Redemption Arc - Zachariehs.mp3",
  "music/the day when happiness faded away - .diedlonely.mp3",
  "music/does it ever get better? - Lonnex.mp3",
  "music/home - .diedlonely.mp3",
  "music/losing - Lonnex.mp3",
  "music/i think i love you - Money Flip.mp3",
  "music/Ethereal (Slowed) - Money Flip.mp3",
  "music/snowfall - Øneheart.mp3",
  "music/Gods creation - daniel.mp3.mp3",
  "music/green to blue (slowed  reverbed) - daniel.mp3.mp3",
  "music/3 am walk (Slowed & Reverb Version) - daniel.mp3.mp3",
  "music/stellar - .diedlonely.mp3",
  "music/keep your warmth - Antent.mp3",
  "music/Do Not Be Afraid - Zacharies.mp3",
  "music/i was only temporary - my head is empty.mp3",
  "music/falling back - vultu.mp3",
  "music/dark snowy night - daniel.mp3.mp3",
  "music/Fr3sh - Kareem Lotfy.mp3"
];
```

So pretty simple, it of course took a while to copy and paste every track title, make sure they're all going to the correct folder, make sure there's no typos, but eventually it was all setup properly. And I will check the console later of course to make sure there aren't any songs that can't be located, but that'll be easy enough.

Once that's all setup, now we just need to write a little code to do a few things. We want to randomly pick a song from the list above, create a new "audio object" with that song, set the volume, and of course plays the song. All of the code below is what I ended up going with in order to do this.  

```Javascript
// Audio Functions
function playRandomSong() {
  if (currentAudio) currentAudio.pause();

  const random = songs[Math.floor(Math.random() * songs.length)];
  currentAudio = new Audio(random);
  currentAudio.volume = isMuted ? 0 : 0.6;
  sliderText.textContent = random.split("/").pop().replace(".mp3", "");
  currentAudio.play();

  currentAudio.addEventListener("ended", playRandomSong);
  updateSlider();
}
```
Now let's focus on one line of this code that I didn't really mention before. 

`sliderText.textContent = random.split("/").pop().replace(".mp3", "");`

What is Ezra trying to cook here?

So basically there were a few other things that I wanted to implement alongside the songs playing to make it feel a little cooler. The first two things were just essentials, a mute and a shuffle button. Nothing really crazy with those, just pretty standard code. I did make sure to save mute status to the localStorage so that if you muted before, it will remember and keep you muted unless you choose other wise. 

But this "slider text" is the last thing I wanted to implement, a sliding text in a little window that shows whatever song is playing. And that code tells the HTML here to put in whatever song name is currently playing. 

```HTML
<div class="song-slider">
      <div class="slider-text" id="sliderText">No song playing</div>
    </div>
```

I labeled all of the mp3s and put everything in exactly as it is for this exact moment. When paired with this code, it creates just the nicest little sliding text animation that just adds the perfect little bit of depth that that space needed.

```Javascript
// Song progress and controls
function updateSlider() {
  if (!currentAudio || isPaused) return;

  const percent = (currentAudio.currentTime / currentAudio.duration) * 100;
  if (!isNaN(percent)) songProgress.value = percent;

  sliderText.style.transform = `translateX(${100 - percent * 2}%)`;
  requestAnimationFrame(updateSlider);
}
```

It's pretty subtle, but that little detail just is so nice, probably one of my favorite things that I was able to incorporate on the front page to really make it stand out. 


#### Mouse Tracking Vinyl Record

Eventually once I started getting deeper into designing the theme of the front page, I decided I wanted to try and implement a cool trick that I've seen on other websites in the past. Mouse tracking, where an object tilts and faces wherever your mouse is on a screen. I used some pretty solid video sources, and had AI help explain it to me a little bit too, but overall it wasn't too hard to grasp.

One thing that I didn't anticipate, since the object that I want to keytrack is animating to two different positions because of what I did before, there were going to be a whole lot of issues. Eventually I was able to whittle them all down until it finally cleanly animated like it did before while still being able to track my mouse like it's looking at it. One small detail is that once it's animated to the left position, it still mouse tracks as if it's viewing the mouse from the center, which might look a little off but for now it's good enough. And this extra level of depth just makes the website feel even more video game like and just more personal too. 

#### Practice Log

Now the practice log was just something that I had to incorporate. It's pretty simple, but it's just a journal that I added to the front page, so that when you practice daily, you can log whatever you did

I added a little idea of what a daily tracker for how much you practiced each exercise would look like. I tried to get it working, but I just can't figure out the javascript. So for now it's just a place holder. 

And then lastly, just to make the navigation a little nicer, I added a way to zoom out to the months so that you can quickly go through the months and as far back as you want incase it was a journal you took a while ago. Although I haven't gotten it to function where you press the button and it goes to the date, but once I figure that out everything already looks great and is ready to go. 

The next step for this practice log would be to somehow get a way for someone externally to added a comment/note to your journal for you, as like an external user. I added in a dummy comment to demonstrate what I would like it to look like, but it is sadly just not possibly unless I want to write a crap ton of backend, put it up on a server, and do a bunch of other fun stuff. I'm not that good at code yet lol. But I did add in that dummy model once again so you'll be able to see what the vision sort of was for the external comments from teachers and what that could look like. 

So that about wraps up everything when it comes to the general javascript for the front page. So now let's recap any last details of what really completed and tied together this website. 

# Last Details

### Organization - Exercises Folders

In the last bit of time that I used to really tie this project together, I decided to really focus on the organization of this project. I didn't want everything to just be laying around on the root, since I was getting so many files by this point. I had already started working on this earlier in the project by making little folders to hold things such as all of my assets, all of the music, and onwards. But I wanted to take it just a little bit farther so that it can look as tidy as possible.

The main thing that I wanted to do was organize all of my exercise htmls into one "exercises" folder, and then inside 4 subfolders for each different level exercise set. I started by just knocking the organization out of the way, and putting all of the htmls into their respective folders as I mentioned before. The issue now was deciding how I wanted to link all of those htmls to the original index.html again.

To make this system work smoothly, I used a bit of inline javascript to generate all of the buttons instead of hard-coding them one by one and doing it with the HTML like before. The idea was to somehow translate the folder structure I created to the javascript in a way it can understand it, so that each button knows exactly where its corresponding HTML file lives. 

I started by defining two arrays; one for the four different levels, and another for the three exercise categories. From there, I wrote a simple function that builds a button element and, if needed, attaches a click event that redirects the user to the correct exercise file. This eliminated the need for repetitive markup in the index.html and allowed the whole thing to stay flexible in case I ever change, rename, or add exercises later on.

The navigation works by first displaying a set of level buttons generated through the showLevelButtons() function. When the user clicks on one of these levels, the script calls showExerciseButtons(level), which clears the panel and builds a new set of buttons specific to that level. The key part is how each exercise button’s link is assembled: the script constructs the file path using a consistent naming format—exercises/levelX/levelX_exercise.html—so the browser always knows exactly where to go. A back button is also generated dynamically to return to the previous menu. Overall, this approach keeps the interface clean, and most importantly makes the whole project much easier to scale if I want to continue adding more exericses for performance majors, or other miscellanous projects. 

```Javascript
<!-- Panel Buttons Script -->
  <script>
    const panelButtonsContainer = document.getElementById("panelButtons");
    const levels = ["Level 1","Level 2","Level 3","Level 4"];
    const exercises = ["Chords","Scales","Arpeggios"];

    function createButton(text, href="#") {
      const btn = document.createElement("button");
      btn.classList.add("panel-btn");
      btn.textContent = text;
      if(href !== "#") btn.addEventListener("click", () => window.location.href = href);
      return btn;
    }

    function showLevelButtons() {
      panelButtonsContainer.innerHTML = "";
      levels.forEach((lvl, i) => {
        const btn = createButton(lvl);
        btn.addEventListener("click", () => showExerciseButtons(i+1));
        panelButtonsContainer.appendChild(btn);
      });
    }

    function showExerciseButtons(level) {
      panelButtonsContainer.innerHTML = "";
      exercises.forEach(ex => {
        const href = `exercises/level${level}/level${level}_${ex.toLowerCase()}.html`;
        panelButtonsContainer.appendChild(createButton(ex, href));
      });
      const backBtn = createButton("← Back");
      backBtn.addEventListener("click", showLevelButtons);
      panelButtonsContainer.appendChild(backBtn);
    }

    showLevelButtons();
  </script>
  ```

### Sources and Guides to Do This

Yea I lowk need to put the sources here, working on that, my bad