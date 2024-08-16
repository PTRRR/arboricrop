<script lang="ts">
	import Button from '../../../../components/wireframe/Button.svelte';
	import Dropdown from '../../../../components/wireframe/Dropdown.svelte';
	import Image from '../../../../components/wireframe/Image.svelte';
	import { useReturnButton } from '../../../../stores';
	import { page } from '$app/stores';
	import { strategies } from '../../../../utils/pairing';
	import { goto } from '$app/navigation';

	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Pair device',
		href: '/mobile-wireframe/devices'
	});

	$: currentPairingStrategy =
		strategies.find((it) => it.value === $page.data.strategy) || strategies[0];
	$: strategyOptions = strategies.filter((it) => it.value !== currentPairingStrategy.value);
</script>

<div class="pairing">
	<div class="pairing__content">
		{#if !$page.data.success}
			<div class="pairing__image">
				<Image
					ratio={1}
					placeholder="Comprehensive schema or tutorial explaining how to proceed"
					onClick={() => {
						goto(`/mobile-wireframe/devices/pairing?success=true`);
						setTimeout(() => {
							goto('/mobile-wireframe/devices/new');
						}, 2000);
					}}
				/>
				<span class="pairing__description">{currentPairingStrategy.description}</span>
			</div>
			<Dropdown label="Use other pairing strategy" items={strategyOptions}>
				<Button
					slot="item"
					let:item
					href={`/mobile-wireframe/devices/pairing?strategy=${item.value}`}
				>
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
</div>

<style>
	.pairing {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		flex: 1 1 auto;
	}

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
		gap: 0.5rem;
	}

	.pairing__success span {
		color: var(--dark-gray);
	}
</style>
