<script lang="ts">
	import { useReturnButton } from '../../../stores';

	let returnButton = useReturnButton();
	returnButton.set({
		label: 'Settings',
		href: '/mobile-wireframe'
	});
</script>

<h1>Settings</h1>
