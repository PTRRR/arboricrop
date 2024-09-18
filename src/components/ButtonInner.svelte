<script lang="ts">
	export let disabled: boolean = false;
	export let border: boolean = false;
	export let minimal: boolean = false;
	export let selected: boolean = false;
</script>

<div
	class="button-inner"
	class:button-inner--disabled={disabled}
	class:button-inner--border={border}
	class:button-inner--minimal={minimal}
	class:button-inner--selected={selected}
>
	<slot />
</div>

<style>
	.button-inner {
		color: black;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 1rem;
		text-align: center;
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
		opacity: 0.3;
	}

	.button-inner--minimal {
		padding: 0;
		border: none;
		background-color: transparent;
	}

	.button-inner--selected {
		background-color: var(--black);
		color: var(--light-gray);
	}

	.button-inner--minimal.button-inner--selected {
		background-color: transparent;
		color: var(--dark-gray);
		text-decoration: underline;
	}

	.button-inner--minimal:hover {
		background-color: transparent;
		text-decoration: underline;
	}
</style>
