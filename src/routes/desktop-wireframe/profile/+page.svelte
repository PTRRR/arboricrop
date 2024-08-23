<script>
	import Info from '../../../components/Info.svelte';
	import Input from '../../../components/Input.svelte';
	import Dropdown from '../../../components/Dropdown.svelte';
	import Button from '../../../components/Button.svelte';
	import Separation from '../../../components/Separation.svelte';
	import Spacer from '../../../components/Spacer.svelte';
	import { useProfile } from '../../../stores';

	const profile = useProfile();
</script>

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
	items={['Grower', 'Agricultural Analyst', 'Agronomist', 'Field Technician', 'Plant Pathologist']}
>
	<Button
		slot="item"
		let:item
		on:click={() =>
			profile.set({
				...$profile,
				role: item
			})}>{item}</Button
	>
</Dropdown>
