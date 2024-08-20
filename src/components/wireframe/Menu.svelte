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
		padding: var(--main-padding);
		top: var(--main-padding);
		left: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		z-index: 5;
	}

	.main-menu::before {
		z-index: -1;
		content: '';
		display: block;
		position: absolute;
		top: calc(var(--main-padding) * -1);
		left: 0;
		width: 100%;
		height: calc(100% + var(--main-padding));
		background-image: linear-gradient(
			var(--light-gray),
			var(--light-gray),
			var(--light-gray),
			transparent
		);
	}

	.main-menu__actions {
		display: flex;
		align-items: center;
		gap: var(--gap);
	}

	@media screen and (max-width: 700px) {
		.main-menu {
			top: 0;
		}
	}
</style>
