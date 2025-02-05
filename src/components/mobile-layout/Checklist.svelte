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

<style lang="scss">
	.checklist {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		&::after {
			content: '';
			display: block;
			position: absolute;
			top: 0.75rem;
			left: 0.75rem;
			height: calc(100% - 1rem);
			border-left: solid 1px var(--dark-gray);
		}

		&__point {
			display: flex;
			gap: 1rem;
			align-items: center;
		}

		&__checkbox {
			position: relative;
			width: 1.5rem;
			height: 1.5rem;
			border-radius: 50%;
			background-color: var(--light-gray);
			z-index: 10;
		}

		&__label {
			font-weight: normal;
			height: var(--main-font-size);
			font-size: var(--main-font-size);
			line-height: 1;
		}

		&--checked {
			background-color: var(--accent-color);
		}
	}
</style>
