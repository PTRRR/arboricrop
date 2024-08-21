<script lang="ts">
	type A = $$Generic;
	export let actions: A[] = [];
</script>

<div class="footer-menu">
	{#each actions as action}
		<slot name="action" {action} />
	{/each}
</div>

<style>
	.footer-menu {
		position: absolute;
		padding: var(--main-padding);
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		flex-direction: row-reverse;
		box-sizing: border-box;
		gap: var(--gap);
		z-index: 5;
		pointer-events: none;
	}

	:global(.footer-menu .button) {
		pointer-events: all;
	}

	/* .footer-menu::before {
		z-index: -1;
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: linear-gradient(transparent, var(--light-gray), var(--light-gray));
	} */
</style>
