<script lang="ts">
	import type { Snippet } from 'svelte';

	const props: { children: Snippet; href?: string; imageUrl?: string } = $props();
</script>

{#snippet cardInner()}
	<div class="card__inner">
		{#if props.imageUrl}
			<div class="card__image">
				<img src={props.imageUrl} alt="" />
			</div>
		{/if}
		{@render props.children()}
	</div>
{/snippet}

{#if props.href}
	<a class="card" href={props.href}>
		{@render cardInner()}
	</a>
{:else}
	<div class="card">
		{@render cardInner()}
	</div>
{/if}

<style lang="scss">
	.card {
		text-decoration: none;
		color: black;
		background-color: lightgray;
		padding: 0.5rem;
		border-radius: 5px;
		overflow: hidden;
		font-size: var(--main-font-size);

		&:hover {
			background-color: grey;
		}

		&__inner {
			display: flex;
			align-items: center;
			gap: 1rem;
		}

		&__image {
			margin: -0.5rem 0 -0.5rem -0.5rem;
			width: 5rem;
			height: 5rem;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
	}
</style>
