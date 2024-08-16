<script lang="ts">
	import type { comment as commentType } from '../../db/schema';
	import { getCss } from '../../utils/css';

	export let comment: Pick<typeof commentType.$inferSelect, 'x' | 'y'>;
	export let focus: boolean = false;
	export let highlight: boolean = false;
</script>

<button
	on:click
	class="comments-icon"
	class:comments-icon--focus={focus}
	class:comments-icon--highlight={highlight}
	style={getCss({
		top: `calc(50% + ${comment.y}px)`,
		left: `calc(50% + ${comment.x}px)`
	})}
>
	<slot />
</button>

<style>
	.comments-icon {
		border: none;
		z-index: 20;
		position: fixed;
		width: 2rem;
		height: 2rem;
		border-radius: 0 50% 50% 50%;
		background-color: lightgray;
		box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
		transform: translate(-50%, -50%);
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

	.comments-icon--highlight {
		background-color: rgb(255, 197, 127);
	}

	.comments-icon--focus {
		background-color: black;
	}

	.comments-icon--focus.comments-icon::after {
		border-left: solid 2px white;
	}

	.comments-icon--focus.comments-icon::before {
		display: none;
	}
</style>
