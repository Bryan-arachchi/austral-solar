/**
 * Create a sort object from a sortBy string.
 * @param {string} sortBy - Sort option in the format: sortField:(desc|asc)
 * @throws Will throw an error if the sortBy string is not properly formatted.
 * @returns {Object} The sort object. For example: { sortField: -1 }
 * @example
 * // returns { createdAt: -1 }
 * createSortObject('createdAt:desc');
 * @example
 * // returns { firstName: 1 }
 * createSortObject('firstName:asc');
 **/
export const createSortObject = (sortBy: string = 'createdAt:asc'): object => {
  // Check if sortBy is a string and contains the character ':'
  if (typeof sortBy !== 'string' || !sortBy.includes(':')) {
    throw new Error('Invalid sortBy format. Expected format is sortField:(desc|asc).');
  }
  const sortObject = {} as { [key: string]: number };
  const sortByArray = sortBy.split(':');

  const [field, order] = sortByArray;
  // Check if the order is either 'asc' or 'desc'
  if (order !== 'asc' && order !== 'desc') {
    throw new Error('Invalid sort order. The order must be either "asc" or "desc".');
  }
  sortObject[field] = order === 'desc' ? -1 : 1;
  return sortObject;
};

export const removeUndefinedKeys = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (!obj[key]) {
      delete obj[key];
    }
  });
  return obj;
};
