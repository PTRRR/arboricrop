<script lang="ts">
	import { getCss } from '../../utils/css';

	export let direction: 'horizontal' | 'vertical' = 'horizontal';
	export let size: string | undefined = undefined;
</script>

<div
	class="line"
	class:line--horizontal={direction === 'horizontal'}
	class:line--vertical={direction === 'vertical'}
	style={getCss({
		...(direction === 'horizontal' && { height: size || '' }),
		...(direction === 'vertical' && { width: size || '' })
	})}
></div>

<style>
	.line--horizontal {
		border-top: solid black 1px;
	}

	.line--vertical {
		border-top: solid black 1px;
	}
</style>
