/** @jsxImportSource react */

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
import {
  type ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
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
  {
    amount: 1280,
    email: 'alice@acme.co',
    id: 1,
    name: 'Alice Johnson',
    role: 'Designer',
    status: 'Active',
  },
  {
    amount: 940,
    email: 'bob@acme.co',
    id: 2,
    name: 'Bob Smith',
    role: 'Engineer',
    status: 'Away',
  },
  {
    amount: 2310,
    email: 'carol@acme.co',
    id: 3,
    name: 'Carol Davis',
    role: 'Product Manager',
    status: 'Active',
  },
  {
    amount: 0,
    email: 'dan@acme.co',
    id: 4,
    name: 'Dan Lee',
    role: 'Engineer',
    status: 'Inactive',
  },
  {
    amount: 1750,
    email: 'erin@acme.co',
    id: 5,
    name: 'Erin Park',
    role: 'Designer',
    status: 'Active',
  },
  {
    amount: 620,
    email: 'frank@acme.co',
    id: 6,
    name: 'Frank Moore',
    role: 'Support',
    status: 'Away',
  },
  {
    amount: 3100,
    email: 'grace@acme.co',
    id: 7,
    name: 'Grace Kim',
    role: 'Engineer',
    status: 'Active',
  },
  {
    amount: 480,
    email: 'henry@acme.co',
    id: 8,
    name: 'Henry Ford',
    role: 'Sales',
    status: 'Inactive',
  },
]

const STATUS_COLOR = {
  Active: 'green',
  Away: 'amber',
  Inactive: 'gray',
} as const

const currency = (value: number) =>
  value.toLocaleString('en-US', { currency: 'USD', style: 'currency' })

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.display({
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select ${row.original.name}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    id: 'select',
  }),
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('role', { header: 'Role' }),
  columnHelper.accessor('status', {
    cell: (info) => {
      const status = info.getValue()
      return <Badge color={STATUS_COLOR[status]}>{status}</Badge>
    },
    header: 'Status',
  }),
  columnHelper.accessor('amount', {
    cell: (info) => currency(info.getValue()),
    header: 'Amount',
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
    columns,
    data: DATA,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 5 } },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: { globalFilter, rowSelection, sorting },
  })

  const selectedCount = table.getSelectedRowModel().rows.length

  return (
    <div style={{ display: 'grid', gap: 'var(--space-xs)', width: '100%' }}>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-2xs)',
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
        <span
          style={{
            color: 'var(--color-text-muted, inherit)',
            fontSize: 'var(--step--1)',
            opacity: 0.7,
          }}
        >
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
                    style={{
                      width:
                        header.column.id === 'select' ? '2.5rem' : undefined,
                    }}
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          alignItems: 'center',
                          background: 'none',
                          border: 0,
                          color: 'inherit',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          font: 'inherit',
                          gap: 'var(--space-3xs)',
                          padding: 0,
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        <i
                          className={
                            SORT_ICON[String(sorted) as keyof typeof SORT_ICON]
                          }
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
                style={{ opacity: 0.7, textAlign: 'center' }}
              >
                No people match your filter.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-2xs)',
          justifyContent: 'space-between',
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
