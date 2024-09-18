<script lang="ts">
	import Separation from '../Separation.svelte';
	import Spacer from '../Spacer.svelte';

	export let title: string | undefined = undefined;
	export let buttons: { label: string; href?: string; onClick?: () => void }[] = [];
</script>

<section class="section">
	<Separation {title} {buttons} />
	<slot />
	<Spacer size="calc(var(--gap) * 3)" />
</section>

<style>
	.section {
		display: flex;
		flex-direction: column;
	}
</style>
