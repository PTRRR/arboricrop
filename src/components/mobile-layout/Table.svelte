<script lang="ts">
  import { getCss } from '../../utils/css';

  export interface Cell {
    label: string;
    width?: string;
  }

  export interface Row {
    href?: string;
    cells: Cell[];
  }

  const { headers, rows }: {
    headers: Cell[],
    rows: Row[]
  } = $props();

  const getCellWidth = (cellIndex: number) => {
    const cell = headers[cellIndex];
    return cell.width;
  };
</script>

{#snippet innerRow(cells: Cell[])}
  {#each cells as cell, index}
    <div
      class="table__cell"
      style={getCss({ width: getCellWidth(index) })}
    >
      <span>{cell.label}</span>
    </div>
  {/each}
{/snippet}

<div class="table">
  <div class="table__row table__headers">
    {#each headers as header}
      <div
        class="table__cell"
        style={getCss({ width: header.width })}
      >
        <span>{header.label}</span>
      </div>
    {/each}
  </div>
  {#each rows as row}
    {#if row.href}
      <a class="table__row table__data" href={row.href}>
        {@render innerRow(row.cells)}
      </a>
    {:else}
      <div class="table__row table__data">
        {@render innerRow(row.cells)}
      </div>
    {/if}
  {/each}
</div>

<style lang="scss">
  .table {
    background-color: rgb(235, 235, 235);
    border-radius: 5px;
    overflow: hidden;

    &__row {
      display: flex;
      padding: 0.5rem;
      color: black;
      text-decoration: none;

      & + & {
        border-top: solid 1px rgb(210, 210, 210);
      }
    }

    a.table__row {
      &:hover {
        background-color: rgb(245, 245, 245);
      }
    }

    &__headers {
      background-color: rgb(210, 210, 210);
    }

    &__cell {
      display: flex;
      white-space: nowrap;
      text-transform: lowercase;
    }

    &__data {
      font-weight: normal;
    }
  }
</style>