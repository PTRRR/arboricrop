<script lang="ts">
	import type { comment as commentType } from '../../db/schema';

	export let mode: 'create' | 'update' = 'create';
	export let comment: Pick<typeof commentType.$inferSelect, 'name' | 'text'> | undefined =
		undefined;
	export let onSubmit: ((params: { name: string; text: string }) => void) | undefined = undefined;
	export let onCancel: (() => void) | undefined = undefined;
	export let onDelete: (() => void) | undefined = undefined;

	let name: HTMLInputElement;
	let text: HTMLTextAreaElement;
</script>

<div class="comments-content">
	<form
		on:submit={(event) => {
			event.preventDefault();
			onSubmit?.({
				name: name.value,
				text: text.value
			});
		}}
	>
		<input type="text" placeholder="Your name..." bind:this={name} value={comment?.name} />
		<textarea placeholder="Comment..." bind:this={text} value={comment?.text}></textarea>
		{#if mode === 'create'}
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
			<button type="submit" on:click={(e) => e.stopPropagation()}> Update </button>
			<button
				on:click={(e) => {
					e.stopPropagation();
					onDelete?.();
				}}
			>
				Delete
			</button>
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
