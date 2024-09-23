<script lang="ts">
	import { getCss } from '../utils/css';

	export let width: string = '30rem';
	export let maxWidth: string = 'calc(100svw - 4rem)';
</script>

<div
	class="dialog"
	style={getCss({
		'--width': width,
		'--max-width': maxWidth
	})}
>
	<slot />
</div>

<style>
	.dialog {
		width: var(--width);
		max-width: var(--max-width);
	}
</style>
