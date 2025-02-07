<script lang="ts">
	export type Status = 'error' | 'warning' | 'normal' | 'success' | 'neutral';
	const { status = 'normal' }: { status: Status } = $props();
</script>

<div
	class="status-dot"
	class:status-dot--normal={status === 'normal'}
	class:status-dot--error={status === 'error'}
	class:status-dot--warning={status === 'warning'}
	class:status-dot--success={status === 'success'}
	class:status-dot--neutral={status === 'neutral'}
></div>

<style lang="scss">
	.status-dot {
		width: 10px;
		height: 10px;
		border-radius: 100%;
		flex: 0 0 auto;

		&--success {
			background-color: var(--green);
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

		&--neutral {
			background-color: var(--grey);
		}
	}
</style>
