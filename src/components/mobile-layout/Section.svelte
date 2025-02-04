<script lang="ts">
	import StepSeparation from './StepSeparation.svelte';
	import Spacer from '../Spacer.svelte';
	import type { Snippet } from 'svelte';

	const props: {
		label?: string;
		buttons?: { label: string; href?: string; onClick?: () => void }[];
		children?: Snippet;
	} = $props();
</script>

<section class="section">
	<StepSeparation label={props.label} />
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
