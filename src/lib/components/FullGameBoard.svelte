<!-- <script lang="ts">
  import { get_color_for_set, get_game_state_manager, type StackItemAndIndex } from '../game/game_state';
  import Board from './Board.svelte';
  import StackItemSetGroup from './StackItemSetGroup.svelte';
  import Winner from './Winner.svelte';

  function handle_state_change() {
    game_state = game_state_manager.game_state;
    set_0 = game_state_manager.get_stack_items_for_set(0);
    set_1 = game_state_manager.get_stack_items_for_set(1);
    set_2 = game_state_manager.get_stack_items_for_set(2);
    set_3 = game_state_manager.get_stack_items_for_set(3);
  }

  let game_state_manager = get_game_state_manager(handle_state_change);

  function reset() {
    game_state_manager = get_game_state_manager(handle_state_change);
    selected_item = undefined;
  }

  function handle_set_selected_item(event: CustomEvent<StackItemAndIndex>) {
    selected_item = event.detail;
  }

  function handle_board_seleceted_stack_item(event: CustomEvent<[number, number]>) {
    if (selected_item !== undefined) {
      const success = game_state_manager.update_stack_item_location(selected_item.index, event.detail);
      if (success === true) {
        selected_item = undefined;
      }
    }
  }

  let selected_item: StackItemAndIndex | undefined = undefined;
  $: game_state = game_state_manager.game_state;
  $: set_0 = game_state_manager.get_stack_items_for_set(0);
  $: set_1 = game_state_manager.get_stack_items_for_set(1);
  $: set_2 = game_state_manager.get_stack_items_for_set(2);
  $: set_3 = game_state_manager.get_stack_items_for_set(3);
  $: winner = game_state.winner;
</script>

<!-- <button class="reset_button" on:click={reset}>Reset</button>
{#if winner !== undefined}
  <Winner />
{/if} -->
<div class="full_board">
  <div class="guessing_area"></div>
  <div class="typing_area"></div>
</div>
 -->

<style>
  .full_board {
    height: 100%;
    display: flex;
  }

  .board {
    grid-area: content;
    aspect-ratio: 1 / 1;
  }

  /* .stack_item_container_0 {
    grid-area: header;
  }

  .stack_item_container_1 {
    grid-area: side;
  }

  .stack_item_container_2 {
    grid-area: footer;
  }

  .stack_item_container_3 {
    grid-area: nav;
  }

  .reset_button {
    position: absolute;
    top: 8px;
    right: 8px;
  } */
</style>
