export const SaveArray = (key, array) => {
  const arrStr = JSON.stringify(array);
  localStorage.setItem(key, arrStr);
};

export const getArray = (key) => {
  const data = localStorage.getItem(key);
  if (!data) return [];
  return JSON.parse(data);
};
