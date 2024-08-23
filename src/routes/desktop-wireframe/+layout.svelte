<script lang="ts">
	import MainMenu from '../../components/dektop-wireframe/MainMenu.svelte';
	import {
		useInvitedUsers,
		useIsOrganisation,
		useOrganisationName,
		useProfile
	} from '../../stores';

	useOrganisationName();
	useIsOrganisation();
	useProfile();
	useInvitedUsers();
</script>

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
