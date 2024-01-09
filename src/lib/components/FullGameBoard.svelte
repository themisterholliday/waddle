<script lang="ts">
  import happy_penguin from '../../assets/happy_penguin.png';
  import {get_game_state_manager} from '../game/game_state';
  import Confetti from './Confetti.svelte';
  import Keyboard from './Keyboard.svelte';
  import Settings from './Settings.svelte';
  import refresh_svg from '../../assets/refresh.svg';

  let word_length = 5;
  let game_state_manager = get_game_state_manager({word_length: word_length});

  let word_length_options = [2, 3, 4, 5, 6, 7, 8];

  $: game_state = game_state_manager.get_game_state();
  $: playing_state = game_state.playing_state;
  $: is_valid_word = check_is_valid_word(entered_word);
  $: correct_keys = game_state.characters_correctly_guessed.map(
    x => x.character
  );
  $: improper_keys =
    game_state.characters_correctly_guessed_but_improper_placement.map(
      x => x.character
    );
  $: incorrect_keys = game_state.characters_incorrectly_guessed;

  let entered_word = '';
  let board_state = [
    {word: '', complete: false},
    {word: '', complete: false},
    {word: '', complete: false},
    {word: '', complete: false},
    {word: '', complete: false},
    {word: '', complete: false},
  ];

  function reset() {
    game_state_manager = get_game_state_manager({word_length: word_length});
  }

  function update_board_state(entered_word: string) {
    const current_index = 6 - game_state.tries_remaining;
    board_state[current_index] = {word: entered_word, complete: false};
  }

  function check_is_valid_word(entered_word: string) {
    if (entered_word.length < word_length) {
      return true;
    }
    return game_state_manager.is_valid_word(entered_word);
  }

  function is_all_letters(string: string) {
    const regex = /^[A-Za-z]+$/;
    return regex.test(string);
  }

  function handle_submit() {
    if (!is_valid_word) {
      return;
    }
    if (entered_word.length < word_length) {
      return;
    }

    const current_index = 6 - game_state.tries_remaining;
    board_state[current_index] = {word: entered_word, complete: true};
    game_state = game_state_manager.guess_word(entered_word);
    entered_word = '';
  }

  function handle_keydown(event: KeyboardEvent) {
    handle_stroke(event.key);
  }

  function handle_stroke(key: string) {
    if (game_state.playing_state !== 'playing') {
      return;
    }

    if (game_state.tries_remaining === 0) {
      return;
    }

    if (key === 'BACKSPACE' || key === 'Backspace') {
      entered_word = entered_word.slice(0, -1);
      update_board_state(entered_word);
      return;
    }

    if (key === 'ENTER' || key === 'Enter') {
      handle_submit();
      return;
    }

    if (key.length > 1) {
      return;
    }

    if (!is_all_letters(key)) {
      return;
    }

    const upper_key = key.toUpperCase();
    if (entered_word.length >= word_length) {
      return;
    }
    entered_word += upper_key;
    update_board_state(entered_word);
  }

  function handle_guess() {
    handle_submit();
  }

  function handle_restart() {
    entered_word = '';
    board_state = [
      {word: '', complete: false},
      {word: '', complete: false},
      {word: '', complete: false},
      {word: '', complete: false},
      {word: '', complete: false},
      {word: '', complete: false},
    ];
    reset();
  }

  let dialog_open = false;

  function open_dialog() {
    dialog_open = !dialog_open;
  }

  function handle_word_length_change(event: CustomEvent) {
    word_length = event.detail;
    handle_restart();
  }
</script>

