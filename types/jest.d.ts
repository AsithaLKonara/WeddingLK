declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(_className: string): R;
      toHaveAttribute(_attr: string, value?: string): R;
      toHaveTextContent(_text: string | RegExp): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeRequired(): R;
      toHaveValue(_value: string | string[] | number): R;
      toHaveDisplayValue(_value: string | RegExp | (string | RegExp)[]): R;
      toBeChecked(): R;
      toHaveFocus(): R;
      toHaveFormValues(expectedValues: Record<string, any>): R;
      toHaveStyle(_css: string | Record<string, any>): R;
      toHaveAccessibleName(_name: string | RegExp): R;
      toHaveAccessibleDescription(_name: string | RegExp): R;
    }
  }

  var jest: (typeof import('@jest/globals'))['jest'];
  var describe: (typeof import('@jest/globals'))['describe'];
  var it: (typeof import('@jest/globals'))['it'];
  var test: (typeof import('@jest/globals'))['test'];
  var expect: (typeof import('@jest/globals'))['expect'];
  var beforeEach: (typeof import('@jest/globals'))['beforeEach'];
  var afterEach: (typeof import('@jest/globals'))['afterEach'];
  var beforeAll: (typeof import('@jest/globals'))['beforeAll'];
  var afterAll: (typeof import('@jest/globals'))['afterAll'];
}

export {};
