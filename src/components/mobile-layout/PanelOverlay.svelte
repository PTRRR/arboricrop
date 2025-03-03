<script module lang="ts">
	let idlTimeout: NodeJS.Timeout | undefined = undefined;
	let unmountIds: string[] = [];
	let index = 0;
</script>

<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { useApp } from '../../stores';
	import { createId } from '@paralleldrive/cuid2';
	const { children, hidden = $bindable(false) }: { children?: Snippet; hidden?: boolean } =
		$props();

	const { panelOverlaysSnippets } = useApp();

	onMount(() => {
		if (!children) return;

		const newId = createId();
		$panelOverlaysSnippets = [
			...$panelOverlaysSnippets,
			{ id: newId, state: 'mount', snippet: children, index }
		];

		setTimeout(() => {
			$panelOverlaysSnippets = $panelOverlaysSnippets.map((it) =>
				it.id === newId ? { ...it, state: 'mounting' } : it
			);
		}, 50);

		index++;

		return () => {
			clearTimeout(idlTimeout);

			$panelOverlaysSnippets = $panelOverlaysSnippets.map((it) =>
				it.id === newId ? { ...it, state: 'unmounting' } : it
			);

			unmountIds.push(newId);

			idlTimeout = setTimeout(() => {
				$panelOverlaysSnippets = $panelOverlaysSnippets.filter((it) => !unmountIds.includes(it.id));
				unmountIds = [];
			}, 2000);
		};
	});
</script>
