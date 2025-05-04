const sortObject = (obj) =>
  Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});

export default sortObject;
