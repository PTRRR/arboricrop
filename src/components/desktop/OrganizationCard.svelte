<script lang="ts">
	import type { Account } from '../../utils/types';
	import Spacer from '../Spacer.svelte';
	import Stack from './Stack.svelte';

	interface Props {
		organization: Account;
	}

	const { organization }: Props = $props();
</script>

<a class="organization-card" href={`/desktop-mvp/organizations/${organization.id}`}>
	<Stack gap="0.4rem">
		<span class="organization-card__title"
			>{organization.username || organization.organizationName || 'Vivent'}</span
		>
		<span class="organization-card__description">{organization.email}</span>
		<span>{Math.floor(Math.random() * 10)} projects</span>
	</Stack>
</a>

<style lang="scss">
	.organization-card {
		$this: &;
		background-color: var(--light-grey);
		padding: 1rem;
		border-radius: 1rem;
		text-decoration: none;
		color: black;

		&__title {
			font-size: var(--mid-font-size);
			line-height: 1;
		}

		&__description {
			font-size: var(--main-font-size);
			font-weight: 100;
			color: var(--black);
		}

		&:hover {
			background-color: var(--grey);
		}
	}
</style>
