<script lang="ts">
	import { useReturnButton } from '../../stores';
	import Spacer from '../Spacer.svelte';
	import Button from './Button.svelte';
	import DeviceForm from './DeviceForm.svelte';

	export let id: string | undefined = undefined;

	let returnButton = useReturnButton();
	returnButton.set({
		label: id ? `Device ${id}` : 'New device',
		href: '/mobile-wireframe/devices'
	});
</script>

<div class="device">
	{#if !id}
		<DeviceForm />
		<Spacer size="5rem" />
		<div class="device__footer">
			<p>New device detected</p>
			<Button>Save new device to account</Button>
			<Button href="/mobile-wireframe/devices">Cancel</Button>
		</div>
	{:else}
		<DeviceForm />
	{/if}
</div>

<style>
	.device {
		display: flex;
		flex-direction: column;
	}

	.device__footer {
		width: 100%;
		display: flex;
		flex-direction: column;
		text-align: center;
		gap: 1rem;
	}
</style>
