<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  
  import flatpickr from 'flatpickr';
  import 'flatpickr/dist/themes/dark.css';

  export let date: number;
  export let complete: boolean = false;

  let calendar: flatpickr;
  let bufferDate: number;
  let bufferComplete: boolean;
  let mounted: boolean = false;

  const dispatch = createEventDispatcher();

  const handleDateClear = (e: Event): void => {
    calendar.clear();
  }

  const handleDueComplete = (e: Event): void => {
    complete = !complete;
    dispatch("complete", complete);
  }

  const setCalendar = (date: number): void => {
    calendar = flatpickr("#flatpickr", {
      altInput: true,
      altFormat: "M j, Y @ h:S K",
      defaultDate: date,
      enableTime: true,
      minDate: !!date && date < new Date().getTime() ? date : "today",
      onChange(selectedDates: Date[], dateString: string, instance: any) {
        if (selectedDates.length) {
          dispatch("update", selectedDates[0].getTime());
        } else {
          dispatch("update", null);
        }
      }
    });
  }

  onMount(() => {
    setCalendar(date);

    mounted = true;
  });

  $: {
    if (mounted) {
      bufferDate = date;
      bufferComplete = complete;
      
      if (bufferDate) {
        setCalendar(bufferDate);
        calendar._input.disabled = bufferComplete;
      } else {
        if (calendar) calendar.clear();
      }
    }
  }
</script>

<style lang="postcss" global>
  .flatpickr-weekdays {
    @apply bg-indigo-500;
  }
  span.flatpickr-weekday {
    @apply text-white bg-indigo-500;
  }
  .flatpickr-day.today {
    @apply border-indigo-500;
  }
  .flatpickr-day.selected {
    @apply bg-indigo-500 border-indigo-500 hover:bg-indigo-400; 
  }
  .flatpickr-months .flatpickr-month {
    @apply bg-indigo-500;
  }
  .flatpickr-current-month .flatpickr-monthDropdown-months {
    @apply bg-indigo-500;
  }
  .flatpickr-months {
    @apply bg-indigo-500;
    border-radius: 5px 5px 0px 0px;
  }
  .flatpickr-months .flatpickr-current-month {
    @apply text-white;
  }
  .flatpickr-month .flatpickr-monthDropdown-month {
    @apply text-black;
  }
  .flatpickr-calendar {
    @apply shadow;
  }
  span.arrowUp, span.arrowDown {
    @apply hover:bg-opacity-50;
  }
  .flatpickr-months .flatpickr-prev-month:hover {
    @apply hover:text-indigo-900 fill-current;
  }
  .flatpickr-months .flatpickr-next-month:hover {
    @apply hover:text-indigo-900 fill-current;
  }
  .flatpickr-months .flatpickr-prev-month:hover svg {
    @apply hover:text-indigo-900 fill-current;
  }
  .flatpickr-months .flatpickr-next-month:hover svg {
    @apply hover:text-indigo-900 fill-current;
  }
  .flatpickr-months .flatpickr-prev-month {
    @apply text-white fill-current; 
  }
  .flatpickr-months .flatpickr-next-month {
    @apply text-white fill-current; 
  }
  div.flatpickr-calendar {
    @apply bg-light-200;
  }
  .dark ~ div.flatpickr-calendar {
    @apply bg-dark-100;
  }
  .flatpickr-months .flatpickr-month {
    @apply text-black text-opacity-50;
  }
  .flatpickr-time span.flatpickr-am-pm {
   @apply text-black text-opacity-50;
  }
  .numInput.flatpickr-minute {
   @apply text-black text-opacity-50;
  }
  .numInput.flatpickr-hour {
   @apply text-black text-opacity-50;
  }
  .flatpickr-time span {
   @apply text-black text-opacity-50;
  }
  .flatpickr-time-separator {
   @apply text-black text-opacity-50;
  }

  .dark ~ .flatpickr-calendar .flatpickr-months .flatpickr-month {
    @apply text-white text-opacity-100;
  }
  .dark ~ .flatpickr-calendar .flatpickr-time span.flatpickr-am-pm {
    @apply text-white text-opacity-100;
  }
  .dark ~ .flatpickr-calendar .numInput.flatpickr-minute{
    @apply text-white text-opacity-100;
  }
  .dark ~ .flatpickr-calendar .numInput.flatpickr-hour {
    @apply text-white text-opacity-100;
  }
  .dark ~ .flatpickr-calendar .flatpickr-time span.flatpickr-time-separator {
    @apply text-white text-opacity-100;
  }

  .flatpickr-time span.flatpickr-am-pm {
    @apply hover:bg-light-100 focus:bg-light-100;
  }
  .numInput.flatpickr-minute {
    @apply hover:bg-light-100 focus:bg-light-100;
  }
  .numInput.flatpickr-hour {
    @apply hover:bg-light-100 focus:bg-light-100;
  }
  .dark ~ .flatpickr-calendar .flatpickr-time span.flatpickr-am-pm {
    @apply hover:bg-dark-200 focus:bg-dark-200;
  } 
  .dark ~ .flatpickr-calendar .numInput.flatpickr-minute {
    @apply hover:bg-dark-200 focus:bg-dark-200;
  }
  .dark ~ .flatpickr-calendar .numInput.flatpickr-hour {
    @apply hover:bg-dark-200 focus:bg-dark-200;
  }
  .flatpickr-calendar.hasTime .flatpickr-time {
    @apply border-black border-opacity-25;
  }
  .dark ~ .flatpickr-calendar.hasTime .flatpickr-time {
    @apply border-dark-200;
  }

  .flatpickr-day {
    @apply text-black text-opacity-50 hover:bg-light-100;
  }
  .dark ~ .flatpickr-calendar .flatpickr-day {
    @apply text-white text-opacity-100 hover:bg-dark-200;
  }

  .flatpickr-day.prevMonthDay {
    @apply text-dark hover:bg-light-100;
  }
  .flatpickr-day.nextMonthDay {
    @apply text-dark hover:bg-light-100;
  }
  .flatpickr-day.flatpickr-disabled {
    @apply text-dark hover:bg-light-100;
  }
  .dark ~ .flatpickr-calendar .flatpickr-day.prevMonthDay {
    @apply text-dark hover:bg-dark-200;
  }
  .dark ~ .flatpickr-calendar .flatpickr-day.nextMonthDay {
    @apply text-dark hover:bg-dark-200;
  }
  .dark ~ .flatpickr-calendar .flatpickr-day.flatpickr-disabled {
    @apply text-dark hover:bg-dark-200;
  }

  div .completed {
    @apply bg-green-600 text-white;
  }

  .dark div .completed {
    @apply bg-green-600 text-white;
  }
</style>

<div class="flex items-center px-1 bg-light-100 dark:bg-dark-200 text-light dark:text-dark rounded" on:keyup|stopPropagation class:completed={complete}>
  {#if date}
    <span class="bg-transparent -mr-2 pl-2 py-1 min-w-0 outline-none pr-4">
      <input on:click={handleDueComplete} bind:checked={complete} type="checkbox" class="form-checkbox -mt-1 text-indigo-500 h-4 w-4 border-2 dark:border">
    </span>
  {/if}
  <input id="flatpickr" class="bg-transparent py-1 pr-4 min-w-0 placeholder-light dark:placeholder-dark placeholder-opacity-100 outline-none" placeholder="Select a date..." />
  {#if !complete && date}
    <button title="Clear date" on:click={handleDateClear}>
      <svg class="-ml-8 cursor-pointer opacity-50 hover:opacity-100" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
  {/if}
</div>