/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect } from 'react';

import { Table, TableProps } from '@backstage/core-components';
import { CatalogTableRow } from './types';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { CatalogTableToolbar } from './CatalogTableToolbar';

/**
 * @internal
 */
export function OffsetPaginatedCatalogTable(
  props: TableProps<CatalogTableRow> & {
    // If true, the pagination will be handled client side, the table will use all rows provided in the data prop
    clientPagination?: boolean;
  },
) {
  const { columns, data, options, clientPagination, ...restProps } = props;
  const { setLimit, setOffset, limit, totalItems, offset } = useEntityList();

  const [page, setPage] = React.useState(
    offset && limit ? Math.floor(offset / limit) : 0,
  );

  useEffect(() => {
    if (totalItems && page * limit >= totalItems) {
      setOffset?.(Math.max(0, totalItems - limit));
    } else {
      setOffset?.(Math.max(0, page * limit));
    }
  }, [setOffset, page, limit, totalItems]);

  const showPagination =
    (clientPagination ? data.length : totalItems ?? data.length) > limit;

  return (
    <Table
      columns={columns}
      data={data}
      options={{
        pageSizeOptions: [5, 10, 20, 50, 100],
        pageSize: limit,
        emptyRowsWhenPaging: false,
        paging: showPagination,
        ...options,
      }}
      components={{
        Toolbar: CatalogTableToolbar,
      }}
      page={clientPagination ? undefined : page}
      onPageChange={clientPagination ? undefined : newPage => setPage(newPage)}
      onRowsPerPageChange={
        clientPagination ? undefined : pageSize => setLimit(pageSize)
      }
      totalCount={clientPagination ? undefined : totalItems}
      {...restProps}
    />
  );
}
