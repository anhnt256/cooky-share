export function isEmpty(value) {
  return value === undefined || value === null || value === '';
}

export function isEmptyObject(obj) {
  if (obj !== null && obj !== undefined) return Object.keys(obj).length === 0;
  return true;
}

