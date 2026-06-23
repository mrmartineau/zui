/** @jsxImportSource react */
import {
  type ColumnDef,
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Badge,
  Button,
  Checkbox,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@mrmartineau/zui/react'
import { useState } from 'react'

interface Person {
  id: number
  name: string
  email: string
  role: string
  status: 'Active' | 'Away' | 'Inactive'
  amount: number
}

const DATA: Person[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@acme.co', role: 'Designer', status: 'Active', amount: 1280 },
  { id: 2, name: 'Bob Smith', email: 'bob@acme.co', role: 'Engineer', status: 'Away', amount: 940 },
  { id: 3, name: 'Carol Davis', email: 'carol@acme.co', role: 'Product Manager', status: 'Active', amount: 2310 },
  { id: 4, name: 'Dan Lee', email: 'dan@acme.co', role: 'Engineer', status: 'Inactive', amount: 0 },
  { id: 5, name: 'Erin Park', email: 'erin@acme.co', role: 'Designer', status: 'Active', amount: 1750 },
  { id: 6, name: 'Frank Moore', email: 'frank@acme.co', role: 'Support', status: 'Away', amount: 620 },
  { id: 7, name: 'Grace Kim', email: 'grace@acme.co', role: 'Engineer', status: 'Active', amount: 3100 },
  { id: 8, name: 'Henry Ford', email: 'henry@acme.co', role: 'Sales', status: 'Inactive', amount: 480 },
]

const STATUS_COLOR = {
  Active: 'green',
  Away: 'amber',
  Inactive: 'gray',
} as const

const currency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select ${row.original.name}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('role', { header: 'Role' }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue()
      return <Badge color={STATUS_COLOR[status]}>{status}</Badge>
    },
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (info) => currency(info.getValue()),
  }),
] as ColumnDef<Person>[]

const SORT_ICON = {
  asc: 'ph ph-arrow-up',
  desc: 'ph ph-arrow-down',
  false: 'ph ph-arrows-down-up',
} as const

export default function TanStackTableDemo() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: DATA,
    columns,
    state: { sorting, globalFilter, rowSelection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  })

  const selectedCount = table.getSelectedRowModel().rows.length

  return (
    <div style={{ width: '100%', display: 'grid', gap: 'var(--space-xs)' }}>
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-2xs)',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Input
          type="search"
          placeholder="Filter people…"
          value={globalFilter}
          aria-label="Filter people"
          style={{ maxWidth: '16rem' }}
          onChange={(event) => setGlobalFilter(event.target.value)}
        />
        <span style={{ fontSize: 'var(--step--1)', color: 'var(--color-text-muted, inherit)', opacity: 0.7 }}>
          {selectedCount} of {table.getFilteredRowModel().rows.length} selected
        </span>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sorted = header.column.getIsSorted()
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={
                      sorted === 'asc'
                        ? 'ascending'
                        : sorted === 'desc'
                          ? 'descending'
                          : undefined
                    }
                    style={{ width: header.column.id === 'select' ? '2.5rem' : undefined }}
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 'var(--space-3xs)',
                          background: 'none',
                          border: 0,
                          padding: 0,
                          font: 'inherit',
                          color: 'inherit',
                          cursor: 'pointer',
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        <i
                          className={SORT_ICON[String(sorted) as keyof typeof SORT_ICON]}
                          style={{ opacity: sorted ? 1 : 0.4 }}
                          aria-hidden="true"
                        />
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() ? 'selected' : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {table.getRowModel().rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                style={{ textAlign: 'center', opacity: 0.7 }}
              >
                No people match your filter.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div
        style={{
          display: 'flex',
          gap: 'var(--space-2xs)',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 'var(--step--1)', opacity: 0.7 }}>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <div style={{ display: 'flex', gap: 'var(--space-3xs)' }}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
