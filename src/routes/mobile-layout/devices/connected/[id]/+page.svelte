<script lang="ts">
	import { page } from '$app/stores';
	import Device from '../../../../../components/wireframe/Device.svelte';
	import { useReturnButton } from '../../../../../stores';

	let returnButton = useReturnButton();
	returnButton.set({
		label: `Device ${$page.params.id}`,
		href: '/mobile-wireframe/devices'
	});
</script>

<Device id={$page.params.id} />
