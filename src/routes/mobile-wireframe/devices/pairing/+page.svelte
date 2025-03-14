<script lang="ts">
	import Button from '../../../../components/wireframe/Button.svelte';
	import Dropdown from '../../../../components/wireframe/Dropdown.svelte';
	import Image from '../../../../components/wireframe/Image.svelte';
	import { useDeviceIllustration, useNavigationHistory, useReturnButton } from '../../../../stores';
	import { strategies } from '../../../../utils/pairing';
	import { goto } from '$app/navigation';
	import { createUrlBuilder } from '../../../../utils/urls';
	import CenteredWrapper from '../../../../components/wireframe/CenteredWrapper.svelte';
	import { onMount } from 'svelte';
	import Section from '../../../../components/wireframe/Section.svelte';
	import Spacer from '../../../../components/Spacer.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const { preventNavigationHistory } = useNavigationHistory();
	const { setVisibility, reset, setUsb, setButton, setBlink, setColor } = useDeviceIllustration();
	const returnButton = useReturnButton();
	returnButton.set({
		label: 'Pair device',
		href: '/mobile-wireframe/devices'
	});

	const url = createUrlBuilder();
	const newDeviceUrl = createUrlBuilder('/mobile-wireframe/devices/new');

	$: currentPairingStrategy = strategies.find((it) => it.value === data.strategy) || strategies[0];
	$: strategyOptions = strategies.filter((it) => it.value !== currentPairingStrategy.value);

	$: {
		setUsb(currentPairingStrategy.value === 'usb');
		setButton(currentPairingStrategy.value === 'bluetooth');
	}

	onMount(() => {
		setVisibility(true);
		setBlink(true);
		setColor('rgb(133, 165, 242)');
		return () => reset();
	});
</script>

<CenteredWrapper>
	{#if !data.success}
		<Section title={`${currentPairingStrategy.label} pairing:`}>
			<Image
				ratio={1}
				placeholder="Comprehensive schema or tutorial explaining how to proceed"
				onClick={() => {
					$preventNavigationHistory = true;
					goto(url.addQuery({ name: 'success', value: true }));
					setTimeout(() => {
						if (data.deviceId) {
							$preventNavigationHistory = true;
							const url = createUrlBuilder(`/mobile-wireframe/devices/${data.deviceId}`);
							goto(url.resetQueries([{ name: 'connected', value: true }]));
						} else {
							$preventNavigationHistory = true;
							goto(
								newDeviceUrl.resetQueries([
									{ name: 'connected', value: true },
									{
										name: 'field',
										value: data.field || undefined
									}
								])
							);
						}
					}, 2000);
				}}
			/>
			<Spacer />
			<p class="pairing__description">
				<span>{currentPairingStrategy.description}</span>
			</p>
			<Spacer />
			<Dropdown label="Use other pairing strategy" items={strategyOptions}>
				<Button
					slot="item"
					let:item
					href={url.addQuery({ name: 'strategy', value: item.value })}
					preventHistory
				>
					{item.label}
				</Button>
			</Dropdown>
		</Section>
	{:else}
		<div class="pairing__success">
			<p>Pairing successful</p>
			<span>Loading device metadata...</span>
		</div>
	{/if}
</CenteredWrapper>

<style>
	.pairing__description {
		color: var(--dark-gray);
		text-align: center;
	}

	.pairing__description span {
		display: inline-block;
		max-width: 14rem;
	}

	.pairing__success {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--gap);
	}

	.pairing__success span {
		color: var(--dark-gray);
	}
</style>
