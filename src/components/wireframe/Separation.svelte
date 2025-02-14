<script lang="ts">
	import Spacer from '../Spacer.svelte';
	import Line from './Line.svelte';
	import Button from './Button.svelte';

	export let title: string | undefined = undefined;
	export let buttons: { label: string; href?: string; onClick?: () => void }[] = [];
</script>

<div class="separation">
	<div class="separation__content">
		{#if title}
			<span class="separation__title">{title}</span>
		{/if}

		<div class="separation__buttons">
			{#each buttons as button}
				<Button minimal on:click={() => button.onClick?.()} href={button.href}>
					{button.label}
				</Button>
			{/each}
		</div>
	</div>
	<Line color="var(--dark-gray)" />
	<Spacer />
</div>

<style>
	.separation {
		width: 100%;
	}

	.separation__title {
		display: block;
		color: var(--dark-gray);
		margin-bottom: var(--gap);
		text-align: left;
	}

	.separation__content {
		display: flex;
		justify-content: space-between;
	}

	.separation__buttons {
		display: flex;
		gap: 1em;
	}
</style>
