<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Spacer from '../../../../components/Spacer.svelte';
	import Button from '../../../../components/wireframe/Button.svelte';
	import FieldForm from '../../../../components/wireframe/FieldForm.svelte';
	import Line from '../../../../components/wireframe/Line.svelte';
	import { useDevices, useFields, useReturnButton } from '../../../../stores';
	import { getDevicesByFieldId } from '../../../../utils/dummyData';
	import type { Device, Location } from '../../../../utils/types';
	import Map from '../../../../components/wireframe/Map.svelte';

	const fields = useFields();
	const devices = useDevices();
	const returnButton = useReturnButton();
	let selectedDevices: Device[] = [];

	$: field = $fields.find((it) => it.id === $page.params.fieldId);
	$: fieldDevices = getDevicesByFieldId($devices, field?.id);
	$: deviceLocations = fieldDevices.map((it) => it.location).filter((it) => it) as Location[];

	$: {
		if (field) {
			returnButton.set({
				label: field.name,
				href: '/mobile-wireframe/fields'
			});
		}
	}

	$: isSelected = (device: Device) => selectedDevices.some((it) => it.id === device.id);

	onMount(() => {
		selectedDevices = fieldDevices;
	});
</script>

<div class="field">
	{#if $page.data.devices}
		<div class="devices">
			{#each $devices as device}
				<Button
					selected={isSelected(device)}
					on:click={() => {
						let selected = selectedDevices.some((it) => it.id === device.id);
						selectedDevices = selected
							? selectedDevices.filter((it) => it.id !== device.id)
							: [...selectedDevices, device];
					}}
				>
					<div class="device">
						<span class="device-name">{device.name}</span>
						<span class="device-id">{device.id}</span>
					</div>
				</Button>
				<Spacer size="0.5rem" />
			{/each}
		</div>
		<Spacer size="1.5rem" />
		<Line />
		<div class="cancel">
			<Spacer size="2rem" />
			<Button
				href={window.location.pathname}
				on:click={() => {
					const fieldDevicesIds = fieldDevices.map((it) => it.id);
					const selectedIds = selectedDevices.map((it) => it.id);

					const newDevices = [...$devices];

					for (let i = 0; i < newDevices.length; i++) {
						if (
							fieldDevicesIds.includes(newDevices[i].id) &&
							!selectedIds.includes(newDevices[i].id)
						) {
							newDevices[i] = {
								...newDevices[i],
								fieldId: undefined
							};
						}

						if (selectedIds.includes(newDevices[i].id)) {
							newDevices[i] = {
								...newDevices[i],
								fieldId: field?.id
							};
						}
					}

					devices.set(newDevices);
				}}
			>
				Save
			</Button>
			<Spacer size="0.5rem" />
			<Button href={window.location.pathname} on:click={() => (selectedDevices = [])}>
				Cancel
			</Button>
		</div>
	{:else}
		<FieldForm
			{field}
			onSave={(field) => {
				const fieldIndex = $fields.findIndex((it) => it.id === field.id);

				if (fieldIndex > -1) {
					let newFields = [...$fields];
					newFields[fieldIndex] = field;
					fields.set(newFields);
				}

				goto('/mobile-wireframe/fields');
			}}
			onCancel={() => goto('/mobile-wireframe/fields')}
			onDelete={(id) => {
				fields.set($fields.filter((it) => it.id !== id));
				goto('/mobile-wireframe/fields');
			}}
		>
			<Spacer size="1rem" />
			<span>Devices:</span>
			<Line />
			<Spacer size="1rem" />

			{#if deviceLocations.length > 0}
				<Map locations={deviceLocations} />
				<Spacer size="1rem" />
			{/if}

			{#each fieldDevices as device}
				{#if device}
					<Button minimal href={`/mobile-wireframe/devices/${device.id}`}>
						<div class="device">
							<span class="device-name">{device.name}</span>
							<span class="device-id">{device.id}</span>
						</div>
					</Button>
				{/if}
			{/each}

			{#if fieldDevices.length === 0}
				<span>No devices</span>
			{/if}

			<Spacer size="1rem" />
			<Button href={`${window.location.pathname}?devices=true`}>Add devices</Button>

			<Spacer size="1rem" />
			<Line />
			<Spacer size="1rem" />
		</FieldForm>
	{/if}
</div>

<style>
	.field {
		position: relative;
	}
	.device {
		display: flex;
		max-width: 100%;
		justify-content: space-between;
	}

	.device-name {
		flex: 0 0 auto;
		width: 30%;
		text-align: left;
	}

	.device-id {
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1 1 auto;
		white-space: nowrap;
		text-align: right;
	}

	.devices {
		display: flex;
		flex-direction: column;
	}

	.cancel {
		position: sticky;
		bottom: 5rem;
		width: 100%;
	}
</style>
