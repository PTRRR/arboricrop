<script>
	import Info from '../../../components/wireframe/Info.svelte';
	import Input from '../../../components/wireframe/Input.svelte';
	import Dropdown from '../../../components/wireframe/Dropdown.svelte';
	import Button from '../../../components/wireframe/Button.svelte';
	import Separation from '../../../components/wireframe/Separation.svelte';
	import Spacer from '../../../components/Spacer.svelte';
	import { useProfile } from '../../../stores';
	import SaveSection from '../../../components/wireframe/SaveSection.svelte';
	import { goto } from '$app/navigation';

	const profile = useProfile();
</script>

<div class="profile">
	<Separation title="Profile settings" />
	<Info label="First name:" />
	<Spacer />
	<Input
		placeholder="First name"
		value={$profile.firstName}
		onValue={(value) =>
			profile.set({
				...$profile,
				firstName: value
			})}
	/>
	<Spacer />
	<Info label="Last name:" />
	<Spacer />
	<Input
		placeholder="Last name"
		value={$profile.lastName}
		onValue={(value) =>
			profile.set({
				...$profile,
				lastName: value
			})}
	/>
	<Spacer />
	<Info label="Role:" value={$profile.role || 'Unset'} />
	<Spacer />
	<Dropdown
		label="Change role"
		align="left"
		items={[
			'Grower',
			'Agricultural Analyst',
			'Agronomist',
			'Field Technician',
			'Plant Pathologist'
		]}
	>
		<Button
			slot="item"
			let:item
			on:click={() =>
				profile.set({
					...$profile,
					role: item
				})}
		>
			{item}
		</Button>
	</Dropdown>
	<Spacer />
	<Spacer />
	<Separation />
	<Spacer />
	<SaveSection
		onSave={() => {
			goto('/desktop-wireframe/dashboard');
		}}
		onCancel={() => {
			goto('/desktop-wireframe/dashboard');
		}}
	/>
</div>

<style>
	.profile {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
</style>
