<script lang="ts">
  import { page } from '$app/stores';
  import Button from '../../../../components/mobile-layout/Button.svelte';
  import Section from '../../../../components/mobile-layout/Section.svelte';
  import Map from '../../../../components/mobile-layout/Map.svelte';
  import { useDevices, useFields, useLoRaConfigurations } from '../../../../stores';
  import { swissBounds } from '../../../../utils/dummyData';
  import TextInput from '../../../../components/mobile-layout/TextInput.svelte';
  import Table, { type Cell, type Row } from '../../../../components/mobile-layout/Table.svelte';
  import { goto } from '$app/navigation';

  const fieldId = $page.params.fieldId;
  const { devices } = useDevices();
  const { fields, getFieldById, deleteField } = useFields();
  const { loRaConfigurations } = useLoRaConfigurations();
  const defaultLoRaConfiguration = $derived($loRaConfigurations.find((it) => it.isDefault));

  let map: Map | null = $state(null);

  const field = $derived($fields && getFieldById(fieldId));
  const fieldDevices = $derived($devices.filter((it) => it.fieldId === field?.id));

  const devicesHeaders: Cell[] = [
    { label: 'Name', width: '50%' },
    { label: 'Status', width: '30%' },
    { label: 'Battery', width: '20%' }
  ];

  const devicesRows: Row[] = $derived(fieldDevices.map((it) => ({
    href: `/mobile-layout/devices/${it.id}`,
    cells: [
      { label: it.name || it.id },
      { label: it.status || '' },
      { label: `${it.battery || '0'}%` }
    ]
  })));

</script>

<div class="field">
  {#if field}
    <Section label="General Settings">
      <TextInput label="Name" defaultValue={field.name} />
      <TextInput label="Area" defaultValue={field.area} />
    </Section>
    <Section label="Devices"
             actions={fieldDevices.length > 0 ? [{label: "Add", onclick: () => goto(`/mobile-layout/devices/pairing?field=${field.id}`)}] : []}>

      {#if fieldDevices.length === 0}
        <Button href={`/mobile-layout/devices/pairing?field=${field.id}`}>Add device</Button>
      {:else}
        <Table headers={devicesHeaders} rows={devicesRows} />
      {/if}
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
    </Section>
    <Section label="Layers"></Section>
    <Section label="LoRa"></Section>
    <Section label="Danger Zone">
      <Button onclick={() => {
        deleteField(field.id);
        goto('/mobile-layout');
      }} type="error">Delete Permanently
      </Button>
    </Section>
  {/if}
</div>

<style lang="scss">
  .field {
    &__device {
      display: flex;
      color: black;
      text-decoration: none;
    }
  }
</style>
