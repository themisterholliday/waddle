<script lang="ts">
  import {get_game_state_manager} from '../game/game_state';
  import Confetti from './Confetti.svelte';
  import Keyboard from './Keyboard.svelte';

  let word_length = 5;
  let game_state_manager = get_game_state_manager({word_length: word_length});

  $: game_state = game_state_manager.get_game_state();
  $: playing_state = game_state.playing_state;
  $: is_valid_word = check_is_valid_word(entered_word);

  let entered_word = '';
  let board_state = ['', '', '', '', '', ''];

  function reset() {
    game_state_manager = get_game_state_manager({word_length: word_length});
  }

  function update_board_state(entered_word: string) {
    const current_index = 6 - game_state.tries_remaining;
    board_state[current_index] = entered_word;
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

    if (key === 'Backspace') {
      entered_word = entered_word.slice(0, -1);
      update_board_state(entered_word);
      return;
    }

    if (key === 'Enter') {
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
    board_state = ['', '', '', '', '', ''];
    reset();
  }
</script>

{#if playing_state === 'succeeded'}
  <Confetti
    text={'Winner!'}
    restart_button_text={'Go again'}
    on:click={handle_restart}
  />
{/if}

{#if playing_state === 'failed'}
  <Confetti
    text={'You Lost!'}
    restart_button_text={'Try again'}
    on:click={handle_restart}
  />
{/if}
<svelte:body on:keydown={handle_keydown} />
<div class="full_board">
  <div class="guessing_area" style="--word_length: {word_length};">
    {#each board_state as group}
      <div class="grid-group">
        {#each Array.from({length: word_length}) as _, i}
          {@const character = group[i] ?? ''}
          <div
            class="grid-item"
            class:correct_guess={game_state.characters_correctly_guessed.find(
              char => {
                const value =
                  char.character === character &&
                  Number(char.index_in_word) === i;
                return value;
              }
            )}
            class:improper_guess={game_state.characters_correctly_guessed_but_improper_placement.find(
              char => {
                const value =
                  char.character === character &&
                  Number(char.index_in_word) === i;
                return value;
              }
            )}
          >
            {character}
          </div>
        {/each}
      </div>
    {/each}
  </div>
  <div class="typing_area">
    <Keyboard on:stroke={key => handle_stroke(key.detail)} />
  </div>
  <div class="guess_button_area">
    {#if entered_word.length === word_length}
      {#if is_valid_word}
        <button on:click={handle_guess} class="guess_button submit">
          Guess
        </button>
      {/if}
      {#if !is_valid_word}
        <button class="guess_button error"> Not a word! </button>
      {/if}
    {:else}
      <button disabled class="guess_button"> Guess </button>
    {/if}
  </div>
</div>

<style>
  .full_board {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 0.6fr;
  }

  .guessing_area {
    display: grid;

    margin: 0 auto;

    grid-template-rows: repeat(6, 1fr);
    grid-gap: 5px;
    padding: 10px;
    box-sizing: border-box;
  }

  .grid-group {
    grid-gap: 5px;
    display: grid;
    grid-template-columns: repeat(var(--word_length), 1fr);
  }

  .grid-item {
    width: 52px;
    height: 52px;
    border: solid 2px gray;
    border-radius: 0.25rem;

    /* color: var(--tile-text-color); */

    font-family: 'Courier New';
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    line-height: 1;
    font-weight: bold;
    vertical-align: middle;
    box-sizing: border-box;
    text-transform: uppercase;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  .typing_area {
  }

  .guess_button_area {
    margin: 0 auto;
  }

  .guess_button {
    width: 8rem;
    height: 3rem;
    border-radius: 0.25rem;
  }

  .guess_button.submit {
    background-color: lightblue;
  }

  .guess_button.error {
    background-color: lightcoral;
  }

  .correct_guess {
    background-color: lightgreen;
  }

  .improper_guess {
    background-color: yellow;
  }
</style>
