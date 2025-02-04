<script lang="ts">
  import Button from './Button.svelte';

  const props: {
    label?: string | number;
    actions?: { label: string; onclick: () => void }[];
  } = $props();
</script>

<div class="step-separation">
  {#if props.label || typeof props.label === 'number'}
    <div class="step-separation__heading">
      <div class="step-separation__label">{props.label}</div>
      {#each props.actions || [] as action}
        <Button onclick={action.onclick}>
          {action.label}
        </Button>
      {/each}
    </div>
  {/if}
  <div class="step-separation__line"></div>
</div>

<style lang="scss">
  .step-separation {
    width: 100%;
    color: rgb(200, 200, 200);

    &__heading {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    &__label {
      font-weight: normal;
      text-transform: lowercase;
      color: inherit;
    }

    &__line {
      width: 100%;
      border-top: solid 1px;
      border-color: inherit;
      margin-top: calc(var(--main-gap) * 0.5);
    }
  }
</style>
