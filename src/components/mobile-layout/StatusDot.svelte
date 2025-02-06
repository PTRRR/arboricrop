<script lang="ts">
	const { status = 'normal' }: { status: 'error' | 'warning' | 'normal' | 'success' } = $props();
</script>

<div
	class="status-dot"
	class:status-dot--normal={status === 'normal'}
	class:status-dot--error={status === 'error'}
	class:status-dot--warning={status === 'warning'}
	class:status-dot--success={status === 'success'}
></div>

<style lang="scss">
	.status-dot {
		width: 10px;
		height: 10px;
		border-radius: 100%;
		flex: 0 0 auto;

		&--success {
			background-color: var(--accent-color);
		}

		&--normal {
			background-color: var(--blue);
		}

		&--error {
			background-color: var(--red);
		}

		&--warning {
			background-color: var(--yellow);
		}
	}
</style>
