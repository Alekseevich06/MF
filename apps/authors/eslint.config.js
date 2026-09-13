import reactConfig from '@bookhub/eslint-config/react';

export default [
  ...reactConfig,
  {
    files: ['src/**/*.{ts,tsx}']
  }
];
