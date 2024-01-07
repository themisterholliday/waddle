<script lang="ts">
  import {createEventDispatcher} from 'svelte';

  export let correct_keys: string[] = [];
  export let improper_keys: string[] = [];
  export let incorrect_keys: string[] = [];

  const dispatch = createEventDispatcher<{
    stroke: string;
  }>();

  function handle_key_press(event: Event) {
    const target = event.currentTarget as HTMLButtonElement;
    const key = target.getAttribute('data-key');
    if (!key) {
      return;
    }
    dispatch('stroke', key);
  }

  const characters_row_1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const characters_row_2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const characters_row_3 = [
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    'BACKSPACE',
  ];

  const characters_row_1_keys = characters_row_1.map(key => ({
    character: key,
    'data-key': key,
    'aria-label': `add ${key}`,
    class: 'keyboard_key',
  }));

  const characters_row_2_keys = characters_row_2.map(key => ({
    character: key,
    'data-key': key,
    'aria-label': `add ${key}`,
    class: 'keyboard_key',
  }));

  const characters_row_3_keys = characters_row_3.map(key => {
    const _class =
      key === 'ENTER' || key === 'BACKSPACE'
        ? 'keyboard_key keyboard_key-one_and_a_half'
        : 'keyboard_key';
    return {
      character: key,
      'data-key': key,
      'aria-label': `add ${key}`,
      class: _class,
    };
  });

  function get_key_state_class(
    character: string,
    correct_keys: string[],
    improper_keys: string[],
    incorrect_keys: string[]
  ) {
    const is_in_correct_keys = correct_keys.includes(character);
    const is_in_improper_keys = improper_keys.includes(character);
    const is_in_incorrect_keys = incorrect_keys.includes(character);

    if (is_in_correct_keys) {
      return 'correct_key';
    }
    if (is_in_improper_keys) {
      return 'improper_key';
    }
    if (is_in_incorrect_keys) {
      return 'incorrect_key';
    }
  }
</script>

<div class="keyboard" role="group" aria-label="Keyboard">
  <div class="keyboard_row">
    {#each characters_row_1_keys as key}
      <button
        type="button"
        data-key={key['data-key']}
        aria-label={key['aria-label']}
        aria-disabled={false}
        class={`${key.class} ${get_key_state_class(
          key.character,
          correct_keys,
          improper_keys,
          incorrect_keys
        )}`}
        on:click={handle_key_press}
      >
        {key.character}
      </button>
    {/each}
  </div>
  <div class="keyboard_row">
    <div data-testid="spacer" class="keyboard_key-half"></div>
    {#each characters_row_2_keys as key}
      <button
        type="button"
        data-key={key['data-key']}
        aria-label={key['aria-label']}
        aria-disabled={false}
        class={`${key.class} ${get_key_state_class(
          key.character,
          correct_keys,
          improper_keys,
          incorrect_keys
        )}`}
        on:click={handle_key_press}
      >
        {key.character}
      </button>
    {/each}
    <div data-testid="spacer" class="keyboard_key-half"></div>
  </div>
  <div class="keyboard_row">
    {#each characters_row_3_keys as key}
      <button
        type="button"
        data-key={key['data-key']}
        aria-label={key['aria-label']}
        aria-disabled={false}
        class={`${key.class} ${get_key_state_class(
          key.character,
          correct_keys,
          improper_keys,
          incorrect_keys
        )}`}
        on:click={handle_key_press}
      >
        {#if key.character === 'BACKSPACE'}
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 0 24 24"
            width="20"
            class="game-icon"
            data-testid="icon-backspace"
          >
            <path
              fill="var(--text-color)"
              d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
            >
            </path>
          </svg>
        {:else}
          {key.character}
        {/if}
      </button>
    {/each}
  </div>
</div>

<style>
  .keyboard {
    height: 100%;
    width: 100%;
  }

  .keyboard_row {
    display: flex;
    width: 100%;
    margin: 0 auto 8px;
    touch-action: manipulation;

    /* justify-content: space-evenly; */
  }

  .keyboard_key {
    --text-color: white;
    --key-bg: gray;

    font-family: 'Courier New';
    font-size: 1.25rem;
    font-weight: bold;
    border: 0;
    padding: 0;
    margin: 0 6px 0 0;
    height: 58px;
    border-radius: 4px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    color: var(--text-color);
    background-color: var(--key-bg);
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0.3);
  }

  .keyboard_key:last-of-type {
    margin: 0;
  }

  .keyboard_key-half {
    flex: 0.5;
  }

  .keyboard_key-one_and_a_half {
    flex: 1.5;
  }

  .correct_key {
    background-color: lightgreen;
    color: white;
  }

  .improper_key {
    background-color: #ffbf00;
    color: white;
  }

  .incorrect_key {
    opacity: 0.5;
  }
</style>
