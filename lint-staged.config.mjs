/**
 * Pre-commit checks (run by .husky/pre-commit): no console.log, no `any`,
 * no unused code, and at most 200 lines per file. The rules live in
 * @repo/eslint-config; apps/sadek-backend keeps its own lint setup.
 */
const EXCLUDED = /(^|\/)apps\/sadek-backend\//;

export default {
  "*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}": (files) => {
    const checked = files.filter((file) => !EXCLUDED.test(file));
    if (checked.length === 0) return [];
    const args = checked.map((file) => JSON.stringify(file)).join(" ");
    // ESLint 10 uses the config nearest each file; only-warn turns every
    // rule into a warning, so --max-warnings 0 is what fails the commit.
    return `eslint --max-warnings 0 --no-warn-ignored ${args}`;
  },
};
