export function getPaginationParams(query) {
  const page = Math.max(1, parseInt(query.page) || 1)
  const limit = Math.max(1, parseInt(query.limit) || 10)
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

export function buildMetaPagination(
  totalItems,
  page,
  limit
) {
  const totalPages = Math.ceil(totalItems / limit)
  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
  }
}
