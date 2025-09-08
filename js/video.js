const video = document.getElementById('miniVideo');
const playPauseBtn = document.getElementById('playPause');
const rewindBtn = document.getElementById('rewind10');
const forwardBtn = document.getElementById('forward10');
const volumeSlider = document.getElementById('volumeSlider');

playPauseBtn.addEventListener('click', () => {
  if(video.paused) { video.play(); playPauseBtn.textContent = 'Pause'; }
  else { video.pause(); playPauseBtn.textContent = 'Play'; }
});

rewindBtn.addEventListener('click', () => { video.currentTime -= 10; });
forwardBtn.addEventListener('click', () => { video.currentTime += 10; });
volumeSlider.addEventListener('input', () => { video.volume = volumeSlider.value; });

// Autoplay fix
video.muted = true; 
video.play().catch(()=>{});
