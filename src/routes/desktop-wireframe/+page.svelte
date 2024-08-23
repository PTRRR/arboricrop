<script lang="ts">
	import Button from '../../components/Button.svelte';
	import Separation from '../../components/Separation.svelte';
	import Spacer from '../../components/Spacer.svelte';
	import Image from '../../components/wireframe/Image.svelte';
	import { useFields } from '../../stores';

	const fields = useFields();
</script>

<Separation title="Fields:" />
<div class="dashboard">
	{#each $fields as field}
		<div class="dashboard__item">
			<Image ratio={0.1} placeholder={`Infographic: ${field.name}`} />
		</div>
	{/each}
</div>
<Spacer />
<Button>Create new field</Button>

<style>
	.dashboard {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--gap);
	}

	.dashboard__item {
		height: 30svh;
	}
</style>
