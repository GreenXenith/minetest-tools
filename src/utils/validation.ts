const modNamePattern = /^[a-z_]+$/;

/**
 * Return true if providen mod name is valid (ie contains only `[a-z_]`)
 */
function validateModName(value: string): boolean {
  return value.match(modNamePattern) !== null;
}

export { validateModName };
