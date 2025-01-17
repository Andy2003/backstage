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
  props: TableProps<CatalogTableRow>,
) {
  const { columns, data, options, ...restProps } = props;
  const { setLimit, setOffset, limit, totalItems, offset, paginationMode } =
    useEntityList();
  const clientPagination = paginationMode === 'none';

  const [page, setPage] = React.useState(
    offset && limit ? Math.floor(offset / limit) : 0,
  );

  useEffect(() => {
    if (clientPagination) {
      return;
    }
    if (totalItems && page * limit >= totalItems) {
      setOffset?.(Math.max(0, totalItems - limit));
    } else {
      setOffset?.(Math.max(0, page * limit));
    }
  }, [setOffset, page, limit, totalItems, clientPagination]);

  const showPagination = (totalItems ?? data.length) > limit;

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
      {...(clientPagination
        ? {}
        : {
            page,
            onPageChange: setPage,
            onRowsPerPageChange: setLimit,
            totalCount: totalItems,
          })}
      {...restProps}
    />
  );
}
