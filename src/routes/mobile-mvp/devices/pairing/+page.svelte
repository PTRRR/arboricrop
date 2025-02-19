<script lang="ts">
	import Button from '../../../../components/layout/Button.svelte';
	import Dropdown from '../../../../components/mobile-layout/Dropdown.svelte';
	import Image from '../../../../components/mobile-layout/Image.svelte';
	import { useDeviceIllustration, useNavigationHistory, useReturnButton } from '../../../../stores';
	import { strategies } from '../../../../utils/pairing';
	import { goto } from '$app/navigation';
	import { createUrlBuilder } from '../../../../utils/urls';
	import { onMount } from 'svelte';
	import Section from '../../../../components/mobile-layout/Section.svelte';
	import type { PageData } from './$types';
	import CenteredWrapper from '../../../../components/mobile-layout/CenteredWrapper.svelte';
	import PageHeader from '../../../../components/layout/PageHeader.svelte';

	const { data }: { data: PageData } = $props();

	const { preventNavigationHistory } = useNavigationHistory();
	const { setVisibility, reset, setUsb, setButton, setBlink, setColor } = useDeviceIllustration();
	const returnButton = useReturnButton();

	returnButton.set({
		label: data.trial ? 'Trial' : 'Device',
		href: `${data.baseUrl}/devices`,
		backHref: data.trial
			? `${data.baseUrl}/trials/${data.trial}`
			: data.deviceId
				? `${data.baseUrl}/devices/${data.deviceId}`
				: undefined
	});

	const url = createUrlBuilder();
	const newDeviceUrl = createUrlBuilder(`${data.baseUrl}/devices/new`);

	const currentPairingStrategy = $derived(
		strategies.find((it) => it.value === data.strategy) || strategies[0]
	);
	const strategyOptions = $derived(
		strategies.filter((it) => it.value !== currentPairingStrategy.value)
	);

	$effect(() => {
		setUsb(currentPairingStrategy.value === 'usb');
		setButton(currentPairingStrategy.value === 'bluetooth');
	});

	onMount(() => {
		setVisibility(true);
		setBlink(true);
		setColor('rgb(133, 165, 242)');
		return () => reset();
	});
</script>

{#snippet dropdownButton(item: { label: string; value: string })}
	<Button
		fitWidth
		href={url.addQuery({ name: 'strategy', value: item.value })}
		color="var(--white)"
		fontSize="var(--big-font-size)"
	>
		{item.label}
	</Button>
{/snippet}

{#if !data.success}
	<PageHeader
		title={`${currentPairingStrategy.label} pairing`}
		description={currentPairingStrategy.description}
	/>
	<Section>
		<Image
			ratio={1}
			placeholder="Comprehensive schema or tutorial explaining how to proceed"
			onclick={() => {
				$preventNavigationHistory = true;
				goto(url.addQuery({ name: 'success', value: true }));
				setTimeout(() => {
					if (data.deviceId) {
						$preventNavigationHistory = true;
						const url = createUrlBuilder(`${data.baseUrl}/devices/${data.deviceId}`);
						goto(url.resetQueries([{ name: 'connected', value: true }]));
					} else {
						$preventNavigationHistory = true;
						goto(
							newDeviceUrl.resetQueries([
								{ name: 'connected', value: true },
								{
									name: 'trial',
									value: data.trial || undefined
								}
							])
						);
					}
				}, 2000);
			}}
		/>
		<!-- <Dropdown
			icon="navigate"
			label="Other pairing strategy"
			items={strategyOptions}
			renderItem={dropdownButton}
		/> -->
	</Section>
{:else}
	<CenteredWrapper>
		<div class="pairing__success">
			<p>Pairing successful</p>
			<span>Loading device metadata...</span>
		</div>
	</CenteredWrapper>
{/if}

<style>
	.pairing__success {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.pairing__success span {
		color: var(--dark-gray);
		font-weight: normal;
	}
</style>
