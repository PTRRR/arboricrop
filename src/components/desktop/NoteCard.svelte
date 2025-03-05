<script lang="ts">
	import type { TrialNote } from '../../utils/types';
	import Stack from './Stack.svelte';

	interface Props {
		note: TrialNote;
	}

	const { note }: Props = $props();
</script>

<div class="trial-note">
	<Stack gap="1rem">
		<Stack>
			<span class="trial-note__createdby">{note.createdBy}</span>
			<h4 class="trial-note__title">{note.title}</h4>
			<span class="trial-note__date">{note.date}</span>
		</Stack>

		<p class="trial-note__description">{note.description}</p>
	</Stack>
</div>

<style lang="scss">
	.trial-note {
		background-color: var(--light-grey);
		padding: 1rem;
		border-radius: 8px;

		&__createdby {
			color: var(--dark-grey);
		}

		&__title {
			font-size: var(--mid-font-size);
		}

		&__description {
			// font-weight: 400;
		}
	}
</style>
