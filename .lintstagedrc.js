module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write', 'git add'],
  '*.{json,css,md,yml,yaml}': ['prettier --write', 'git add'],
};
