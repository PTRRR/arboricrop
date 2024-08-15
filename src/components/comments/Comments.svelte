<script lang="ts">
	import { onMount } from 'svelte';
	import { comment } from '../../db/schema';
	import { getCss } from '../../utils/css';
	import { invalidateAll } from '$app/navigation';
	import { useName } from '../../stores';

	export let projectId: string;
	export let comments: (typeof comment.$inferSelect)[];

	let open = false;
	let addComment = false;
	let mouseX = 0;
	let mouseY = 0;

	let newComment: typeof comment.$inferInsert | undefined = undefined;
	let focusComment: typeof comment.$inferSelect | undefined = undefined;

	const name = useName();

	onMount(() => {
		requestAnimationFrame(() => {
			open = true;
		});

		const handleMouseMove = (event: MouseEvent) => {
			mouseX = event.clientX;
			mouseY = event.clientY;
		};

		const handleMouseClick = () => {
			if (addComment) {
				newComment = {
					name: '',
					text: '',
					x: (mouseX / window.innerWidth) * 100,
					y: (mouseY / window.innerHeight) * 100,
					url: ''
				};
				addComment = false;
				focusComment = undefined;
			}

			if (focusComment) {
				focusComment = undefined;
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				focusComment = undefined;
				addComment = false;
				newComment = undefined;
			}
		};

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('click', handleMouseClick);
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('click', handleMouseClick);
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="comments-add"
	class:comments-add--open={open}
	on:click={(event) => {
		event.stopPropagation();
		addComment = true;
	}}
>
	<span>Add comment</span>
</div>

{#if addComment}
	<div
		class="comments-icon"
		style={getCss({
			top: `${mouseY}px`,
			left: `${mouseX}px`
		})}
	></div>
{/if}

{#if newComment}
	<div
		class="comments-icon comments-icon--focus"
		style={getCss({
			top: `${newComment.y}%`,
			left: `${newComment.x}%`
		})}
	>
		<div class="comment-content">
			<form on:submit={(event) => event.preventDefault()}>
				<input
					type="text"
					placeholder="Your name..."
					value={$name}
					on:input={(event) => {
						if (newComment) {
							newComment.name = event.currentTarget.value;
						}
					}}
				/>
				<textarea
					placeholder="Comment..."
					on:input={(event) => {
						if (newComment) {
							newComment.text = event.currentTarget.value;
						}
					}}
				></textarea>

				<button
					type="submit"
					on:click={async () => {
						if (newComment) {
							if (!newComment.name) {
								newComment.name = $name;
							}

							name.set(newComment.name);
							newComment.url = window.location.pathname + window.location.search;
							await fetch(`/api/projects/${projectId}/comments`, {
								method: 'post',
								body: JSON.stringify(newComment)
							});

							await invalidateAll();
							newComment = undefined;
						}
					}}
				>
					Send
				</button>
				<button on:click={() => (newComment = undefined)}> Cancel </button>
			</form>
		</div>
	</div>
{/if}

{#each comments as comment}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="comments-icon"
		class:comments-icon--focus={comment === focusComment}
		style={getCss({
			top: `${comment.y}%`,
			left: `${comment.x}%`
		})}
		on:click={(event) => {
			event.stopPropagation();
			focusComment = comment;
		}}
	>
		{#if comment === focusComment}
			<div class="comment-content">
				<form on:submit={(event) => event.preventDefault()}>
					<span>{comment.name}</span>
					<textarea placeholder="Comment..." value={comment.text}></textarea>
					<button
						on:click={async () => {
							const res = await fetch(`/api/projects/${projectId}/comments/${comment.id}`, {
								method: 'delete'
							});
							await invalidateAll();
						}}
					>
						Delete
					</button>
				</form>
			</div>
		{/if}
	</div>
{/each}

<style>
	.comments-add {
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 1rem;
		left: 1rem;
		height: 2rem;
		width: 2rem;
		background-color: lightgray;
		border-radius: 2rem;
		opacity: 0;
		transform: scale(0.5);
		transition:
			transform 0.3s,
			opacity 0.3s,
			width 0.3s 0.3s;
		cursor: pointer;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
		user-select: none;
	}

	.comments-add:hover {
		background-color: black;
		color: white;
	}

	.comments-add span {
		opacity: 0;
		white-space: nowrap;
		transition: opacity 0.4s 0.5s;
	}

	.comments-add--open {
		opacity: 1;
		transform: scale(1);
		width: 9rem;
	}

	.comments-add--open span {
		opacity: 1;
	}

	.comments-icon {
		z-index: 20;
		position: fixed;
		width: 2rem;
		height: 2rem;
		border-radius: 0 50% 50% 50%;
		background-color: lightgray;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
		transform: translate(-90%, -90%);
		cursor: pointer;
	}

	.comments-icon::before,
	.comments-icon::after {
		content: '';
		width: 0;
		height: 50%;
		border-left: solid 2px black;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.comments-icon::after {
		transform: translate(-50%, -50%) rotate(90deg);
	}

	.comments-icon--focus {
		background-color: black;
	}

	.comments-icon--focus.comments-icon::before,
	.comments-icon--focus.comments-icon::after {
		border-left: solid 2px white;
	}

	.comment-content {
		position: absolute;
		left: 100%;
		top: 100%;
		width: 15rem;
	}

	.comment-content input,
	.comment-content textarea {
		width: 100%;
		max-width: 15rem;
		min-width: 15rem;
	}

	.comment-content textarea {
		min-height: 4rem;
	}
</style>
