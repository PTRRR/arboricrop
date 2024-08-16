<script lang="ts">
	import { useReturnButton } from '../../../stores';

	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Getting Started',
		href: '/mobile-wireframe'
	});
</script>

<h1>Getting Started</h1>
