export const truncateStart = (value, limit, suffix = '') => {
  let preValue = value.trim();

  if (!preValue) return '';
  if (value.length <= limit) return value;
  if (limit <= suffix.length) return value;

  preValue = preValue.substr(0, limit - suffix.length);

  return `${preValue.trim()}${suffix}`;
};

export const truncateCenter = (value, limit, suffix = '') => {
  let preValue = value.trim();

  if (!preValue) return '';
  if (value.length <= limit) return value;
  if (limit <= suffix.length) return value;

  preValue =
    preValue.substr(0, limit) +
    suffix +
    preValue.substr(value.trim().length - limit);

  return `${preValue.trim()}`;
};
