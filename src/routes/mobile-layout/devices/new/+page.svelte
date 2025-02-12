<script lang="ts">
	import { createId } from '@paralleldrive/cuid2';
	import Section from '../../../../components/mobile-layout/Section.svelte';
	import {
		useDeviceIllustration,
		useDevices,
		useNavigationHistory,
		useReturnButton
	} from '../../../../stores';
	import type { Device } from '../../../../utils/types';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';
	import TextInput from '../../../../components/layout/TextInput.svelte';
	import PageHeader from '../../../../components/mobile-layout/PageHeader.svelte';
	import SaveMenu from '../../../../components/mobile-layout/SaveMenu.svelte';

	export let data: PageData;

	const { setVisibility, reset, setUsb, setBlink } = useDeviceIllustration();
	const { devices } = useDevices();
	const returnButton = useReturnButton();
	const { preventNavigationHistory } = useNavigationHistory();

	returnButton.set({
		label: `Field`,
		backHref: `/mobile-layout/fields/${data.field}`
	});

	let device: Device = {
		id: `dev-${createId()}`,
		name: '',
		medias: [],
		status: 'unactive',
		firmwareVersion: 'v1.0.0',
		fieldId: data.field || undefined,
		battery: Math.floor(Math.random() * 50 + 50)
	};

	onMount(() => {
		setVisibility(true);
		setUsb(true);
		setBlink(true);
		return () => reset();
	});
</script>

<PageHeader title="New Device" />
<Section>
	<TextInput label="id" defaultValue={device.id} readonly />
	<TextInput label="name" autoFocus onvalue={(value) => (device.name = value)} />
</Section>
<SaveMenu
	onsave={() => {
		$preventNavigationHistory = true;
		devices.set([...$devices, device]);
		goto(`/mobile-layout/devices/${device.id}?connected=true`);
	}}
/>
