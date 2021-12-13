export const removeFilename = (current: string, filename: string): string => {
  const escapedFilename = escapeRegExp(filename);
  const regexp = new RegExp(`^${escapedFilename}$[\\n|\\r|\\r\\n]?`, "gm");
  return current.replace(regexp, "");
};

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^=!:${}()|[\]\/\\]/g, "\\$&");
};
