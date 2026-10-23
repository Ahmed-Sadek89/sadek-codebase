/** One query as a section receives it from HomePage. */
export type QueryState<T> = { data: T; isLoading: boolean; isError: boolean };

/** Maps a TanStack query result to the props a section receives. */
export function toQueryState<TResponse, T>(
  query: { data: TResponse | undefined; isPending: boolean; isError: boolean },
  select: (data: TResponse | undefined) => T,
): QueryState<T> {
  return {
    data: select(query.data),
    isLoading: query.isPending,
    isError: query.isError,
  };
}

/** An infinite list as a section receives it: every loaded item plus "show more". */
export type InfiniteQueryState<T> = QueryState<T[]> & {
  /** False once the last page is loaded. */
  hasMore: boolean;
  /** True while the next page loads. */
  isLoadingMore: boolean;
  loadMore: () => void;
};

/** Maps a TanStack infinite query over `paginate()` pages to section props. */
export function toInfiniteState<T>(query: {
  data: { pages: { data: T[] }[] } | undefined;
  isPending: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
}): InfiniteQueryState<T> {
  return {
    // Every loaded page, in order; "Show more" appends the next one.
    ...toQueryState(query, (data) =>
      data ? data.pages.flatMap((page) => page.data) : [],
    ),
    hasMore: query.hasNextPage,
    isLoadingMore: query.isFetchingNextPage,
    loadMore: () => void query.fetchNextPage(),
  };
}
