<script lang="ts">
	import type { comment as commentType } from '../../db/schema';

	export let mode: 'create' | 'update' = 'create';
	export let comment: Pick<typeof commentType.$inferSelect, 'name' | 'text'> | undefined =
		undefined;
	export let onSubmit:
		| ((params: { name: string; text: string }) => void | Promise<void>)
		| undefined = undefined;
	export let onCancel: (() => void) | undefined = undefined;
	export let onDelete: (() => void | Promise<void>) | undefined = undefined;
	export let onArchive: (() => void | Promise<void>) | undefined = undefined;

	let submitting = false;
	let deleting = false;
	let name: HTMLInputElement;
	let text: HTMLTextAreaElement;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="comments-content">
	<form
		on:submit={async (event) => {
			event.preventDefault();

			try {
				submitting = true;
				await onSubmit?.({
					name: name.value,
					text: text.value
				});
			} finally {
				submitting = false;
			}
		}}
	>
		<input
			type="text"
			placeholder="Your name..."
			on:click={(e) => e.stopPropagation()}
			bind:this={name}
			value={comment?.name}
		/>
		<textarea
			placeholder="Comment..."
			on:click={(e) => e.stopPropagation()}
			bind:this={text}
			value={comment?.text}
		></textarea>
		{#if mode === 'create'}
			{#if !submitting}
				<button type="submit" on:click={(e) => e.stopPropagation()}> Send </button>
				<button
					on:click={(e) => {
						e.stopPropagation();
						onCancel?.();
					}}
				>
					Cancel
				</button>
			{:else}
				<span>Sending...</span>
			{/if}
		{:else if mode === 'update'}
			{#if !deleting && !submitting}
				<button type="submit" on:click={(e) => e.stopPropagation()}> Update </button>
				<button
					on:click={(e) => e.stopPropagation()}
					on:click={async (e) => {
						e.stopPropagation();

						try {
							submitting = true;
							await onArchive?.();
						} finally {
							submitting = false;
						}
					}}
				>
					Archive
				</button>
				<button
					on:click={async (e) => {
						e.stopPropagation();

						try {
							deleting = true;
							await onDelete?.();
						} finally {
							deleting = false;
						}
					}}
				>
					Delete
				</button>
			{:else}
				<span>{deleting ? 'Deleting...' : submitting ? 'Updating...' : ''}</span>
			{/if}
		{/if}
	</form>
</div>

<style>
	.comments-content {
		position: absolute;
		left: 100%;
		top: 100%;
		width: 15rem;
	}

	.comments-content form {
		text-align: left;
	}

	.comments-content input,
	.comments-content textarea {
		width: 100%;
		max-width: 15rem;
		min-width: 15rem;
	}

	.comments-content textarea {
		min-height: 4rem;
	}
</style>
