<script lang="ts">
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher<{
    stroke: string;
  }>();

  function handle_key_press(event: Event) {
    const target = event.target as HTMLButtonElement;
    const key = target.getAttribute('data-key');
    if (!key) {
      return;
    }
    dispatch('stroke', key);
  }
</script>

<div class="keyboard" role="group" aria-label="Keyboard">
  <div class="keyboard_row">
    <button
      type="button"
      data-key="q"
      aria-label="add q"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      q
    </button>
    <button
      type="button"
      data-key="w"
      aria-label="add w"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      w
    </button>
    <button
      type="button"
      data-key="e"
      aria-label="add e"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      e
    </button>
    <button
      type="button"
      data-key="r"
      aria-label="add r"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      r
    </button>
    <button
      type="button"
      data-key="t"
      aria-label="add t"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      t
    </button>
    <button
      type="button"
      data-key="y"
      aria-label="add y"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      y
    </button>
    <button
      type="button"
      data-key="u"
      aria-label="add u"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      u
    </button>
    <button
      type="button"
      data-key="i"
      aria-label="add i"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      i
    </button>
    <button
      type="button"
      data-key="o"
      aria-label="add o"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      o
    </button>
    <button
      type="button"
      data-key="p"
      aria-label="add p"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      p
    </button>
  </div>
  <div class="keyboard_row">
    <div data-testid="spacer" class="keyboard_key-half"></div>

    <button
      type="button"
      data-key="a"
      aria-label="add a"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      a
    </button>
    <button
      type="button"
      data-key="s"
      aria-label="add s"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      s
    </button>
    <button
      type="button"
      data-key="d"
      aria-label="add d"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      d
    </button>
    <button
      type="button"
      data-key="f"
      aria-label="add f"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      f
    </button>
    <button
      type="button"
      data-key="g"
      aria-label="add g"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      g
    </button>
    <button
      type="button"
      data-key="h"
      aria-label="add h"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      h
    </button>
    <button
      type="button"
      data-key="j"
      aria-label="add j"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      j
    </button>
    <button
      type="button"
      data-key="k"
      aria-label="add k"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      k
    </button>
    <button
      type="button"
      data-key="l"
      aria-label="add l"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      l
    </button>
    <div data-testid="spacer" class="keyboard_key-half"></div>
  </div>
  <div class="keyboard_row">
    <button
      type="button"
      data-key="enter"
      aria-label="enter"
      aria-disabled="true"
      class="keyboard_key keyboard_key-one_and_a_half"
      on:click={handle_key_press}>enter</button
    >
    <button
      type="button"
      data-key="z"
      aria-label="add z"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      z
    </button>
    <button
      type="button"
      data-key="x"
      aria-label="add x"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      x
    </button>
    <button
      type="button"
      data-key="c"
      aria-label="add c"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      c
    </button>
    <button
      type="button"
      data-key="v"
      aria-label="add v"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      v
    </button>
    <button
      type="button"
      data-key="b"
      aria-label="add b"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      b
    </button>
    <button
      type="button"
      data-key="n"
      aria-label="add n"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      n
    </button>
    <button
      type="button"
      data-key="m"
      aria-label="add m"
      aria-disabled="false"
      class="keyboard_key"
      on:click={handle_key_press}
    >
      m
    </button>
    <button
      type="button"
      data-key="backspace"
      aria-label="backspace"
      aria-disabled="true"
      class="keyboard_key keyboard_key-one_and_a_half"
      on:click={handle_key_press}
    >
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
    </button>
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
    font-size: 1.25em;
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
</style>
