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

	let newId = createId();
	const { panelOverlaysSnippets } = useApp();

	const addPanel = () => {
		if (!children) return;
		newId = createId();

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
	};

	const removePanel = () => {
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

	onMount(() => {
		if (!children) return;

		addPanel();

		return () => {
			removePanel();
		};
	});
</script>
