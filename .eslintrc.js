module.exports = {
  extends: ["next/core-web-vitals"],
  parserOptions: {
    ecmaVersion: "latest"
  },
  rules: {
    "@next/next/no-img-element": "off",
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/alt-text": "off",
    "jsx-a11y/role-supports-aria-props": "warn",
    "import/no-anonymous-default-export": "off",
    "react/display-name": "off",
    "react/jsx-key": "warn",
    "react/no-array-index-key": "off"
  }
}
