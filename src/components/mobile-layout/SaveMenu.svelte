<script lang="ts">
	import ActionMenu from './ActionMenu.svelte';
	import Button from './Button.svelte';

	const { onsave, oncancel }: { onsave?: () => void; oncancel?: () => void } = $props();
</script>

<ActionMenu>
	<Button icon="cross" iconBackgroundColor="var(--dark-grey)" iconSize="large" onclick={oncancel} />
	<Button icon="add" iconSize="large" iconBackgroundColor="var(--accent-color)" onclick={onsave} />
</ActionMenu>
