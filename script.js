const AudioContext = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioContext();

// PIANO
document.querySelectorAll(".key").forEach(key => {
  key.addEventListener("click", () => {
    playTone(key.dataset.note);
  });
});

function playTone(freq) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  setTimeout(() => osc.stop(), 300);
}

// DRUMS
const drumSounds = {
  kick: 100,
  snare: 180,
  hihat: 400
};

document.querySelectorAll(".drum").forEach(btn => {
  btn.addEventListener("click", () => {
    playTone(drumSounds[btn.dataset.sound]);
  });
});

// VOICE RECORDING
let recorder, audioChunks = [];

navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = e => audioChunks.push(e.data);

  recorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: "audio/wav" });
    audioChunks = [];
    const url = URL.createObjectURL(blob);
    document.getElementById("playback").src = url;
  };
});

document.getElementById("record").onclick = () => recorder.start();
document.getElementById("stop").onclick = () => recorder.stop();
