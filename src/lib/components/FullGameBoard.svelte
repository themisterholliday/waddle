<script lang="ts">
  import happy_penguin from '../../assets/happy_penguin.png';
  import {get_game_state_manager} from '../game/game_state';
  import Confetti from './Confetti.svelte';
  import Keyboard from './Keyboard.svelte';
  import Settings from './Settings.svelte';

  let word_length = 5;
  let word_length_options = [2, 3, 4, 5, 6, 7, 8];

  let theme = '';
  let theme_options = ['system', 'light', 'dark', 'gameboy'];

  let game_state_manager = get_game_state_manager({word_length: word_length});

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
    console.log(event.detail);
    word_length = event.detail;
    handle_restart();
  }

  function set_color_scheme() {}

  function handle_theme_change(event: CustomEvent) {
    theme = event.detail;

    let system_color_scheme = '';
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      system_color_scheme = 'dark';
    } else {
      system_color_scheme = 'light';
    }

    if (theme === 'system') {
      document.documentElement.setAttribute('data-theme', system_color_scheme);
      localStorage.setItem('theme', system_color_scheme);
      return;
    }

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  function set_default_theme_settings() {
    let system_color_scheme = '';
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      system_color_scheme = 'dark';
    } else {
      system_color_scheme = 'light';
    }
    const _theme = localStorage.getItem('theme') || system_color_scheme;
    theme = _theme;

    if (_theme === 'system') {
      document.documentElement.setAttribute('data-theme', system_color_scheme);
      localStorage.setItem('theme', system_color_scheme);
      return;
    }

    document.documentElement.setAttribute('data-theme', _theme);
    localStorage.setItem('theme', _theme);
  }
  // NOTE: set the theme on load
  set_default_theme_settings();
</script>

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
  {theme}
  {theme_options}
  on:word_length_change={handle_word_length_change}
  on:theme_change={handle_theme_change}
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
          <svg
            width="101"
            height="101"
            viewBox="0 0 101 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
          >
            <path
              d="M31.657 44.6347C30.329 43.2727 28.144 43.2407 26.781 44.5717L22.474 48.7667C22.383 48.9037 22.152 49.1127 21.887 49.3397C22.702 36.2267 32.432 25.4657 45.597 23.4597C55.765 21.9087 65.946 26.0457 72.167 34.2557C72.849 35.1527 73.964 35.6057 75.08 35.4347C75.58 35.3587 76.06 35.1557 76.467 34.8477C77.364 34.1657 77.817 33.0517 77.649 31.9367C77.572 31.4337 77.368 30.9547 77.06 30.5477C69.48 20.5427 57.07 15.5017 44.673 17.3917C28.49 19.8597 16.534 33.1697 15.713 49.3377C15.625 49.2427 15.55 49.1537 15.513 49.0837L10.918 44.3687C9.58903 43.0087 7.40403 42.9777 6.04203 44.3047C4.67703 45.6347 4.65003 47.8187 5.97903 49.1847L16.214 59.6867C16.91 60.4017 17.842 60.7497 18.767 60.7267C19.606 60.7057 20.439 60.3817 21.089 59.7477L31.593 49.5127C32.958 48.1847 32.986 45.9997 31.657 44.6347ZM18.886 53.9577C18.927 53.9567 18.967 53.9537 19.007 53.9497C18.969 53.9967 18.93 53.9967 18.886 53.9577Z"
              fill="currentColor"
            />
            <path
              d="M93.1081 53.8206L82.8751 43.3176C82.1791 42.6046 81.2461 42.2556 80.3211 42.2776C79.4821 42.2976 78.6471 42.6246 77.9991 43.2566L67.4931 53.4916C66.1291 54.8226 66.1001 57.0076 67.4301 58.3716C68.7591 59.7316 70.9431 59.7666 72.3051 58.4346L76.6151 54.2386C76.6991 54.1116 76.9051 53.9216 77.1461 53.7146C76.2381 66.7306 66.5401 77.3846 53.4471 79.3816C43.2781 80.9306 33.0971 76.7946 26.8781 68.5856C26.1961 67.6876 25.0811 67.2356 23.9661 67.4056C23.4661 67.4806 22.9851 67.6836 22.5781 67.9926C21.6801 68.6736 21.2271 69.7896 21.3971 70.9046C21.4741 71.4056 21.6781 71.8856 21.9851 72.2926C29.5661 82.2976 41.9751 87.3386 54.3731 85.4476C70.5161 82.9856 82.4521 69.7316 83.3221 53.6156C83.4361 53.7306 83.5311 53.8406 83.5751 53.9236L88.1701 58.6386C89.5001 59.9986 91.6841 60.0296 93.0441 58.7026C94.4111 57.3716 94.4381 55.1876 93.1081 53.8206Z"
              fill="currentColor"
            />
          </svg>
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
  h1 {
    color: var(--opposite-font-color);
  }

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
    border: var(--tile-border);
    color: var(--tile-text-color);
    background-color: var(--tile-background-color);
  }

  .grid_item_content {
    border-radius: var(--tile-border-radius);
    font-family: var(--tile-font-family);

    width: 100%;
    height: 100%;

    align-items: center;
    font-size: 2rem;
    font-weight: bold;
    line-height: var(--tile-line-height);
    vertical-align: middle;
    text-align: center;
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
    background-color: var(--guess-button-bg-submit-color);
    color: var(--guess-button-text-submit-color);
  }

  .guess_button.error {
    background-color: var(--guess-button-bg-error-color);
    color: var(--guess-button-text-error-color);
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

  .refresh_button > svg {
    width: 100%;
    height: 100%;
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
