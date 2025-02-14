<script lang="ts">
	export let points: { label: string; checked: boolean }[] = [];
</script>

<div class="checklist">
	{#each points as point}
		<div class="checklist__point">
			<div class="checklist__checkbox" class:checklist--checked={point.checked}></div>
			<div class="checklist__label">
				{point.label}
			</div>
		</div>
	{/each}
</div>

<style>
	.checklist {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.checklist::after {
		content: '';
		display: block;
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		height: calc(100% - 1rem);
		border-left: solid 1px var(--dark-gray);
	}

	.checklist__point {
		display: flex;
		gap: 0.5rem;
	}

	.checklist__checkbox {
		position: relative;
		width: 1rem;
		height: 1rem;
		border: solid 1px var(--dark-gray);
		border-radius: 50%;
		background-color: var(--light-gray);
		z-index: 10;
	}

	.checklist--checked {
		background-color: var(--dark-gray);
	}
</style>
