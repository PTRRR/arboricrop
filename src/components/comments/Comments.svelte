<script lang="ts">
	import { onMount } from 'svelte';
	import { comment } from '../../db/schema';
	import { useUserName } from '../../stores';
	import Icon from './Icon.svelte';
	import Content from './Content.svelte';
	import { navigating } from '$app/stores';

	export let projectId: string;

	let open = false;
	let addComment = false;
	let mouseX = 0;
	let mouseY = 0;

	let comments: (typeof comment.$inferSelect)[] = [];
	let newComment: typeof comment.$inferInsert | undefined = undefined;
	let focusComment: typeof comment.$inferSelect | undefined = undefined;

	const userName = useUserName();
	const getCurrentUrl = () =>
		typeof window !== 'undefined' ? window.location.pathname + window.location.search : undefined;

	const refreshComments = async () => {
		const res = await fetch(
			`/api/projects/${projectId}/comments?url=${encodeURIComponent(getCurrentUrl() || '')}`
		);
		comments = (await res.json()) as (typeof comment.$inferSelect)[];
	};

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
					name: $userName,
					text: '',
					x: mouseX - window.innerWidth * 0.5,
					y: mouseY - window.innerHeight * 0.5,
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

		refreshComments();
		navigating.subscribe(async (navigating) => {
			if (!navigating) {
				refreshComments();
			} else {
				comments = [];
			}
		});

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
	<Icon
		comment={{
			x: mouseX - window.innerWidth * 0.5,
			y: mouseY - window.innerHeight * 0.5
		}}
	/>
{/if}

{#if newComment}
	<Icon comment={newComment} focus>
		<Content
			comment={newComment}
			onSubmit={async ({ name, text }) => {
				if (!newComment) return;

				userName.set(name);

				await fetch(`/api/projects/${projectId}/comments`, {
					method: 'post',
					body: JSON.stringify({
						name,
						text,
						url: getCurrentUrl(),
						x: newComment.x,
						y: newComment.y
					})
				});

				await refreshComments();

				newComment = undefined;
			}}
			onCancel={() => (newComment = undefined)}
		/>
	</Icon>
{/if}

{#each comments as comment}
	<Icon
		{comment}
		highlight
		focus={comment === focusComment}
		on:click={(event) => {
			event.stopPropagation();
			if (focusComment) {
				focusComment = undefined;
			} else {
				focusComment = comment;
			}
		}}
	>
		{#if comment === focusComment}
			<Content
				mode="update"
				{comment}
				onSubmit={async ({ name, text }) => {
					userName.set(name);

					await fetch(`/api/projects/${projectId}/comments/${comment.id}`, {
						method: 'put',
						body: JSON.stringify({
							name,
							text
						})
					});

					await refreshComments();
				}}
				onDelete={async () => {
					await fetch(`/api/projects/${projectId}/comments/${comment.id}`, {
						method: 'delete'
					});
					await refreshComments();
					focusComment = undefined;
				}}
			/>
		{/if}
	</Icon>
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
</style>
