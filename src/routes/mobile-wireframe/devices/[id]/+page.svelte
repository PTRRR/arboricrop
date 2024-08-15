<script lang="ts">
	import { page } from '$app/stores';
	import { useReturnButton } from '../../../../stores';

	let returnButton = useReturnButton();
	returnButton.set({
		label: `Device ${$page.params.id}`,
		href: '/mobile-wireframe/devices'
	});
</script>

<h1>{$page.params.id}</h1>
