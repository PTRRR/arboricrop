<script lang="ts">
	import { ScrollArea } from 'bits-ui';
</script>

<ScrollArea.Root class="scroll-area__root">
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
</style>
