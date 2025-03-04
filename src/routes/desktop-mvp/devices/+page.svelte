<script lang="ts">
	import type { Device } from '../../../utils/types';
	import { useCurrentAccount, useDevices, useNotifications } from '../../../stores';
	import Section from '../../../components/desktop/Section.svelte';
	import StatusDot from '../../../components/mobile-layout/StatusDot.svelte';
	import Stack from '../../../components/desktop/Stack.svelte';
	import TextInput from '../../../components/layout/TextInput.svelte';
	import TextareaInput from '../../../components/layout/TextareaInput.svelte';
	import PageHeader from '../../../components/layout/PageHeader.svelte';
	import DevicesList from '../../../components/desktop/DevicesList.svelte';
	import SearchBar from '../../../components/desktop/SearchBar.svelte';
	import Validation from '../../../components/desktop/Validation.svelte';
	import { shuffle } from '../../../utils/arrays';
	import NotificationCard from '../../../components/desktop/NotificationCard.svelte';
	import Grid from '../../../components/desktop/Grid.svelte';
	import StepSeparation from '../../../components/layout/StepSeparation.svelte';
	import PageLayout from '../../../components/desktop/PageLayout.svelte';

	const { devices, updateDevice } = useDevices();
	const { currentAccount } = useCurrentAccount();
	const notifications = useNotifications();
	let selectedDevice = $state<Device | undefined>(undefined);
	let deviceName = $state('');
	let deviceNote = $state('');

	const selectedDeviceHasChanges = $derived(
		selectedDevice &&
			((selectedDevice.name || '') !== deviceName || (selectedDevice.note || '') !== deviceNote)
	);

	const accountDevices = $derived(
		$devices.filter((it) => it.accountId === $currentAccount?.id).slice(0, 30)
	);
</script>

{#snippet deviceLabel()}
	{#if selectedDevice}
		<Stack direction="horizontal" gap="0.5rem" alignItems="center">
			<StatusDot status={selectedDevice?.status === 'active' ? 'success' : 'neutral'} />
			{selectedDevice?.name}
		</Stack>
	{/if}
{/snippet}

{#snippet actionPanel()}
	{#if selectedDevice}
		<TextInput label="ID" value={selectedDevice.id} readonly />
		<TextInput label="Version" value={selectedDevice.firmwareVersion} readonly />
		<TextInput label="Name" bind:value={deviceName} />
		<TextareaInput label="Note" bind:value={deviceNote} />

		<StepSeparation label="Historical data" />
		<Stack gap="0.5rem">
			{#each shuffle($notifications).slice(0, 4) as notification}
				<NotificationCard
					selected
					mode="minimal"
					notification={{ ...notification, status: 'acknowledged', type: 'notification' }}
				/>
			{/each}
		</Stack>

		<Validation
			validateLabel="Save"
			validateDisabled={!selectedDeviceHasChanges}
			onvalidate={() => {
				if (!selectedDevice) return;

				updateDevice({
					...selectedDevice,
					name: deviceName,
					note: deviceNote
				});

				selectedDevice = accountDevices.find((it) => it.id === selectedDevice?.id);
			}}
			oncancel={() => (selectedDevice = undefined)}
		/>
	{/if}
{/snippet}

{#snippet title()}
	<Stack direction="horizontal" justifyContent="space-between" style={{ width: '100%' }}>
		<span>Devices</span>
		<SearchBar />
	</Stack>
{/snippet}

<PageLayout actionPanel={selectedDevice ? actionPanel : undefined} label={deviceLabel}>
	<Section fill>
		<PageHeader {title} subTitle={`${accountDevices.length} Available Devices`} />
		<DevicesList
			devices={accountDevices}
			multi={false}
			onselect={([device]) => {
				selectedDevice = selectedDevice?.id === device?.id ? undefined : device;
				deviceName = selectedDevice?.name || '';
				deviceNote = selectedDevice?.note || '';
			}}
		/>
	</Section>

	{#if selectedDevice}{/if}
</PageLayout>
