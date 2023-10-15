/// <reference lib="webworker" />
let gameSpeedMultiplier: number = 1;

let everySecondInterval: number;
let everyTenSecondsInterval: number;
let everyMinuteInterval: number;

function setIntervals(): void {
  clearInterval(everySecondInterval);
  clearInterval(everyTenSecondsInterval);
  clearInterval(everyMinuteInterval);

  everySecondInterval = <number><any>setInterval(() => {
    // Every-second tasks
    postMessage({ type: 'UPDATE_GAME_WORLD', payload: {/* your updated data */ } });
  }, 1000 / gameSpeedMultiplier);

  everyTenSecondsInterval = <number><any>setInterval(() => {
    // Every-10-second tasks
  }, 10000 / gameSpeedMultiplier);

  everyMinuteInterval = <number><any>setInterval(() => {
    // Every-minute tasks
  }, 60000 / gameSpeedMultiplier);
}

// Initial setting of intervals.
setIntervals();

self.onmessage = (event: MessageEvent) => {
  console.log('Message received from main thread', event.data);
  switch (event.data.type) {
    case 'SET_SPEED':
      gameSpeedMultiplier = event.data.multiplier;
      setIntervals();
      break;
    case 'UPDATE_STATE':
      // Handle state updates sent from the main thread
      break;
    // Handle other types of messages here
  }
};