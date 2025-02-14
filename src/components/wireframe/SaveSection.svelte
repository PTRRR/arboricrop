<script lang="ts">
	import Button from './Button.svelte';

	export let saveLabel: string = 'Save';
	export let cancelLabel: string = 'Cancel';
	export let deleteLabel: string = 'Delete';
	export let saveDisabled: boolean = false;
	export let cancelDisabled: boolean = false;
	export let deleteDisabled: boolean = false;

	export let onSave: (() => void) | undefined = undefined;
	export let onCancel: (() => void) | undefined = undefined;
	export let onDelete: (() => void) | undefined = undefined;
</script>

<div class="save-section">
	{#if onSave}
		<Button on:click={() => onSave?.()} disabled={saveDisabled}>{saveLabel}</Button>
	{/if}

	{#if onCancel}
		<Button on:click={() => onCancel?.()} disabled={cancelDisabled}>{cancelLabel}</Button>
	{/if}

	{#if onDelete}
		<Button on:click={() => onDelete?.()} disabled={deleteDisabled}>{deleteLabel}</Button>
	{/if}
</div>

<style>
	.save-section {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}
</style>
