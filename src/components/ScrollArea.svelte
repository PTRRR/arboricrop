<script lang="ts">
	import { ScrollArea } from 'bits-ui';
	import { useScrollLock } from '../stores';

	const scrollLock = useScrollLock();

	$: rootClasses = ['scroll-area__root', $scrollLock ? 'scroll-area--locked' : undefined]
		.filter((it) => it)
		.join(' ');
</script>

<ScrollArea.Root class={rootClasses}>
	<ScrollArea.Viewport class="scroll-area__viewport">
		<ScrollArea.Content>
			<slot />
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
