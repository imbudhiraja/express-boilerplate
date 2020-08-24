module.exports = {
  extends: 'imbudhiraja',
  rules: {
    'filenames/match-exported': [2, 'kebab'],
    'linebreak-style': 'off',
    'max-lines': ["error", {"max": 1000, "skipComments": true, "skipBlankLines": true }],
    'no-console': 'off',
    'no-underscore-dangle': 'off'
  },
};
