<script lang="ts">
	import type { Snippet } from 'svelte';
	import StepSeparation from '../layout/StepSeparation.svelte';

	interface Props {
		children?: Snippet;
		label?: string;
	}

	const { children, label }: Props = $props();
</script>

<div class="section">
	<div class="section__inner">
		<StepSeparation {label} />
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	.section {
		padding: 0.1rem;

		&__inner {
			overflow: hidden;
			position: relative;
			background-color: var(--white);
			border-radius: 0.5rem;
			padding: 0.5rem;
		}
	}
</style>
