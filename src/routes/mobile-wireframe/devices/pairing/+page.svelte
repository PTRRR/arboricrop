<script lang="ts">
	import Button from '../../../../components/Button.svelte';
	import Dropdown from '../../../../components/Dropdown.svelte';
	import Image from '../../../../components/wireframe/Image.svelte';
	import { useReturnButton } from '../../../../stores';
	import { page } from '$app/stores';
	import { strategies } from '../../../../utils/pairing';
	import { goto } from '$app/navigation';
	import { createUrlBuilder } from '../../../../utils/urls';
	import CenteredWrapper from '../../../../components/wireframe/CenteredWrapper.svelte';
	import Separation from '../../../../components/Separation.svelte';
	import Portal from 'svelte-portal';
	import DeviceIllustration from '../../../../components/DeviceIllustration.svelte';

	const returnButton = useReturnButton();
	returnButton.set({
		label: 'Pair device',
		href: '/mobile-wireframe/devices'
	});

	const url = createUrlBuilder();
	const newDeviceUrl = createUrlBuilder('/mobile-wireframe/devices/new');

	$: currentPairingStrategy =
		strategies.find((it) => it.value === $page.data.strategy) || strategies[0];
	$: strategyOptions = strategies.filter((it) => it.value !== currentPairingStrategy.value);
</script>

<CenteredWrapper>
	<div class="pairing__content">
		{#if !$page.data.success}
			<Separation title={`${currentPairingStrategy.label} pairing:`} />
			<div class="pairing__image">
				<Image
					ratio={1}
					placeholder="Comprehensive schema or tutorial explaining how to proceed"
					onClick={() => {
						goto(url.addQuery({ name: 'success', value: true }));
						setTimeout(() => {
							if ($page.data.deviceId) {
								const url = createUrlBuilder(`/mobile-wireframe/devices/${$page.data.deviceId}`);
								goto(url.resetQueries([{ name: 'connected', value: true }]));
							} else {
								goto(newDeviceUrl.resetQueries([{ name: 'connected', value: true }]));
							}
						}, 2000);
					}}
				/>
				<span class="pairing__description">{currentPairingStrategy.description}</span>
			</div>
			<Dropdown label="Use other pairing strategy" items={strategyOptions}>
				<Button slot="item" let:item href={url.addQuery({ name: 'strategy', value: item.value })}>
					{item.label}
				</Button>
			</Dropdown>
		{:else}
			<div class="pairing__success">
				<p>Pairing successful</p>
				<span>Loading device metadata...</span>
			</div>
		{/if}
	</div>
</CenteredWrapper>

<Portal target="#mobile-portal">
	<div class="portal">
		<DeviceIllustration animate usb jack />
	</div>
</Portal>

<style>
	.pairing__content {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
	}

	.pairing__image {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.pairing__description {
		color: var(--dark-gray);
		max-width: 14rem;
		text-align: center;
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

	.portal {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
