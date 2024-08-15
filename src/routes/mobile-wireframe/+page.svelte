<script lang="ts">
	import Card from '../../components/wireframe/Card.svelte';

	type Section = {
		title: string;
		cards: {
			title: string;
			subTitle?: string;
			href?: string;
		}[];
	};

	let sections: Section[] = [
		{
			title: 'Getting Started',
			cards: [
				{
					title: 'Devices Installation',
					href: '/mobile-wireframe/getting-started/device-installation'
				},
				{
					title: 'Throubleshooting'
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
			title: 'Getting Started',
			cards: [
				{
					title: 'Install device',
					subTitle: 'hahah'
				}
			]
		},
		{
			title: 'Getting Started',
			cards: [
				{
					title: 'Install device',
					subTitle: 'hahah'
				}
			]
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
