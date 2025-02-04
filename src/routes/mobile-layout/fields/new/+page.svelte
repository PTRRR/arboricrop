<script lang="ts">
  import Section from '../../../../components/mobile-layout/Section.svelte';
  import TextInput from '../../../../components/mobile-layout/TextInput.svelte';
  import Map from '../../../../components/mobile-layout/Map.svelte';
  import { changinCenter, swissBounds } from '../../../../utils/dummyData';
  import type { Field } from '../../../../utils/types';
  import { createId } from '@paralleldrive/cuid2';
  import { useFields, useLoRaConfigurations } from '../../../../stores';
  import Button from '../../../../components/mobile-layout/Button.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  const defaultName = $page.url.searchParams.get('name') || '';

  const { fields } = useFields();
  const { loRaConfigurations } = useLoRaConfigurations();
  const defaultLoRaConfiguration = $derived($loRaConfigurations.find((it) => it.isDefault));

  let map: Map | null = $state(null);
  let name = $state('');
  let area = $state('');

  let field: Field = $state({
    id: `fie-${createId()}`,
    name: defaultName,
    area: '',
    type: '',
    loraConfigId: '',
    center: changinCenter,
    layers: []
  });
</script>

<Section label="General settings">
  <TextInput label="Name" defaultValue={defaultName} onvalue={(value) => (name = value)} />
  <TextInput label="Area" onvalue={(value) => (area = value)} />
</Section>

<Section label="Location">
  <Map
    bind:this={map}
    maxBounds={swissBounds}
    zoom={9}
    minZoom={3}
    maxZoom={18}
    center={field.center}
    showTarget
    markers={[{ lngLat: field.center }]}
    geoJSONs={[]}
  />
  <Button>Set location</Button>
</Section>
<Section label="Confirm changes">
  <Button
    onclick={() => {
			field = {
				...field,
				name,
				area,
				// ...generalSettings.getValues(),
				layers: []
			};
			fields.set([...$fields, field]);
			goto(`/mobile-layout/fields/${field.id}`);
		}}
  >
    Confirm
  </Button>
  <Button href="/mobile-layout">Cancel</Button>
</Section>
