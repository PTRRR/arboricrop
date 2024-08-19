<script lang="ts">
	import { useReturnButton } from '../../../stores';

	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Notifications',
		href: '/mobile-wireframe'
	});
</script>

<h1>Notifications</h1>
