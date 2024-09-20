<script lang="ts">
	import MainMenu from '../../components/dektop-wireframe/MainMenu.svelte';
	import Comments from '../../components/comments/Comments.svelte';
	import {
		useInvitedUsers,
		useIsOrganisation,
		useOrganisationName,
		useProfile
	} from '../../stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	useOrganisationName();
	useIsOrganisation();
	useProfile();
	useInvitedUsers();
</script>

<!-- {#if data.projectId}
	<div class="comments">
		<Comments projectId={data.projectId} />
	</div>
{/if} -->

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
