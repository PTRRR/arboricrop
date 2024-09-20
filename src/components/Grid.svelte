<script lang="ts">
	import { getCss } from '../utils/css';

	export let columns: number = 1;
</script>

<div
	class="grid"
	style={getCss({
		'--columns': columns.toString()
	})}
>
	<slot />
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		gap: var(--gap);
		align-items: center;
	}
</style>
