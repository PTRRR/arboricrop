<script lang="ts">
	export let label: string | undefined = undefined;
	export let value: string | undefined = undefined;
	export let align: 'left' | 'center' | 'right' = 'left';
</script>

<div
	class="info"
	class:info--left={align === 'left'}
	class:info--center={align === 'center'}
	class:info--right={align === 'right'}
>
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
		text-align: left;
	}

	.info--left {
		text-align: left;
	}

	.info--center {
		text-align: center;
	}

	.info--right {
		text-align: right;
	}

	.info__label {
		color: var(--dark-gray);
	}
</style>