<!-- {#if playing_state === 'succeeded'}
  <Confetti
    title={'Winner!'}
    subtitle={`The word is ${game_state.word_to_guess}`}
    restart_button_text={'Go again'}
    on:click={handle_restart}
  />
{/if} -->
{#if playing_state === 'failed'}
  <Confetti
    title={'You Lost!'}
    subtitle={`The word is ${game_state.word_to_guess}`}
    restart_button_text={'Try again'}
    on:click={handle_restart}
  />
{/if}

<svelte:body on:keydown={handle_keydown} />

<Settings
  bind:open={dialog_open}
  {word_length}
  {word_length_options}
  on:word_length_change={handle_word_length_change}
/>

<div class="full_board">
  <header class="header">
    <div class="header_title">
      <img
        class:dance={game_state.playing_state === 'succeeded'}
        src={happy_penguin}
        alt="penguin"
      />
      <h1>Waddle</h1>
    </div>
    <div class="settings_button_group">
      {#if playing_state === 'succeeded'}
        <button class="refresh_button" on:click={handle_restart}>
          <img src={refresh_svg} alt="refresh icon" />
        </button>
      {/if}
      <button class="settings-cog" on:click|stopPropagation={open_dialog}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.847.516 1.874.282 2.572-1.065z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
      </button>
    </div>
  </header>

  <div class="guessing_area" style="--word_length: {word_length};">
    {#each board_state as group}
      <div class="grid-group">
        {#each Array.from({length: word_length}) as _, i}
          {@const character = group.word[i] ?? ''}
          <div
            class="grid-item"
            class:flip={group.complete === true}
            style:transition-delay={i * (100 * 1.8) + 'ms'}
            style:animation-delay={i * 100 + 'ms'}
            class:correct_guess={game_state.characters_correctly_guessed.find(
              char => {
                const value =
                  char.character === character &&
                  Number(char.index_in_word) === i;
                return value;
              }
            ) && group.complete === true}
            class:improper_guess={game_state.characters_correctly_guessed_but_improper_placement.find(
              char => {
                const value =
                  char.character === character &&
                  Number(char.index_in_word) === i;
                return value;
              }
            ) && group.complete === true}
            class:incorrect_guess={game_state.characters_incorrectly_guessed.includes(
              character
            ) && group.complete === true}
          >
            {#if game_state.playing_state === 'succeeded' && game_state.word_to_guess === group.word}
              <div class="winning_penguin dance">
                <img src={happy_penguin} alt="penguin" />
              </div>
            {/if}
            <div class="grid_item_content">
              {character}
            </div>
          </div>
        {/each}
      </div>
    {/each}
  </div>
  <div class="typing_area">
    <Keyboard
      on:stroke={key => handle_stroke(key.detail)}
      bind:incorrect_keys
      bind:correct_keys
      bind:improper_keys
    />
  </div>
  <div class="guess_button_area">
    {#if entered_word.length === word_length}
      {#if is_valid_word}
        <button
          on:click={handle_guess}
          class="guess_button submit default_button"
        >
          Guess
        </button>
      {/if}
      {#if !is_valid_word}
        <button class="guess_button error default_button"> Not a word! </button>
      {/if}
    {:else}
      <button disabled class="guess_button default_button"> Guess </button>
    {/if}
  </div>
</div>

<style>
  .full_board {
    height: 100%;
    max-width: 100%;
    display: grid;
    grid-template-rows: 1fr 0.6fr;
  }

  .guessing_area {
    display: grid;

    margin: 0 auto;

    grid-template-rows: repeat(6, 1fr);
    grid-gap: 5px;
    padding-block: 10px;
    box-sizing: border-box;
  }

  .grid-group {
    --grid_group_gap: 5px;
    grid-gap: var(--grid_group_gap);
    display: grid;
    grid-template-columns: repeat(var(--word_length), 1fr);
  }

  .grid-item {
    position: relative;
    max-width: calc(100vw / var(--word_length) - var(--grid_group_gap));

    width: 52px;
    height: 52px;
    border-radius: var(--tile-border-radius);
    color: var(--tile-text-color);
    background-color: var(--tile-background-color);
  }

  .grid_item_content {
    border: var(--tile-border);
    border-radius: var(--tile-border-radius);
    font-family: var(--tile-font-family);

    width: 100%;
    height: 100%;

    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    font-weight: bold;
    line-height: 1;
    vertical-align: middle;
    box-sizing: border-box;
    text-transform: uppercase;

    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  .typing_area {
    padding-inline: 8px;
  }

  .guess_button_area {
    margin: 0 auto;
  }

  .guess_button.submit {
    background-color: var(--primary-color);
  }

  .guess_button.error {
    background-color: var(--error-color);
  }

  .settings-cog {
    color: var(--opposite-font-color);
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    margin: 0;

    width: 42px;
    height: 42px;

    -webkit-tap-highlight-color: transparent;
  }

  .refresh_button {
    color: var(--opposite-font-color);
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    margin: 0;

    width: 42px;
    height: 42px;

    -webkit-tap-highlight-color: transparent;
  }

  .settings_button_group {
    display: flex;
    align-items: center;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
  }

  .header_title {
    display: flex;
    align-items: center;
  }

  .header_title img {
    height: 42px;
    margin-right: 0.25rem;
  }

  @keyframes pop {
    0% {
      transform: scale(1);
    }
    10% {
      transform: scale(1.1);
    }
    15% {
      transform: scale(1);
    }
    75% {
      transform: scale(1);
    }
    100% {
      transform: scale(1);
    }
  }

  .grid-item > .grid_item_content:empty {
    animation: none;
  }

  .grid-item > .grid_item_content:not(:empty) {
    animation: pop 400ms ease-in-out;
  }

  .grid-item.flip {
    animation: flip 500ms ease forwards;
  }

  @keyframes flip {
    0% {
      transform: scaleY(1);
    }

    50% {
      transform: scaleY(0);
    }

    100% {
      transform: scaleY(1);
    }
  }

  .winning_penguin {
    --height: 20px;
    position: absolute;
    bottom: 100%;
    left: calc(50% - calc(var(--height) / 2));
    z-index: 1;
    width: var(--height);
    height: var(--height);
  }

  .dance {
    animation: dance 1000ms linear forwards infinite;
  }

  @keyframes dance {
    0%,
    50% {
      transform: scaleX(-1);
    }

    51%,
    100% {
      transform: scaleX(1);
    }
  }
</style>
