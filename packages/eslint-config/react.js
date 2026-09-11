import base from './base.js';

export default {
  ...base,
  extends: [
    ...base.extends,
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  settings: {
    react: { version: 'detect' }
  },
  rules: {
    ...base.rules,
    'react/react-in-jsx-scope': 'off'
  }
};
