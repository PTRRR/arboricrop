<script lang="ts">
	export let value: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let onValue: ((value: string) => void) | undefined = undefined;
</script>

<input type="text" {placeholder} bind:value on:input={(e) => onValue?.(e.currentTarget.value)} />

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
