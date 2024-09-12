interface QueryParams {
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: string;
    pageSize?: string;
    [key: string]: any; // To allow dynamic query parameters
  }
  
export function extractParameters(queryParams: QueryParams) {
  const sortField: string | undefined = queryParams.sortField;
  const sortOrder: 'ASC' | 'DESC' | undefined  = (queryParams.sortOrder as 'ASC' | 'DESC') || undefined;
  const page: number = parseInt(queryParams.page as string, 10) || 1;
  const pageSize: number = parseInt(queryParams.pageSize as string, 10) || 10;
  const search: string | undefined = queryParams.search as string || undefined;

  // Extract filters by excluding known keys
  const filters: Record<string, any> = Object.keys(queryParams).reduce((acc, key) => {
    if (!['sortField', 'sortOrder', 'page', 'pageSize', 'search'].includes(key)) {
      acc[key] = queryParams[key];
    }
    return acc;
  }, {} as Record<string, any>);
  return { filters, sortField, sortOrder, page, pageSize, search };
}