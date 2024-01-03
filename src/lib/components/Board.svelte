<script lang="ts">
  import {
    get_color_for_set,
    type StackItem as GameStackItem,
  } from '../game/game_state';
  import StackItem from './StackItem.svelte';

  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher<{
    stack_item_click: [number, number];
  }>();

  export let stack_items: GameStackItem[];

  function get_color_from_set(set: number | undefined) {
    if (set === undefined) {
      return undefined;
    }
    return get_color_for_set(set);
  }

  function format_location_to_key(location: [number, number]) {
    return location.join('_');
  }

  function format_key_to_location(location: string): [number, number] {
    const split = location.split('_');
    return [Number(split[0]), Number(split[1])];
  }

  function group_items_by_location(stack_items: GameStackItem[]) {
    const map: Map<string, Required<GameStackItem>[]> = new Map();
    // Set the entire board's default values
    map.set(format_location_to_key([0, 0]), []);
    map.set(format_location_to_key([1, 0]), []);
    map.set(format_location_to_key([2, 0]), []);
    map.set(format_location_to_key([0, 1]), []);
    map.set(format_location_to_key([1, 1]), []);
    map.set(format_location_to_key([2, 1]), []);
    map.set(format_location_to_key([0, 2]), []);
    map.set(format_location_to_key([1, 2]), []);
    map.set(format_location_to_key([2, 2]), []);

    for (const item of stack_items) {
      const {set, size, location} = item;
      if (location === undefined) {
        continue;
      }
      let array = map.get(format_location_to_key(location));
      if (array === undefined) {
        continue;
      }
      map.set(format_location_to_key(location), [
        ...array,
        {set, size, location},
      ]);
    }
    const values = Array.from(map.keys());
    return values.map(key => {
      const items = map.get(key) ?? [];
      return {
        location: format_key_to_location(key),
        color_small: get_color_from_set(
          items.find(item => item.size === 'small')?.set
        ),
        color_medium: get_color_from_set(
          items.find(item => item.size === 'medium')?.set
        ),
        color_large: get_color_from_set(
          items.find(item => item.size === 'large')?.set
        ),
      };
    });
  }

  $: stack_item_group = group_items_by_location(stack_items);

  function handle_stack_item_click(location: [number, number] | undefined) {
    if (location === undefined) {
      return;
    }
    dispatch('stack_item_click', location);
  }
</script>

<div class="container">
  {#each stack_item_group as group}
    <StackItem
      on:click={() => handle_stack_item_click(group.location)}
      color_small={group.color_small}
      color_medium={group.color_medium}
      color_large={group.color_large}
    />
  {/each}
</div>

<style>
  .container {
    height: 100%;
    width: 100%;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;

    background-color: #fffcf0;

    border-radius: 2rem;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  }
</style>
