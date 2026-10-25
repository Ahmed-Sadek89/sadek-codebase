import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { PAGINATION, type SortOrder } from './pagination.constants';

export type PaginatedResult<T> = {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
  data: T[];
};

type PaginateOptions<T extends ObjectLiteral> = {
  repository: Repository<T>;
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  page?: number;
  limit?: number;
  relations?: FindOptionsRelations<T>;
  select?: FindOptionsSelect<T>;
  order?: SortOrder;
  /** Column to sort by (default `createdAt`); other columns tie-break by `createdAt` DESC. */
  sortBy?: string;
};

export async function paginate<T extends ObjectLiteral>(
  options: PaginateOptions<T>,
): Promise<PaginatedResult<T>> {
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(PAGINATION.MIN_LIMIT, options.limit || PAGINATION.DEFAULT_LIMIT),
  );
  const page = Math.max(PAGINATION.MIN_PAGE, options.page || PAGINATION.DEFAULT_PAGE);
  const where = options.where ?? {};
  const direction: SortOrder = options.order ?? PAGINATION.DEFAULT_ORDER;
  const sortBy = options.sortBy ?? 'createdAt';
  const order =
    sortBy === 'createdAt'
      ? { createdAt: direction }
      : { [sortBy]: direction, createdAt: 'DESC' };

  const total = await options.repository.count({ where });
  const totalPage = total === 0 ? 0 : Math.ceil(total / limit);

  const data = await options.repository.find({
    where,
    skip: (page - 1) * limit,
    take: limit,
    order: order as unknown as FindOptionsOrder<T>,
    relations: options.relations,
    select: options.select,
  });

  return {
    page,
    limit,
    totalPage,
    total,
    data,
  };
}
