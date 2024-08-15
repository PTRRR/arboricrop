<script lang="ts">
	import { getCss } from '../utils/css';

	export let direction: 'horizontal' | 'vertical' = 'horizontal';
	export let size: string | undefined = undefined;
</script>

<div
	class="spacer"
	class:spacer--horizontal={direction === 'horizontal'}
	class:spacer--vertical={direction === 'vertical'}
	style={getCss({
		...(direction === 'horizontal' && { height: size || '' }),
		...(direction === 'vertical' && { width: size || '' })
	})}
></div>

<style></style>
