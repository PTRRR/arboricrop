<script lang="ts">
	import Card from '../../components/wireframe/Card.svelte';
	import { useDevices, useFields, useReturnButton } from '../../stores';
	import { shuffle } from '../../utils/arrays';
	import { getDevicesByFieldId } from '../../utils/dummyData';

	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Arboricrop'
	});

	const devices = useDevices();
	const fields = useFields();
	const randomFields = shuffle($fields).splice(0, 5);

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
					title: 'Notifications (3)',
					href: '/mobile-wireframe/notifications'
				}
			]
		},
		{
			title: 'Recent Fields',
			cards: randomFields.map((it) => ({
				title: it.name || '',
				subTitle: `${it.type} [${getDevicesByFieldId($devices, it.id).length} devices]`,
				href: `/mobile-wireframe/fields/${it.id}`
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
		gap: var(--gap);
	}

	.home__section + .home__section {
		margin-top: 1rem;
	}

	.home__section-title {
		color: var(--dark-gray);
	}
</style>
