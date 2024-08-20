<script lang="ts">
	import Spacer from '../Spacer.svelte';
	import Line from './Line.svelte';

	export let title: string | undefined = undefined;
</script>

<div class="separation">
	{#if title}
		<span class="separation__title">{title}</span>
	{/if}
	<Line color="var(--dark-gray)" />
	<Spacer size="calc(var(--gap) * 0.5)" />
</div>

<style>
	.separation__title {
		display: block;
		color: var(--dark-gray);
		margin-bottom: var(--gap);
	}
</style>
