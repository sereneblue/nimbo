import { customAlphabet } from 'nanoid';

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

const nanoid = customAlphabet('2346789ABCDEFGHJKLMNPQRTUVWXYZabcdefghijkmnpqrtwxyz', 10);

export {
  clickOutside,
  nanoid
}