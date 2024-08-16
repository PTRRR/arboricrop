<script lang="ts">
	import Card from '../../components/wireframe/Card.svelte';
	import { useDevices, useReturnButton } from '../../stores';
	import { shuffle } from '../../utils/arrays';

	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Arboricrop'
	});

	const devices = useDevices();
	const randomDevices = shuffle($devices).splice(0, 5);

	type Section = {
		title: string;
		cards: {
			title: string;
			subTitle?: string;
			href?: string;
		}[];
	};

	const sections: Section[] = [
		{
			title: 'Getting Started',
			cards: [
				{
					title: 'Devices Installation',
					href: '/mobile-wireframe/getting-started'
				},
				{
					title: 'Throubleshooting',
					href: '/mobile-wireframe/getting-started'
				}
			]
		},
		{
			title: 'Notifications & Alerts',
			cards: [
				{
					title: 'Notifications (3)'
				}
			]
		},
		{
			title: 'Recent Devices',
			cards: randomDevices.map((it) => ({
				title: it.name,
				href: `/mobile-wireframe/devices/${it.id}`
			}))
		}
	];
</script>

<div class="home">
	{#each sections as section}
		<div class="home__section">
			<div class="home__section-title">
				<h5>{section.title}</h5>
			</div>

			{#each section.cards as card}
				<Card href={card.href}>
					<svelte:fragment slot="title">
						{#if card.title}
							<h1>{card.title}</h1>
						{/if}
					</svelte:fragment>
					<svelte:fragment slot="subTitle">
						{#if card.subTitle}
							<p>{card.subTitle}</p>
						{/if}
					</svelte:fragment>
				</Card>
			{/each}
		</div>
	{/each}
</div>

<style>
	.home__section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.home__section + .home__section {
		margin-top: 1rem;
	}

	.home__section-title {
		color: var(--dark-gray);
	}
</style>
