<script lang="ts">
	export let count: number = 4;
</script>

<div class="pagination">
	{#each { length: count } as _}
		<div class="pagination__bullet"></div>
	{/each}
</div>

<style>
	.pagination {
		display: flex;
		gap: var(--gap);
	}

	.pagination__bullet {
		width: 5px;
		height: 5px;
		border-radius: 100%;
		background-color: var(--dark-gray);
	}
</style>
