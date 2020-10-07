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

const formatDate = (timestamp: number): string => {
  d.setTime(timestamp);
  
  if (d.getFullYear() == currentYear) {
    return d.toLocaleString('en', { month: 'short', day: 'numeric' });
  }

  return d.toLocaleString('en', { month: 'short', day: 'numeric', year: 'numeric' });
}

const nanoid = customAlphabet('2346789ABCDEFGHJKLMNPQRTUVWXYZabcdefghijkmnpqrtwxyz', 10);

export {
  clickOutside,
  formatDate,
  nanoid
}