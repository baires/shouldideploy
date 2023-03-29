## How to Add New Test Cases to Time Class

This guide provides instructions on how to add new test cases to the `Time` class.
Getting Started

- Open the `tests/time.test.ts` file in your code editor.
- Identify the test suite you want to add new test cases to. In this example, we will use the test suite named "should correctly identify timezone existence".

To add a new test case, add an it block inside the `describe` block of the test suite.

```
describe('Time Class', () => {
  test('should correctly identify timezone existence', () => {
    expect(Time.zoneExists('America/Argentina/Buenos_Aires')).toBe(true)
    expect(Time.zoneExists('Invalid/Timezone')).toBe(false)
  })

  it('should return true if timezone is valid', () => {
    // Add your test case here
  })
})
```

Write your test case inside the `it` block, using `expect` to assert the expected behavior.

```
it('should return true if timezone is valid', () => {
  expect(Time.zoneExists('America/New_York')).toBe(true)
})
```
Run the tests using the command `npm test` to ensure that your new test case passes.

```
npm test
```
