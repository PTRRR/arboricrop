<script lang="ts">
	import type { Snippet } from 'svelte';
	import Stack from './Stack.svelte';
	import Section from './Section.svelte';

	interface Props {
		children?: Snippet;
		label?: string | Snippet;
		actionPanel?: Snippet;
	}

	const { children, actionPanel, label }: Props = $props();
	const contentBlurred = $derived(!!actionPanel);
</script>

<Stack style={{ width: '100%', position: 'relative' }} direction="horizontal">
	{#if children}
		<div class="page-layout__content" class:page-layout--blurred={contentBlurred}>
			{@render children()}
		</div>
	{/if}

	{#if actionPanel}
		<Section
			{label}
			width="40%"
			height="100%"
			backgroundColor="var(--light-grey)"
			style={{
				position: 'absolute',
				right: '0',
				top: '0'
			}}
			innerStyle={{ overflow: 'auto' }}
		>
			{@render actionPanel()}
		</Section>
	{/if}
</Stack>

<style lang="scss">
	.page-layout {
		&--blurred {
			opacity: 0.3;
			pointer-events: none;
		}

		&__content {
			width: 100%;
		}
	}
</style>
