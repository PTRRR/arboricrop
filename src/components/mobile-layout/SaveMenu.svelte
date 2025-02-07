<script lang="ts">
	import ActionMenu from './ActionMenu.svelte';
	import Button from './Button.svelte';

	const {
		onsave,
		oncancel,
		hidden
	}: { onsave?: () => void; oncancel?: () => void; hidden?: boolean } = $props();
</script>

<ActionMenu {hidden}>
	{#if oncancel}
		<Button
			icon="cross"
			iconBackgroundColor="var(--dark-grey)"
			iconSize="large"
			onclick={oncancel}
		/>
	{/if}

	{#if onsave}
		<Button icon="check" iconSize="large" onclick={onsave} />
	{/if}
</ActionMenu>
