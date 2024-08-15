<script lang="ts">
	import { useReturnButton } from '../../../../stores';

	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Pair device',
		href: '/mobile-wireframe/devices'
	});
</script>

<h1>Pairing</h1>
