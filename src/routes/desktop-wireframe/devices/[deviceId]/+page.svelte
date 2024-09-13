<script lang="ts">
	import { page } from '$app/stores';
	import { useDevices } from '../../../../stores';

	const devices = useDevices();

	$: device = $devices.find((it) => it.id === $page.params.deviceId);
</script>

<h1>Device {device?.id}</h1>
