<script lang="ts">
  import FullGameBoard from './lib/components/FullGameBoard.svelte';
</script>

<main>
  <!-- App -->
  <!-- <p class="title">Waddle Waddle</p> -->
  <span class="container">
    <FullGameBoard />
  </span>
</main>

<style>
  main {
    height: 100%;
  }

  .container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .title {
    position: absolute;
    top: 8px;
    left: 8px;

    font-style: italic;
  }
</style>
