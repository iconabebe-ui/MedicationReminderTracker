// src/utils/audio.js
export const playReminderSound = () => {
  const audio = new Audio('/sounds/reminder.mp3');
  audio.volume = 0.6;
  
  // Browsers require a user gesture (like a click) before they allow audio.
  // This play() call is wrapped in a catch to prevent console errors if 
  // the user hasn't interacted with the dashboard yet.
  audio.play().catch(() => {
    console.log("Audio waiting for user interaction to unlock...");
  });
};