<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import type { IconName } from '../mobile-layout/Icon.svelte';
	import Stack from '../desktop/Stack.svelte';
	import { getCss } from '../../utils/css';

	export type StepSeparationAction = {
		label?: string | Snippet;
		onclick?: () => void;
		href?: string;
		icon?: IconName;
		iconColor?: string;
		iconOrder?: 'inverted';
		padding?: boolean | string;
		backgroundColor?: string;
	};

	const props: {
		label?: string | number | Snippet;
		description?: string | undefined;
		actions?: StepSeparationAction[];
		border?: boolean;
		style?: Partial<CSSStyleDeclaration>;
	} = $props();

	const computedStyle = $derived(getCss({ ...(props.style || {}) }));
</script>

<div class="step-separation" class:step-separation--border={props.border} style={computedStyle}>
	{#if props.label || typeof props.label === 'number'}
		<div class="step-separation__heading">
			<div class="step-separation__label">
				{#if typeof props.label === 'string' || typeof props.label === 'number'}
					{props.label}
				{:else}
					{@render props.label()}
				{/if}
			</div>

			<Stack direction="horizontal" gap="0.5rem" alignItems="center">
				{#each props.actions || [] as action}
					{#if action.label}
						<Button
							onclick={action.onclick}
							icon={action.icon}
							iconColor={action.iconColor}
							iconOrder={action.iconOrder}
							backgroundColor={action.backgroundColor}
							padding={action.padding}
							href={action.href}
						>
							{#if typeof action.label === 'string'}
								{action.label}
							{:else}
								{@render action.label()}
							{/if}
						</Button>
					{:else}
						<Button
							onclick={action.onclick}
							icon={action.icon}
							iconColor={action.iconColor}
							iconOrder={action.iconOrder}
							href={action.href}
						/>
					{/if}
				{/each}
			</Stack>
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

		&--border {
			padding-top: 1rem;
			border-top: solid 1px var(--dark-grey);
		}

		&__heading {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		&__label {
			width: 100%;
			font-weight: 500;
			text-transform: lowercase;
			color: var(--dark-grey);
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
