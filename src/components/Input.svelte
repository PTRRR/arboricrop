<script lang="ts">
	export let type: 'text' | 'password' = 'text';
	export let value: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let onValue: ((value: string) => void) | undefined = undefined;
</script>

{#if type === 'password'}
	<input
		type="password"
		{placeholder}
		bind:value
		on:input={(e) => onValue?.(e.currentTarget.value)}
	/>
{:else}
	<input type="text" {placeholder} bind:value on:input={(e) => onValue?.(e.currentTarget.value)} />
{/if}

<style>
	input {
		font-family: inherit;
		font-size: inherit;
		padding: 1rem;
		border: solid 1px var(--black);
		background-color: var(--white);
		outline: none;
		max-width: 100%;
		resize: vertical;
		box-sizing: border-box;
	}
</style>
