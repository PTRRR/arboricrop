<script lang="ts">
	import type { Field } from '../../utils/types';
	import Info from './Info.svelte';

	let id: HTMLInputElement;
	let name: HTMLInputElement;
	let type: HTMLInputElement;

	export let editable: boolean = false;
	export let field: Field;
	export const getValues = () => {
		return {
			id: id?.value || field.id,
			name: name.value,
			type: type.value
		};
	};
</script>

<div class="field-general-settings">
	{#if editable}
		<label for="">Name:</label>
		<input bind:this={name} type="text" placeholder="Field name" value={field.name} />
		<label for="">Type:</label>
		<input bind:this={type} type="text" placeholder="Field type" value={field.type} />
	{:else}
		<Info label="Name:" value={field.name || '-'} />
		<Info label="Type:" value={field.type || '-'} />
	{/if}
</div>

<style>
	.field-general-settings {
		display: flex;
		flex-direction: column;
		gap: var(--gap);
	}

	input {
		font-family: inherit;
		font-size: inherit;
		padding: 1rem;
		border: solid 1px var(--black);
		background-color: var(--white);
		outline: none;
		max-width: 100%;
		resize: vertical;
	}
</style>
