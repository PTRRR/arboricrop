<script lang="ts">
	export let href: string | undefined = undefined;
</script>

<svelte:element this={href ? 'a' : 'div'} {href} class="card" class:card--clickable={href}>
	<div class="card__header">
		{#if $$slots.title}
			<div class="card__header-title">
				<slot name="title" data-card-title />
			</div>
		{/if}

		{#if $$slots.subTitle}
			<div class="card__header-sub-title">
				<slot name="subTitle" />
			</div>
		{/if}
	</div>
	<slot />
</svelte:element>

<style>
	.card {
		padding: 0.8rem 1rem;
		box-sizing: border-box;
		border: solid 1px var(--black);
		border-radius: 1.5rem;
		display: block;
	}

	a {
		text-decoration: none;
		color: var(--black);
	}

	.card--clickable {
		cursor: pointer;
	}

	.card--clickable:hover {
		background-color: var(--dark-gray);
	}

	:global(.card--clickable:hover .card__header-sub-title > *) {
		color: var(--black);
	}

	.card__header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	:global(.card__header-title > *) {
		font-size: 1.2rem;
		font-family: inherit;
	}

	:global(.card__header-sub-title > *) {
		font-size: 0.9rem;
		color: var(--dark-gray);
	}
</style>
