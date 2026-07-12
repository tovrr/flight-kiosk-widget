import next from "eslint-config-next/core-web-vitals";

// Next 16 ships a flat ESLint config; consume it directly (no FlatCompat).
const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "public/sw.js"] },
  ...next,
];

export default eslintConfig;
