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
	let showList: boolean = false;
	let allComments: (typeof comment.$inferSelect)[] = [];

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

	const fetchAllComments = async () => {
		const res = await fetch(`/api/projects/${projectId}/comments`);
		const json = await res.json();
		return json as (typeof comment.$inferSelect)[];
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
<div class="comments-nav">
	<button
		class="comments-button"
		class:comments--closed={!open}
		style={getCss({
			width: '4rem',
			backgroundColor: showList ? 'black' : undefined,
			color: showList ? 'white' : undefined
		})}
		on:click={async (event) => {
			event.stopPropagation();
			showList = !showList;
			allComments = await fetchAllComments();
		}}
	>
		<span>List</span>
	</button>
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

{#if showList}
	<div class="comments-list">
		<div class="comments-list__items">
			{#each allComments as comment}
				<div class="comments-list__comment">
					<span class="comments-list__name">{comment.name}</span>
					<span class="comments-list__text">{comment.text}</span>
					<a
						href={comment.url}
						on:click={(event) => {
							event.stopPropagation();
							showList = false;
						}}
						>See
					</a>
				</div>
			{/each}
		</div>
	</div>
{/if}

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
		z-index: 30;
		position: fixed;
		bottom: 1rem;
		left: 1rem;
		gap: var(--gap);
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

	.comments-list {
		position: fixed;
		z-index: 29;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(240, 240, 240, 0.9);
		display: flex;
		justify-content: center;
	}

	.comments-list__items {
		display: flex;
		flex-direction: column;
		background-color: rgba(255, 255, 255, 0.9);
		padding: 1rem;
	}

	.comments-list__comment {
		display: flex;
		flex-direction: column;
		max-width: 35rem;
		align-items: start;
		border-top: solid 1px black;
		padding-top: 1rem;
	}

	.comments-list__comment + .comments-list__comment {
		margin-top: 1rem;
	}

	.comments-list__name {
		color: gray;
	}
</style>
