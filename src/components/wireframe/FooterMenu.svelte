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
		padding: 1rem;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		box-sizing: border-box;
		gap: 0.5rem;
	}
</style>
