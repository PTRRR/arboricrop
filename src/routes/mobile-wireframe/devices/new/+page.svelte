<script lang="ts">
	import Device from '../../../../components/wireframe/Device.svelte';
	import { useReturnButton } from '../../../../stores';

	const returnButton = useReturnButton();
	returnButton.set({
		label: `New Device`,
		href: '/mobile-wireframe'
	});
</script>

<Device isNewDevice />
