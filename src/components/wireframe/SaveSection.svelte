<script lang="ts">
	import Button from './Button.svelte';

	export let onSave: (() => void) | undefined = undefined;
	export let onCancel: (() => void) | undefined = undefined;
	export let onDelete: (() => void) | undefined = undefined;
</script>

<div class="save-section">
	{#if onSave}
		<Button on:click={() => onSave?.()}>Save</Button>
	{/if}

	{#if onCancel}
		<Button on:click={() => onCancel?.()}>Cancel</Button>
	{/if}

	{#if onDelete}
		<Button on:click={() => onDelete?.()}>Delete</Button>
	{/if}
</div>

<style>
	.save-section {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}
</style>
