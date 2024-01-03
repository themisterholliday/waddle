<script lang="ts">
  import type {Size} from '../game/game_state';

  export let color_small: string | undefined;
  export let color_medium: string | undefined;
  export let color_large: string | undefined;
  export let is_disabled = false;

  export let highlight: Size | undefined = undefined;
</script>

<button class="container" disabled={is_disabled} on:click>
  <div
    class="circle circle_inner {highlight === 'small'
      ? 'highlight'
      : ''} {color_small !== undefined ? 'circle_filled' : 'circle_empty'}"
    style="--color:{color_small};"
  />
  <div
    class="circle circle_middle {highlight === 'medium' ? 'highlight' : ''} 
      {color_medium !== undefined ? 'circle_filled' : 'circle_empty'}"
    style="--color:{color_medium};"
  />
  <div
    class="circle circle_outer {highlight === 'large' ? 'highlight' : ''} 
    {color_large !== undefined ? 'circle_filled' : 'circle_empty'}"
    style="--color:{color_large};"
  />
</button>

<style>
  button {
    position: relative;
  }

  button div {
    position: absolute;
  }

  button {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }

  button:hover {
    outline: 0.2rem solid blueviolet;
    border-radius: 20px;
    cursor: pointer;
  }

  button:hover:disabled {
    outline: none;
    cursor: default;
  }

  .container {
    height: 100%;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .circle {
    margin: 0 auto;
    border-radius: 50%;

    aspect-ratio: 1 / 1;
  }

  .circle_filled {
    border: solid calc(var(--stack_item_size) * 0.08) var(--color);
  }

  .circle_empty {
    box-shadow: inset 0px 0px 0.6vw 0px rgba(0, 0, 0, 0.5);
  }

  .circle_middle {
    height: calc(var(--stack_item_size) * 0.66);
    width: calc(var(--stack_item_size) * 0.66);
  }

  .circle_inner {
    height: calc(var(--stack_item_size) * 0.33);
    width: calc(var(--stack_item_size) * 0.33);
  }

  .circle_outer {
    height: var(--stack_item_size);
    width: var(--stack_item_size);
  }

  .highlight {
    outline: 0.4vw solid gold;
  }
</style>
