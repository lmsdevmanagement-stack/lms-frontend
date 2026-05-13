'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Button } from '@/app/components/ui/button';
import type { DataTableColumn } from '@/app/types';

interface DataTableProps<T> {
  title: string;
  description?: string;
  columns: DataTableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  loading?: boolean;
  initialPageSize?: number;
  headerAction?: ReactNode;
  onRowClick?: (row: T) => void;
}

const pageSizeOptions = [10, 25, 50];
const interactiveSelector = 'a,button,input,select,textarea,label,[role="button"]';

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement && Boolean(target.closest(interactiveSelector));
}

export default function DataTable<T>({
  title,
  description,
  columns,
  data,
  emptyMessage = 'No records found.',
  loading = false,
  initialPageSize = 10,
  headerAction,
  onRowClick,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const visibleData = useMemo(() => data.slice(startIndex, startIndex + pageSize), [data, pageSize, startIndex]);
  const firstRecord = data.length === 0 ? 0 : startIndex + 1;
  const lastRecord = Math.min(startIndex + pageSize, data.length);

  useEffect(() => {
    setPage(1);
  }, [data.length, pageSize, title]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!loading && data.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Rows</span>
                <select
                  className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-700"
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                >
                  {pageSizeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {headerAction && (
              <div onClick={(event) => event.stopPropagation()}>
                {headerAction}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                {columns.map((column) => (
                  <TableHead key={column.key} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : visibleData.length > 0 ? (
                visibleData.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className={onRowClick ? 'cursor-pointer' : undefined}
                    onClick={(event) => {
                      if (!onRowClick || isInteractiveTarget(event.target)) return;
                      onRowClick(row);
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.key} className={column.className}>
                        {column.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {!loading && data.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {firstRecord}-{lastRecord} of {data.length}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-9 px-3" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                Previous
              </Button>
              <span className="min-w-20 text-center text-slate-600">
                {page} / {totalPages}
              </span>
              <Button variant="outline" className="h-9 px-3" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
