<script lang="ts">
  import { getCss } from '../../utils/css';

  const {
    ratio,
    placeholder,
    onclick
  }: { ratio?: number; placeholder?: string; onclick?: () => void } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  onclick={() => onclick?.()}
  class="image"
  class:image--clickable={Boolean(onclick)}
  style={getCss({
		aspectRatio: ratio ? ratio.toString() : undefined
	})}
>
  <span>{placeholder || 'image'}</span>
  <svg class="cross" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <line x1="0" y1="0" x2="100%" y2="100%" />
    <line x1="100%" y1="0" x2="0" y2="100%" />
  </svg>
</div>

<style>
  .image {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--dark-gray);
    overflow: hidden;
    border-radius: 5px;
    background-color: rgb(240, 240, 240);
  }

  .cross {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    stroke: var(--dark-gray);
    stroke-width: 1;
    stroke-dasharray: 10, 10;
    opacity: 0;
  }

  .image--clickable {
    cursor: pointer;
  }

  .image--clickable:hover,
  .image--clickable:hover span {
    background-color: rgb(235, 235, 235);
  }

  span {
    background-color: rgb(240, 240, 240);
    position: relative;
    z-index: 1;
    display: inline-block;
    padding: 1rem;
    text-align: center;
    max-width: 20rem;
    font-size: 1rem;
    font-weight: normal;
  }
</style>
