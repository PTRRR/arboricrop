<script module lang="ts">
	let idlTimeout: NodeJS.Timeout | undefined = undefined;
	let unmountIds: string[] = [];
</script>

<script lang="ts">
	import { onMount, tick, type Snippet } from 'svelte';
	import { useApp } from '../../stores';
	import { createId } from '@paralleldrive/cuid2';
	const { children, hidden = $bindable(false) }: { children?: Snippet; hidden?: boolean } =
		$props();
	const { actionMenuSnippets } = useApp();

	onMount(() => {
		if (!children) return;
		const newId = createId();
		$actionMenuSnippets = [
			...$actionMenuSnippets,
			{ id: newId, state: 'mount', snippet: children }
		];

		setTimeout(() => {
			$actionMenuSnippets = $actionMenuSnippets.map((it) =>
				it.id === newId ? { ...it, state: 'mounting' } : it
			);
		}, 50);

		return () => {
			clearTimeout(idlTimeout);

			$actionMenuSnippets = $actionMenuSnippets.map((it) =>
				it.id === newId ? { ...it, state: 'unmounting' } : it
			);

			unmountIds.push(newId);

			idlTimeout = setTimeout(() => {
				$actionMenuSnippets = $actionMenuSnippets.filter((it) => !unmountIds.includes(it.id));
				unmountIds = [];
			}, 5000);
		};
	});
</script>
