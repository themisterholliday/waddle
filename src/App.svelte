<script lang="ts">
  import FullGameBoard from './lib/components/FullGameBoard.svelte';
</script>

<main>
  <!-- App -->
  <!-- <p class="title">Waddle Waddle</p> -->
  <div class="container">
    <FullGameBoard />
  </div>
</main>

<style>
  main {
    height: 100%;
  }

  .container {
    margin: 0 auto;
    height: 600px;
    width: min(100%, 32rem);
  }
</style>
