<script lang="ts">
	import Mobile from '../../components/Mobile.svelte';
	import { iphone } from '../../utils/phones';
</script>

<Mobile phone={iphone}>
	<div class="mobile-wireframe">
		<slot />
	</div>
</Mobile>

<style>
	.mobile-wireframe {
		width: 100%;
		height: 100%;
		background-color: var(--light-gray);
	}
</style>
