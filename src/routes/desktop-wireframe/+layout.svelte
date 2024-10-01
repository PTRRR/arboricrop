<script lang="ts">
	import MainMenu from '../../components/dektop-wireframe/MainMenu.svelte';
	import Comments from '../../components/comments/Comments.svelte';
	import {
		useInvitedUsers,
		useIsOrganisation,
		useOrganisationName,
		useProfile,
		useShowComments
	} from '../../stores';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';

	export let data: LayoutData;

	const { showComments } = useShowComments();

	useOrganisationName();
	useIsOrganisation();
	useProfile();
	useInvitedUsers();

	onMount(() => {
		const keyDownHandler = (event: KeyboardEvent) => {
			if (event.key === 'c') {
				$showComments = !$showComments;
			}
		};

		window.addEventListener('keydown', keyDownHandler);

		return () => {
			window.removeEventListener('keydown', keyDownHandler);
		};
	});
</script>

{#if data.projectId && $showComments}
	<div class="comments">
		<Comments projectId={data.projectId} />
	</div>
{/if}

<div class="layout">
	<MainMenu />
	<div class="layout__content">
		<slot />
	</div>
</div>

<style>
	.layout {
		min-height: 100svh;
		background-color: var(--light-gray);
	}

	.layout__content {
		padding: 1rem;
	}
</style>
