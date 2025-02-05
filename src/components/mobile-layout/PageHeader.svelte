<script lang="ts">
	import type { Snippet } from 'svelte';

	const props: {
		title?: string | Snippet;
		subTitle?: string | Snippet;
		description?: string | Snippet;
	} = $props();
</script>

<div class="page-header">
	{#if typeof props.title !== 'undefined'}
		<div class="page-header__title">
			{#if typeof props.title === 'string'}
				<h1>{props.title}</h1>
			{:else}
				{@render props.title()}
			{/if}
		</div>
	{/if}

	{#if typeof props.subTitle !== 'undefined'}
		<div class="page-header__subtitle">
			{#if typeof props.subTitle === 'string'}
				<h2>{props.subTitle}</h2>
			{:else}
				{@render props.subTitle()}
			{/if}
		</div>
	{/if}

	{#if typeof props.description !== 'undefined'}
		<div class="page-header__description">
			{#if typeof props.description === 'string'}
				<h2>{props.description}</h2>
			{:else}
				{@render props.description()}
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.page-header {
		display: flex;
		flex-direction: column;
		text-transform: lowercase;
		// gap: 0.5rem;

		&__title,
		&__subtitle,
		&__description {
			display: flex;
			align-items: center;
			justify-content: space-between;
			// line-height: 1;

			* {
				font-size: inherit;
			}
		}

		&__title {
			font-size: var(--big-font-size);
		}

		&__subtitle {
			font-size: var(--big-font-size);
			font-weight: normal;
			color: lightgray;
		}

		&__description {
			font-size: var(--main-font-size);
			font-weight: normal;
			color: lightgray;
		}
	}
</style>
