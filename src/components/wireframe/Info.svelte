<script lang="ts">
	export let label: string | undefined = undefined;
	export let value: string | undefined = undefined;
</script>

<div class="info">
	{#if label}
		<span class="info__label">
			{label}
		</span>
	{/if}

	{#if value}
		<span class="info__value">
			{value}
		</span>
	{/if}
</div>

<style>
	.info {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.info__label {
		color: var(--dark-gray);
	}
</style>
