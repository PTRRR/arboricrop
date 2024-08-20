<script lang="ts">
	import Spacer from '../../../components/Spacer.svelte';
	import Image from '../../../components/wireframe/Image.svelte';
	import Pagination from '../../../components/wireframe/Pagination.svelte';
	import { useReturnButton } from '../../../stores';

	const returnButton = useReturnButton();
	returnButton.set({
		label: 'Getting Started',
		href: '/mobile-wireframe'
	});
</script>

<div class="getting-started">
	<Image ratio={1} placeholder="Slides / animations" />
	<Spacer />
	<Pagination />
	<Spacer />
	<Spacer />
	<p>Description...</p>
</div>

<style>
	.getting-started {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1 1 auto;
		text-align: center;
	}
</style>
