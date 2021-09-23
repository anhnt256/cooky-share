class utils {
  isEmpty(value) {
    return value === undefined || value === null || value === '';
  }

  isEmptyObject(obj) {
    if (obj !== null && obj !== undefined) return Object.keys(obj).length === 0;
    return true;
  }
}

module.export = utils;
