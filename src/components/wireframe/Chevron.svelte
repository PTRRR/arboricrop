<script lang="ts">
	export let direction: 'up' | 'left' | 'right' | 'down' = 'left';
</script>

<div
	class="chevron"
	class:chevron--up={direction === 'up'}
	class:chevron--left={direction === 'left'}
	class:chevron--right={direction === 'right'}
	class:chevron--down={direction === 'down'}
></div>

<style>
	.chevron {
		position: relative;
		width: 1rem;
		height: 1rem;
	}

	.chevron::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100%;
		height: 100%;
		border-top: solid 1px black;
		border-left: solid 1px black;
	}

	.chevron--up::before {
		transform: translate(-50%, -50%) rotate(45deg);
	}

	.chevron--left::before {
		transform: translate(-50%, -50%) rotate(-45deg);
	}

	.chevron--right::before {
		transform: translate(-50%, -50%) rotate(135deg);
	}

	.chevron--down::before {
		transform: translate(-50%, -50%) rotate(-135deg);
	}
</style>
