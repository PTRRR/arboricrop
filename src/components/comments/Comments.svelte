<script lang="ts">
	import { onMount } from 'svelte';
	import { comment } from '../../db/schema';
	import { useUserName } from '../../stores';
	import Icon from './Icon.svelte';
	import Content from './Content.svelte';
	import { navigating } from '$app/stores';
	import { getCss } from '../../utils/css';

	export let projectId: string;

	let open = false;
	let addComment = false;
	let mouseX = 0;
	let mouseY = 0;

	let comments: (typeof comment.$inferSelect)[] = [];
	let newComment: typeof comment.$inferInsert | undefined = undefined;
	let focusComment: typeof comment.$inferSelect | undefined = undefined;
	let showAll: boolean = false;

	$: commentsToDisplay = showAll ? comments : comments.filter((it) => it.status === 'new');

	const userName = useUserName();
	const getCurrentUrl = () =>
		typeof window !== 'undefined' ? window.location.pathname + window.location.search : undefined;

	const refreshComments = async () => {
		const res = await fetch(
			`/api/projects/${projectId}/comments?url=${encodeURIComponent(getCurrentUrl() || '')}`
		);
		comments = (await res.json()) as (typeof comment.$inferSelect)[];
		focusComment = undefined;
		addComment = false;
		newComment = undefined;
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

		const storedUserName = window.localStorage.getItem('user-name');
		if (!storedUserName) {
			window.localStorage.setItem('user-name', '');
		} else {
			userName.set(storedUserName);
		}

		userName.subscribe((userName) => {
			if (userName) {
				window.localStorage.setItem('user-name', userName);
			}
		});

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('click', handleMouseClick);
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="comments-nav">
	<button
		class="comments-button"
		class:comments--closed={!open}
		style={getCss({
			width: '6rem',
			backgroundColor: showAll ? 'black' : undefined,
			color: showAll ? 'white' : undefined
		})}
		on:click={(event) => {
			event.stopPropagation();
			showAll = !showAll;
		}}
	>
		<span>Show all</span>
	</button>
	<button
		class="comments-button"
		class:comments--closed={!open}
		on:click={(event) => {
			event.stopPropagation();
			addComment = true;
		}}
	>
		<span>Add comment</span>
	</button>
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

{#each commentsToDisplay as comment}
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
				onArchive={async () => {
					await fetch(`/api/projects/${projectId}/comments/${comment.id}`, {
						method: 'put',
						body: JSON.stringify({ status: 'archived' })
					});

					await refreshComments();
				}}
				onDelete={async () => {
					await fetch(`/api/projects/${projectId}/comments/${comment.id}`, {
						method: 'delete'
					});
					await refreshComments();
				}}
			/>
		{/if}
	</Icon>
{/each}

<style>
	.comments-nav {
		display: flex;
		flex-direction: column;
		z-index: 10;
		position: fixed;
		bottom: 1rem;
		left: 1rem;
		gap: 0.5rem;
	}

	.comments-button {
		display: flex;
		justify-content: center;
		align-items: center;
		border: none;
		height: 2rem;
		width: 8.5rem;
		opacity: 1;
		transform: scale(1);
		background-color: lightgray;
		border-radius: 2rem;

		transition:
			transform 0.3s,
			opacity 0.3s,
			width 0.3s 0.3s;
		cursor: pointer;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
		user-select: none;
	}

	.comments-button:hover {
		background-color: black;
		color: white;
	}

	.comments-button span {
		opacity: 1;
		white-space: nowrap;
		transition: opacity 0.4s 0.5s;
	}

	.comments--closed {
		opacity: 0 !important;
		transform: scale(0.5) !important;
		width: 2rem !important;
	}

	.comments--closed span {
		opacity: 0;
	}
</style>
