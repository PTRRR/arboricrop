<script lang="ts">
	import Button from './Button.svelte';

	export let saveLabel: string = 'Save';
	export let cancelLabel: string = 'Cancel';
	export let deleteLabel: string = 'Delete';

	export let onSave: (() => void) | undefined = undefined;
	export let onCancel: (() => void) | undefined = undefined;
	export let onDelete: (() => void) | undefined = undefined;
</script>

<div class="save-section">
	{#if onSave}
		<Button on:click={() => onSave?.()}>{saveLabel}</Button>
	{/if}

	{#if onCancel}
		<Button on:click={() => onCancel?.()}>{cancelLabel}</Button>
	{/if}

	{#if onDelete}
		<Button on:click={() => onDelete?.()}>{deleteLabel}</Button>
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
