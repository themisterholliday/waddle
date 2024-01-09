<script lang="ts">
  import {createEventDispatcher, onMount} from 'svelte';
  const dispatch = createEventDispatcher<{
    word_length_change: number;
    theme_change: string;
  }>();

  export let open: boolean = false;

  export let word_length_options: number[];
  export let word_length: number;

  export let theme_options: string[];
  export let theme: string;

  function handle_word_length_select_change(event: Event) {
    const target = event.target as HTMLSelectElement;
    const number = Number(target.value);
    dispatch('word_length_change', number);
  }

  function handle_theme_select_change(event: Event) {
    const target = event.target as HTMLSelectElement;
    dispatch('theme_change', target.value);
  }

  let dialog: HTMLDialogElement;

  function handle_click_outside(event: MouseEvent) {
    if (dialog && !dialog.contains(event.target as Node)) {
      open = false;
    }
  }

  function handle_close() {
    open = false;
  }

  onMount(() => {
    document.addEventListener('click', handle_click_outside);
    return () => document.removeEventListener('click', handle_click_outside);
  });

  // NOTE: I think this should work by default in the browser but for some reason we're having to re-implement it here
  function close_on_escape(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      open = false;
    }
  }

  onMount(() => {
    document.addEventListener('keydown', close_on_escape);

    return () => document.removeEventListener('keydown', close_on_escape);
  });
</script>

{#if open}
  <div class="background"></div>
{/if}
<dialog {open} on:close={handle_close} bind:this={dialog}>
  <div class="dialog_container">
    <h2>Settings</h2>
    <div class="settings_item">
      <label for="word_length_option">Word Length:</label>
      <select
        name="word_length_option"
        id="word_length_option"
        bind:value={word_length}
        on:change={handle_word_length_select_change}
      >
        {#each word_length_options as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>
    <div class="settings_item">
      <label for="theme_options">Theme:</label>
      <select
        name="theme_options"
        id="theme_options"
        bind:value={theme}
        on:change={handle_theme_select_change}
      >
        {#each theme_options as option}
          <option value={option}>{option}</option>
        {/each}
      </select>
    </div>
    <button class="close-button default_button" on:click={handle_close}>
      Close
    </button>
  </div>
</dialog>

<style>
  h2,
  label {
    color: var(--opposite-font-color);
  }

  dialog {
    margin-top: 2rem;
    width: 80%;
    height: 100%;
    max-width: 500px;
    max-height: 400px;
    padding: 20px;
    border: none;
    border-radius: 5px;
    background-color: var(--bg-color);
    border: 2px solid var(--opposite-bg-color);
    z-index: 1;
  }

  .dialog_container {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    z-index: 10;
  }

  .settings_item {
    margin-bottom: 1rem;
  }

  h2 {
    margin-bottom: 1rem;
  }

  select {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  .close-button {
    margin: 0 auto;
  }

  .background {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
  }
</style>
