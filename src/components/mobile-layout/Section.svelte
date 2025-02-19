<script lang="ts">
	import StepSeparation, { type StepSeparationAction } from '../layout/StepSeparation.svelte';
	import Spacer from '../Spacer.svelte';
	import type { Snippet } from 'svelte';

	const props: {
		label?: string;
		description?: string;
		children?: Snippet;
		actions?: StepSeparationAction[];
		hidden?: boolean;
	} = $props();
</script>

<section class="section" class:section--hidden={props.hidden}>
	{#if props.label || props.description || props.actions}
		<StepSeparation label={props.label} description={props.description} actions={props.actions} />
	{/if}
	{@render props.children?.()}
	<Spacer size="calc(var(--gap) * 3)" />
</section>

<style lang="scss">
	.section {
		display: flex;
		flex-direction: column;
		gap: var(--main-gap);

		&--hidden {
			display: none;
		}
	}
</style>
