window.addEventListener("DOMContentLoaded", () => {
  const VF = Vex.Flow;
  const sheetContainer = document.getElementById("sheetContainer");
  const generateBtn = document.getElementById("generateBtn");

  // All possible notes including accidentals
  const notes = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
    "Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"
  ];
  const octaves = [3, 4, 5]; // range for visibility

  // Initialize VexFlow staff
  function initVexflow() {
    sheetContainer.innerHTML = "";
    const renderer = new VF.Renderer(sheetContainer, VF.Renderer.Backends.SVG);
    renderer.resize(600, 200);
    const context = renderer.getContext();
    const stave = new VF.Stave(10, 40, 580);
    stave.addClef("treble").setContext(context).draw();
    return { context, stave };
  }

  // Convert note + accidental + octave to VexFlow format
  function toVexNote(note) {
    let letter = note[0].toLowerCase();
    let accidental = note.length === 2 && (note[1] === "#" || note[1] === "b") ? note[1] : "";
    let octave = octaves[Math.floor(Math.random() * octaves.length)];

    let key = letter + "/" + octave;
    const staveNote = new VF.StaveNote({ clef: "treble", keys: [key], duration: "q" });

    // Only add accidental if there is one
    if (accidental === "#") staveNote.addModifier(new VF.Accidental("#"), 0);
    if (accidental === "b") staveNote.addModifier(new VF.Accidental("b"), 0);


    return staveNote;
  }

  // Draw 4 random notes
  function drawRandomNotes() {
    const { context, stave } = initVexflow();

    const randomNotes = [];
    for (let i = 0; i < 4; i++) {
      const note = notes[Math.floor(Math.random() * notes.length)];
      randomNotes.push(toVexNote(note));
    }

    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(randomNotes);
    new VF.Formatter().joinVoices([voice]).format([voice], 500);
    voice.draw(context, stave);
  }

  // Event listener
  generateBtn.addEventListener("click", drawRandomNotes);

  // Draw first set on page load
  drawRandomNotes();
});
