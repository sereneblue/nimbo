<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import Modal from './base/Modal.svelte';
  
  export let isConfirmModalOpen: boolean;
  export let modalMessage: string;
  export let onConfirm: Function;
  
  const dispatch = createEventDispatcher();
  
  const handleCloseModal = (e: Event): void => {
    dispatch("close");
  }

  const handleConfirmModal = async (e: Event): Promise<void> => {
    await onConfirm();
    dispatch("close");
  }

</script> 

<Modal isOpen={isConfirmModalOpen} on:close={handleCloseModal}>
  <div class="p-4">
    <h3 class="text-2xl mb-4">
      {modalMessage}
    </h3>
    <div class="flex justify-end">
      <button on:click={handleCloseModal} class="mt-4 mr-2 text-dark dark:text-white hover:text-white border border-gray-500 w-40 hover:bg-gray-500 text-white text-xl font-bold py-2 px-4 rounded">
        Close
      </button>
      <button on:click={handleConfirmModal} class="mt-4 bg-indigo-600 w-40 hover:bg-indigo-700 text-white text-xl font-bold py-2 px-4 rounded">
        Confirm
      </button>
    </div>
  </div>
</Modal>