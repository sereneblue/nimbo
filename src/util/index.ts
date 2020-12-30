import { customAlphabet } from 'nanoid';

let d: Date = new Date();
let currentYear: number = new Date().getFullYear();

const clickOutside = (node: Node, closeAction: Function): object => {
  const handleClick = (event: Event) => {
    let path = event.composedPath();

    if (!path.includes(node)) {
      closeAction();
    }
  };

  setTimeout(() => {
    document.addEventListener("click", handleClick);
  }, 10);

  return {
    destroy() {
      document.removeEventListener("click", handleClick);
    },
  };
};

const getTimestamps = (d: Date): object => {
  let tmp: Date = new Date(d);
  let timestamps: any = {};

  tmp.setDate(d.getDate() + 1);
  timestamps.tomorrow = tmp.getTime();

  tmp.setDate(d.getDate() + 7);
  timestamps.week = tmp.getTime();

  tmp.setDate(d.getDate() + 30);
  timestamps.month = tmp.getTime();

  return timestamps;
}

const formatDate = (timestamp: number): string => {
  d.setTime(timestamp);
  
  if (d.getFullYear() == currentYear) {
    return d.toLocaleString('en', { month: 'short', day: 'numeric' });
  }

  return d.toLocaleString('en', { month: 'short', day: 'numeric', year: 'numeric' });
}

const formatForStopwatch = (seconds: number): string => {
  let hours   = Math.floor(seconds / 3600)
  let minutes = Math.floor(seconds / 60) % 60
  seconds = seconds % 60

  return [hours,minutes,seconds]
    .map(v => v < 10 ? "0" + v : v)
    .filter((v,i) => v !== "00" || i > 0)
    .join(":")
}

const formatTime = (seconds: number): string => {
  let t: string = "";

  let hrs: number = Math.floor(seconds / 3600);
  let min: number = Math.floor((seconds % 3600) / 60);
  let sec: number = seconds % 60;

  if (hrs) {
    t += `${hrs}h `;
  }

  if (min) {
    t += `${min}m `;
  }

  if (sec) {
    t += `${sec}s`;
  }

  return t;
}

const nanoid = customAlphabet('2346789ABCDEFGHJKLMNPQRTUVWXYZabcdefghijkmnpqrtwxyz', 10);

export {
  clickOutside,
  getTimestamps,
  formatDate,
  formatForStopwatch,
  formatTime,
  nanoid
}