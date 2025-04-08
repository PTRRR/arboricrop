<script lang="ts">
	import type { Snippet } from 'svelte';

	const props: {
		preTitle?: string | Snippet;
		preTitleHref?: string;
		title?: string | Snippet;
		subTitle?: string | Snippet;
		description?: string | Snippet;
	} = $props();
</script>

<div class="page-header">
	{#if typeof props.preTitle !== 'undefined'}
		{#if props.preTitleHref}
			<a class="page-header__pre-title" href={props.preTitleHref}>
				{#if typeof props.preTitle === 'string'}
					<span>{props.preTitle}</span>
				{:else}
					{@render props.preTitle()}
				{/if}
			</a>
		{:else}
			<div class="page-header__pre-title">
				{#if typeof props.preTitle === 'string'}
					<span>{props.preTitle}</span>
				{:else}
					{@render props.preTitle()}
				{/if}
			</div>
		{/if}
	{/if}

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

		&__pre-title,
		&__title,
		&__subtitle,
		&__description {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: 1rem;
			margin: 0;
			line-height: 1;

			* {
				font-size: inherit;
			}
		}

		&__pre-title {
			font-size: var(--main-font-size);
			font-weight: 400;
			color: black;
			// font-style: italic;
		}

		&__title {
			font-size: var(--big-font-size);
			line-height: 1;
		}

		&__subtitle {
			font-size: var(--mid-font-size);
			font-weight: 500;
			color: var(--dark-grey);
			margin-top: 0.5rem;
		}

		&__description {
			font-size: var(--main-font-size);
			font-weight: 500;
			color: var(--grey);
			margin-top: 0.5rem;
		}
	}
</style>
