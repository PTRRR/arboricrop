<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children,
		href,
		imageUrl,
		background = true
	}: {
		children: Snippet;
		href?: string;
		imageUrl?: string;
		background?: boolean;
	} = $props();
</script>

{#snippet cardInner()}
	<div class="card__inner">
		{#if imageUrl}
			<div class="card__image">
				<img src={imageUrl} alt="" />
			</div>
		{/if}
		{@render children()}
	</div>
{/snippet}

{#if href}
	<a class="card" {href} class:card--background={background}>
		{@render cardInner()}
	</a>
{:else}
	<div class="card" class:card--background={background}>
		{@render cardInner()}
	</div>
{/if}

<style lang="scss">
	.card {
		display: block;
		text-decoration: none;
		color: var(--black);
		padding: 0.5rem;
		border-radius: 5px;
		overflow: hidden;
		font-size: var(--main-font-size);

		&:hover {
			background-color: var(--light-grey);
		}

		&--background {
			background-color: var(--light-grey);

			&:hover {
				background-color: var(--grey);
			}
		}

		&__inner {
			display: flex;
			align-items: center;
			gap: 1rem;
		}

		&__image {
			margin: -0.5rem 0 -0.5rem -0.5rem;
			width: 6rem;
			height: 6rem;
			border-radius: 5px;
			overflow: hidden;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
	}
</style>
