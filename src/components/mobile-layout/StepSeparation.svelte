<script lang="ts">
	const props: { label?: string | number } = $props();
</script>

<div class="step-separation">
	{#if props.label || typeof props.label === 'number'}
		<div class="step-separation__label">{props.label}</div>
	{/if}
	<div class="step-separation__line"></div>
</div>

<style lang="scss">
	.step-separation {
		width: 100%;
		color: rgb(200, 200, 200);

		&__label {
			font-size: 1rem;
			font-weight: normal;
			text-transform: lowercase;
			color: inherit;
		}

		&__line {
			width: 100%;
			border-top: solid 1px;
			border-color: inherit;
			margin-top: var(--main-gap);
		}
	}
</style>
