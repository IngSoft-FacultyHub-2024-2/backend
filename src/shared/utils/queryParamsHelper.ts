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
  const page: number | undefined = parseInt(queryParams.page as string, 10) || undefined;
  const pageSize: number | undefined = parseInt(queryParams.pageSize as string, 10) || undefined;

  // Extract filters by excluding known keys
  const filters: Record<string, any> = Object.keys(queryParams).reduce((acc, key) => {
    if (!['sortField', 'sortOrder', 'page', 'pageSize'].includes(key)) {
      acc[key] = queryParams[key];
    }
    return acc;
  }, {} as Record<string, any>);
  return { filters, sortField, sortOrder, page, pageSize };
}