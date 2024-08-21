<div class="centered-wrapper">
	<slot />
</div>

<style>
	.centered-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		flex: 1 1 auto;
		text-align: center;
	}
</style>
