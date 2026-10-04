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

  const total = await options.repository.count({ where });
  const totalPage = total === 0 ? 0 : Math.ceil(total / limit);

  const data = await options.repository.find({
    where,
    skip: (page - 1) * limit,
    take: limit,
    order: { createdAt: direction } as unknown as FindOptionsOrder<T>,
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
