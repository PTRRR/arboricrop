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
	import PageHeader from '../../../../components/layout/PageHeader.svelte';
	import SaveMenu from '../../../../components/mobile-layout/SaveMenu.svelte';
	import ActionMenu from '../../../../components/mobile-layout/ActionMenu.svelte';
	import ActionButton from '../../../../components/mobile-layout/ActionButton.svelte';

	export let data: PageData;

	const { setVisibility, reset, setUsb, setBlink } = useDeviceIllustration();
	const { devices } = useDevices();
	const returnButton = useReturnButton();
	const { preventNavigationHistory } = useNavigationHistory();

	returnButton.set({
		label: `Trial`,
		backHref: `${data.baseUrl}/trials/${data.trial}`
	});

	let device: Device = {
		id: `dev-${createId()}`,
		name: '',
		medias: [],
		status: 'unactive',
		firmwareVersion: 'v1.0.0',
		fieldId: data.field || undefined,
		parentId: data.trial || undefined,
		battery: Math.floor(Math.random() * 50 + 50)
	};

	onMount(() => {
		setVisibility(true);
		setUsb(true);
		setBlink(true);
		return () => reset();
	});
</script>

{#if device.name}
	<ActionMenu>
		<ActionButton
			icon="check"
			color="var(--white)"
			backgroundColor="var(--green)"
			iconBackgroundColor="var(--green)"
			href={`${data.baseUrl}/devices/${device.id}?connected=true`}
			onclick={() => {
				$preventNavigationHistory = true;
				devices.set([...$devices, device]);
			}}
		>
			Create
		</ActionButton>
	</ActionMenu>
{/if}

<Section>
	<PageHeader title="New Device" />
	<TextInput label="id" defaultValue={device.id} readonly />
	<TextInput label="name" autoFocus onvalue={(value) => (device.name = value)} />
</Section>
