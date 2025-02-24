<script>
	import { useApp } from '../../stores';
	import Button from '../layout/Button.svelte';
	import ActionMenu from './ActionMenu.svelte';

	let show = $state(false);
	const { isBlurred } = useApp();

	$effect(() => {
		$isBlurred = show;
	});
</script>

<ActionMenu>
	<Button
		onclick={() => (show = !show)}
		padding
		icon="more-vertical"
		iconOrder="inverted"
		backgroundColor="var(--grey)"
		borderColor="var(--dark-grey)"
	>
		More
	</Button>
</ActionMenu>

{#if show}
	<ActionMenu>
		<Button
			padding
			icon="notification"
			iconOrder="inverted"
			backgroundColor="var(--grey)"
			borderColor="var(--dark-grey)">Notifications</Button
		>
	</ActionMenu>

	<ActionMenu>
		<Button
			padding
			icon="gear"
			iconOrder="inverted"
			backgroundColor="var(--grey)"
			borderColor="var(--dark-grey)">Settings</Button
		>
	</ActionMenu>

	<ActionMenu>
		<Button
			padding
			icon="user"
			iconOrder="inverted"
			backgroundColor="var(--grey)"
			borderColor="var(--dark-grey)">Account</Button
		>
	</ActionMenu>
{/if}
