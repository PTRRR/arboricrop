<script lang="ts">
	type A = $$Generic;
	export let actions: A[] = [];
</script>

<div class="main-menu">
	<slot />
	<div class="main-menu__actions">
		{#each actions as action}
			<slot name="action" {action} />
		{/each}
	</div>
</div>

<style>
	.main-menu {
		position: absolute;
		padding: 1.5rem;
		top: 2rem;
		left: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.main-menu__actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
