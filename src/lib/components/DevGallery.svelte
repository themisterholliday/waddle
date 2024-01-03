<script lang="ts">
  import Board from './Board.svelte';
  import StackItem from './StackItem.svelte';
  import StackItemSetGroup from './StackItemSetGroup.svelte';
  import type {
    StackItem as GameStackItem,
    Size,
    StackItemAndIndex,
  } from '../game/game_state';

  // let size_items: Size[] = ['small', 'medium', 'large'];
  let color_small = 'gray';
  let color_medium = 'gray';
  let color_large = 'gray';

  function flip_size(size: Size) {
    switch (size) {
      case 'small':
        color_small = color_small === 'gray' ? 'green' : 'gray';
        break;
      case 'medium':
        color_medium = color_medium === 'gray' ? 'red' : 'gray';
        break;
      case 'large':
        color_large = color_large === 'gray' ? 'blue' : 'gray';
        break;
    }
  }

  const stack_items: GameStackItem[] = [
    {
      set: 0,
      size: 'small',
      location: [0, 0],
    },
    {
      set: 1,
      size: 'medium',
      location: [0, 0],
    },
    {
      set: 2,
      size: 'large',
      location: undefined,
    },
    {
      set: 3,
      size: 'small',
      location: undefined,
    },
    {
      set: 0,
      size: 'medium',
      location: undefined,
    },
    {
      set: 1,
      size: 'large',
      location: [0, 1],
    },
    {
      set: 2,
      size: 'small',
      location: [0, 2],
    },
    {
      set: 3,
      size: 'medium',
      location: [1, 1],
    },
    {
      set: 0,
      size: 'large',
      location: undefined,
    },
  ];

  const stack_items_and_index: StackItemAndIndex[] = [
    {
      stack_item: {
        set: 0,
        size: 'small',
        location: [0, 0],
      },
      index: 0,
    },
    {
      stack_item: {set: 1, size: 'medium', location: [0, 0]},
      index: 1,
    },
    {
      stack_item: {set: 2, size: 'large', location: undefined},
      index: 2,
    },
    {
      stack_item: {set: 3, size: 'small', location: undefined},
      index: 3,
    },
    {
      stack_item: {set: 0, size: 'medium', location: undefined},
      index: 4,
    },
    {
      stack_item: {set: 1, size: 'large', location: [0, 1]},
      index: 5,
    },
    {
      stack_item: {set: 2, size: 'small', location: [0, 2]},
      index: 6,
    },
    {
      stack_item: {set: 3, size: 'medium', location: [1, 1]},
      index: 7,
    },
    {
      stack_item: {set: 0, size: 'large', location: undefined},
      index: 8,
    },
  ];
</script>

<main>
  <!-- App -->
  <p>Single Stack Item</p>
  <div class="stack_item_container">
    <StackItem {color_small} {color_medium} {color_large} />
  </div>
  <button on:click={() => flip_size('small')}> small </button>
  <button on:click={() => flip_size('medium')}> medium </button>
  <button on:click={() => flip_size('large')}> large </button>

  <br />
  <div class="stack_item_container">
    <p>Row set</p>
    <StackItemSetGroup stack_items={stack_items_and_index} />
  </div>

  <br />
  <div class="stack_item_container_column">
    <p>Column set</p>
    <StackItemSetGroup
      stack_items={stack_items_and_index}
      direction={'column'}
    />
  </div>

  <br />
  <p>Board</p>
  <Board
    {stack_items}
    on:stack_item_click={event => {
      console.log(event.detail);
    }}
  />
</main>

<style>
  main {
    height: 100%;
  }

  .stack_item_container {
    height: 20%;
  }

  .stack_item_container_column {
    height: 60%;
    width: 20%;
    margin: 0 auto;
  }
</style>
