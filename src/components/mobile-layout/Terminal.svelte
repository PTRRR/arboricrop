<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	const { play }: { play?: boolean } = $props();

	let text = $state('');
	const fullText = `$ Initializing AgroSense monitoring system...
> Connecting to field sensors
> Establishing connection with weather station
> All systems online

[FIELD-A01] Soil moisture: 35.2% | Temperature: 22.8°C | pH: 6.7
[FIELD-A01] Nutrient levels - N: 64ppm, P: 32ppm, K: 128ppm
[FIELD-A01] Leaf wetness detected: 0.82 hours
[WEATHER] Wind speed: 3.2 m/s | Direction: NW | Humidity: 68%

[FIELD-B02] Soil moisture: 28.9% | Temperature: 23.1°C | pH: 7.1
[FIELD-B02] Nutrient levels - N: 58ppm, P: 28ppm, K: 115ppm
[ALERT] Field B02: Moisture levels below threshold - Activating irrigation system

[GREENHOUSE-01] Temperature: 26.5°C | Humidity: 75% | CO2: 450ppm
[GREENHOUSE-01] Light intensity: 32000 lux | PAR: 685 μmol/m²/s
[GREENHOUSE-01] Ventilation fans: Active | Speed: 65%

[FIELD-C03] Soil moisture: 42.1% | Temperature: 21.9°C | pH: 6.9
[FIELD-C03] Nutrient levels - N: 72ppm, P: 35ppm, K: 142ppm
[FIELD-C03] Pest detection: No anomalies detected

[WEATHER] Updated forecast: Light rain expected in 6 hours
[SYSTEM] Adjusting irrigation schedules based on forecast
[SYSTEM] Optimizing nutrient delivery for Field A01 and C03

[DRONE-01] Starting automated survey of Field A01
[DRONE-01] Battery: 92% | Height: 25m | Speed: 5m/s
[DRONE-01] Capturing multispectral imagery...
[DRONE-01] NDVI analysis in progress...

[FIELD-A01] Growth stage: Vegetative | Crop height: 45cm
[FIELD-B02] Growth stage: Flowering | Crop height: 72cm
[FIELD-C03] Growth stage: Fruit development | Crop height: 95cm

[ALERT] Greenhouse-01: Adjusting light intensity for optimal photosynthesis
[SYSTEM] Updating crop stress models based on sensor data
[SYSTEM] Machine learning predictions: Yield estimate updated +2.3%

$ Running diagnostic checks...
> All sensors operational
> Data streaming nominal
> Network connectivity: Strong
> Storage usage: 42%
$ System ready for continuous monitoring...`;

	let currentIndex = 0;
	let intervalId: NodeJS.Timeout | undefined = undefined;

	onMount(() => {});

	$effect(() => {
		if (!play) return;

		intervalId = setInterval(() => {
			if (currentIndex <= fullText.length) {
				text = fullText.slice(0, currentIndex);
				currentIndex++;
			} else {
				clearInterval(intervalId);
			}
		}, 10);

		return () => {
			clearInterval(intervalId);
		};
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});
</script>

<div class="container">
	<div class="terminal">
		<div class="terminal-content">
			<div class="terminal-text">
				{text}
				<span class="cursor"></span>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		width: 100%;
		max-width: 42rem;
		margin: 0 auto;
	}

	.terminal {
		border-radius: 0.5rem;
		border: 1px solid #27272a;
		background-color: #09090b;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}

	.terminal-content {
		padding: 1rem;
		height: 50vh;
		overflow: auto;
	}

	.terminal-text {
		font-family: monospace;
		font-size: 0.875rem;
		color: var(--white);
	}

	.cursor {
		display: inline-block;
		width: 0.5rem;
		height: 1rem;
		margin-left: 0.25rem;
		background-color: var(--white);
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}
</style>
