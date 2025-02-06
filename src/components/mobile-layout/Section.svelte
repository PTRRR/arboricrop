<script lang="ts">
	import StepSeparation, { type StepSeparationAction } from './StepSeparation.svelte';
	import Spacer from '../Spacer.svelte';
	import type { Snippet } from 'svelte';

	const props: {
		label?: string;
		description?: string;
		children?: Snippet;
		actions?: StepSeparationAction[];
	} = $props();
</script>

<section class="section">
	<StepSeparation label={props.label} description={props.description} actions={props.actions} />
	{@render props.children?.()}
	<Spacer size="calc(var(--gap) * 3)" />
</section>

<style>
	.section {
		display: flex;
		flex-direction: column;
		gap: var(--main-gap);
	}
</style>
