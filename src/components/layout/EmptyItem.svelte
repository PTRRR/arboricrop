<script lang="ts">
	interface Props {
		label?: string;
	}

	const { label }: Props = $props();
</script>

<div class="empty-item">
	{label || 'Empty...'}
</div>

<style lang="scss">
	.empty-item {
		width: 100%;
		aspect-ratio: 3;
		background-color: var(--light-grey);
		border-radius: 0.8rem;
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--dark-grey);
		max-height: 10rem;
	}
</style>
