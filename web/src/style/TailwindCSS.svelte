<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  html {
    font-size: 16px;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: #707070 #dbdcdd;
  }

  .dark * {
    scrollbar-color: #a5a8a7 #343537;
  }

  *::-webkit-scrollbar {
    width: 12px;
  }

  *::-webkit-scrollbar-track {
    background: #dbdcdd;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #707070;
    border-radius: 20px;
    border: 3px solid #dbdcdd;
  }

  .dark *::-webkit-scrollbar-track {
    background: #343537;
  }

  .dark *::-webkit-scrollbar-thumb {
    background-color: #a5a8a7;
    border-radius: 20px;
    border: 3px solid #343537;
  }

  .link {
    @apply text-indigo-500 underline opacity-100;
  }
</style>