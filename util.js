/**
 * @param {Object} obj
 * @return {Boolean}
 */
module.exports.isObjectEmpty = (obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return false;
}

/** 
 * @param {Object} obj1
 * @param {Object} obj2
 * @return {Boolean}
 */
module.exports.objectsEqual = (obj1, obj2) =>
  typeof o1 === 'object' && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length
    && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
    : o1 === o2;
