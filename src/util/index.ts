import { customAlphabet } from 'nanoid';

const d: Date = new Date();
const day: number = d.getDate();
const month: number = d.getMonth();
const year: number = d.getFullYear();

const beforeDate = (timestamp: number, when: string): boolean => {
  let tmpDate = new Date();

  if (when === 'today') {
    return timestamp < tmpDate.getTime();
  } else if (when === 'tomorrow') {
    tmpDate.setDate(tmpDate.getDate() + 1);
    return timestamp < tmpDate.getTime();
  }

  return false;
}

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
  
  if (
    d.getDate() === day &&
    d.getMonth() === month &&
    d.getFullYear() === year
  ) {
    return d.toLocaleString('default', { hour: 'numeric', minute: 'numeric' });
  } else if (d.getFullYear() == year) {
    return d.toLocaleString('default', { month: 'short', day: 'numeric' });
  }

  return d.toLocaleString('default', { year: 'numeric' });
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
  beforeDate,
  clickOutside,
  getTimestamps,
  formatDate,
  formatForStopwatch,
  formatTime,
  nanoid
}