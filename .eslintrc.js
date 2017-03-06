module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "globals": {
    "componentHandler": false,
    "module": false
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "comma-dangle": [
      "error",
      "always-multiline"
    ],
    "no-unused-vars": [
      "error",
      {
        "varsIgnorePattern": "^(m)$"
      }
    ],
    "react/no-unknown-property": 0,
    "react/prop-types": 0
  }
};
