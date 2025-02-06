<script lang="ts">
	import Button from './Button.svelte';
	import type { IconName } from './Icon.svelte';

	export type StepSeparationAction = {
		label?: string;
		onclick?: () => void;
		icon?: IconName;
		iconColor?: string;
	};

	const props: {
		label?: string | number;
		description?: string | undefined;
		actions?: StepSeparationAction[];
	} = $props();
</script>

<div class="step-separation">
	{#if props.label || typeof props.label === 'number'}
		<div class="step-separation__heading">
			<div class="step-separation__label">{props.label}</div>
			{#each props.actions || [] as action}
				{#if action.label}
					<Button onclick={action.onclick} icon={action.icon} iconColor={action.iconColor}>
						{action.label}
					</Button>
				{:else}
					<Button onclick={action.onclick} icon={action.icon} iconColor={action.iconColor}></Button>
				{/if}
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
			color: var(--grey);
			font-size: var(--mid-font-size);
		}

		&__description {
			font-weight: normal;
			text-transform: lowercase;
			color: var(--black);
			font-size: var(--main-font-size);
		}
	}
</style>
