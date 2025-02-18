<script lang="ts">
	interface Props {
		pages?: number;
		onselect?: (pageIndex: number) => void;
	}

	const { pages = 0, onselect }: Props = $props();
	let currentPage = $state(0);
</script>

<div class="pagination">
	{#each { length: pages } as _, i}
		<button
			class="pagination__page"
			class:pagination__page--selected={currentPage === i}
			onclick={() => {
				currentPage = i;
				onselect?.(currentPage);
			}}
		>
			{i + 1}
		</button>
	{/each}
</div>

<style lang="scss">
	.pagination {
		display: flex;
		gap: 10px;

		&__page {
			width: 30px;
			height: 30px;
			background-color: var(--grey);
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 5px;
			border: none;
			font-family: inherit;
			font-size: inherit;
			font-weight: inherit;
			cursor: pointer;

			&--selected {
				background-color: var(--dark-grey);
			}

			&:hover {
				background-color: var(--dark-grey);
			}
		}
	}
</style>
