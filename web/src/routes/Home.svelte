<script lang="ts">
</script>

<div class="w-full min-h-screen h-full bg-light-300 dark:bg-dark-300 text-light dark:text-dark py-2 px-4">
  <div class="flex mt-4 p-2">
    <div class="w-1/4 fixed pr-2">
      <h1 class="font-bold text-2xl mb-4">My Boards</h1>

      <div class="mb-8">
        <h4 class="flex items-center uppercase opacity-75 text-base font-semibold leading pl-2 mb-1">
          <span class="mr-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-star"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </span>
          Starred
        </h4>
        <ul>
          <a href="##" class="block flex hover:bg-light-200 dark:hover:bg-dark-200 p-2 rounded cursor-pointer font-bold">
            <div class="flex-none h-6 w-6 bg-blue-500 rounded mr-2"></div>
            <span class="truncate">Test Board #1</span>
          </a>
          <a href="##" class="block flex hover:bg-light-200 dark:hover:bg-dark-200 p-2 rounded cursor-pointer font-bold">
            <div class="flex-none h-6 w-6 bg-green-500 rounded mr-2"></div>
            <span class="truncate">Test Board #2</span>
          </a>
          <a href="##" class="block flex hover:bg-light-200 dark:hover:bg-dark-200 p-2 rounded cursor-pointer font-bold">
            <div class="flex-none h-6 w-6 bg-red-500 rounded mr-2"></div>
            <span class="truncate">Test Board #3</span>
          </a>
        </ul>
      </div>
      <div>
        <h4 class="flex items-center uppercase opacity-75 text-base font-semibold leading pl-2 mb-1">
          <span class="mr-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </span>
          Recently Viewed
        </h4>
        <ul>
          <a href="##" class="block flex hover:bg-light-200 dark:hover:bg-dark-200 p-2 rounded cursor-pointer font-bold">
            <div class="flex-none h-6 w-6 bg-blue-500 rounded mr-2"></div>
            <span class="truncate">Test Board #1</span>
          </a>
          <a href="##" class="block flex hover:bg-light-200 dark:hover:bg-dark-200 p-2 rounded cursor-pointer font-bold">
            <div class="flex-none h-6 w-6 bg-green-500 rounded mr-2"></div>
            <span class="truncate">Test Board #2</span>
          </a>
          <a href="##" class="block flex hover:bg-light-200 dark:hover:bg-dark-200 p-2 rounded cursor-pointer font-bold">
            <div class="flex-none h-6 w-6 bg-red-500 rounded mr-2"></div>
            <span class="truncate">Test Board #3</span>
          </a>
        </ul>
      </div>
    </div>
    <div class="w-3/4 h-full" style="margin-left: 25%">
      <ul class="flex flex-wrap w-full">
        <li class="p-2 w-60 h-32 opacity-50 hover:opacity-75 flex flex-col justify-center border border-dashed text-center text-white font-semibold text-xl rounded ml-3 mb-3 cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Create a board
        </li>
        </ul>
    </div>
  </div>
</div>