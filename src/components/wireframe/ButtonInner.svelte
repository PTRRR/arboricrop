<script lang="ts">
	export let disabled: boolean = false;
	export let border: boolean = false;
</script>

<div
	class="button-inner"
	class:button-inner--disabled={disabled}
	class:button-inner--border={border}
>
	<slot />
</div>

<style>
	.button-inner {
		color: black;
		font-family: Arial, Helvetica, sans-serif;
		cursor: pointer;
		width: 100%;
		height: 100%;
		padding: 0.8rem 1rem;
		border: solid 1px var(--black);
		border-radius: 3rem;
		background-color: var(--white);
	}

	.button-inner:hover {
		background-color: var(--dark-gray);
	}

	.button-inner--disabled {
		pointer-events: none;
		cursor: not-allowed;
	}
</style>
