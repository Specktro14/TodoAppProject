interface CustomWindow {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
}

export {}

declare global {
  interface Window extends CustomWindow {}
}

document.addEventListener('DOMContentLoaded', function() {
  const timeDisplay = document.getElementById('timeDisplay');
  const dateDisplay = document.getElementById('dateDisplay');
  const timerDisplay = document.getElementById('timerDisplay');
  const startBtn = document.getElementById('startBtn');


  function displayTime() {
    let now = new Date();
    let hours : number = now.getHours();
    let minutes : number = now.getMinutes();
    let seconds : number = now.getSeconds();

    const hoursStr = hours < 10 ? `0${hours}` : hours.toString();
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
    const secondsStr = seconds < 10 ? `0${seconds}` : seconds.toString();

    if (timeDisplay) {
      timeDisplay.textContent = `${hoursStr}:${minutesStr}:${secondsStr}`;
    }
    if (dateDisplay){
    dateDisplay.textContent = now.toDateString();
    }
  }

  setInterval(displayTime, 1000);

  let timerInterval : number
  let isPaused = false;  
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  let secondsPassed : string = '00'
  let minutesPassed : string = '00'
  let hoursPassed : string = '00'

  function padWithZero(num : number) {
    return num < 10 ? `0${num}` : num.toString();
  }

  window.startTimer = () => {
    if(!isPaused) {
      seconds = 0;
      minutes = 0;
      hours = 0;
    }
    
    isPaused = false;

    timerInterval = setInterval(() => {
      seconds++;
      if (seconds === 60) {
        seconds = 0;
        minutes++
        minutesPassed = padWithZero(minutes);
        if (minutes === 60) {
          minutes = 0;
          hours++;
          hoursPassed = padWithZero(hours);
        }
      }
      
      secondsPassed = padWithZero(seconds);

      if (timerDisplay){
      timerDisplay.textContent = `${hoursPassed}:${minutesPassed}:${secondsPassed}`;
      timerDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
      }
      if (startBtn){
      startBtn.innerHTML = '<i class="fas fa-play"></i> Start'
      }
      console.log(seconds, minutes, hours);
    }, 1000)
  }
  
  window.pauseTimer = () => {
    isPaused = true;
    clearInterval(timerInterval);
    if (timerDisplay) {
      timerDisplay.style.backgroundColor = '#ffb950df';
    }
    if (startBtn) {
      startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    }
  }

  window.resetTimer = () => {
    clearInterval(timerInterval);
    isPaused = false;
    if (timerDisplay) {
    timerDisplay.textContent = '00:00:00';
    timerDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
    }
    if (startBtn) {
      startBtn.innerHTML = '<i class="fas fa-play"></i> Start';      
    }
  }
  
})