<script lang="ts">
	import Button from './Button.svelte';

	const props: {
		label?: string | number;
		description?: string | undefined;
		actions?: { label: string; onclick?: () => void }[];
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

	{#if props.description}
		<div class="step-separation__description">{props.description}</div>
	{/if}
</div>

<style lang="scss">
	.step-separation {
		width: 100%;
		color: var(--black);

		&__heading {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
		}

		&__label {
			font-weight: 500;
			text-transform: lowercase;
			color: inherit;
			font-size: var(--big-font-size);
		}

		&__description {
			font-weight: normal;
			text-transform: lowercase;
			color: var(--grey);
			font-size: var(--main-font-size);
		}
	}
</style>
