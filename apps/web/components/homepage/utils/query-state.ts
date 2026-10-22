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
