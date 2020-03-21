const sortNumsAscending = (a, b) => {
  if (!a) return 1;
  if (!b) return -1;
  return a - b;
};
const sortNumsDescending = (a, b) => {
  if (!a) return 1;
  if (!b) return -1;
  return b - a;
};
const sortStringsAscending = (a, b) => {
  if (!a) return 1;
  if (!b) return -1;
  if (a.toLowerCase() < b.toLowerCase()) {
    return -1;
  }
  if (a.toLowerCase() > b.toLowerCase()) {
    return 1;
  }
  return 0;
};
const sortStringsDescending = (a, b) => {
  if (!a) return 1;
  if (!b) return -1;
  if (a.toLowerCase() < b.toLowerCase()) {
    return 1;
  }
  if (a.toLowerCase() > b.toLowerCase()) {
    return -1;
  }
  return 0;
};

export {
  sortNumsAscending,
  sortNumsDescending,
  sortStringsAscending,
  sortStringsDescending
};
