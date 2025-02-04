<script lang="ts">
	import { ScrollArea } from 'bits-ui';
	import { useScrollLock } from '../stores';
	import { onMount, type Snippet } from 'svelte';

	const props: { children?: Snippet; onscroll?: (scrollValue: number) => void } = $props();

	const scrollLock = useScrollLock();

	const rootClasses = $derived(
		['scroll-area__root', $scrollLock ? 'scroll-area--locked' : undefined]
			.filter((it) => it)
			.join(' ')
	);

	onMount(() => {
		const viewport = document.querySelector('.scroll-area__viewport') as HTMLDivElement;

		if (viewport) {
			viewport.addEventListener('scroll', (event: any) => {
				props.onscroll?.(event.target.scrollTop || 0);
			});
		}
	});
</script>

<ScrollArea.Root class={rootClasses}>
	<ScrollArea.Viewport class="scroll-area__viewport" on:scroll={() => console.log('sdflkjh')}>
		<ScrollArea.Content>
			{@render props.children?.()}
		</ScrollArea.Content>
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar orientation="vertical">
		<ScrollArea.Thumb />
	</ScrollArea.Scrollbar>
	<ScrollArea.Scrollbar orientation="horizontal">
		<ScrollArea.Thumb />
	</ScrollArea.Scrollbar>
	<ScrollArea.Corner />
</ScrollArea.Root>

<style>
	:global(.scroll-area__root) {
		height: 100%;
		width: 100%;
	}

	:global(.scroll-area__viewport) {
		height: 100%;
		width: 100%;
	}

	:global(.scroll-area--locked .scroll-area__viewport) {
		overflow: hidden !important;
	}
</style>
