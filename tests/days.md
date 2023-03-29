## Adding a New Test Case for Days

If you're introducing a new case to test for a day in the Time class, here are the steps to follow:

- First, navigate to the `days.test.ts` file located in the `tests` folder.
- Copy one of the existing describe blocks that corresponds to the day you're testing for (e.g. `isThursday()`, `isFriday13th()`, etc.).
- Paste the describe block into the file, and rename it to the day you're testing for.
- Within the describe block, add a new it block to test your specific case.
- In the `it` block, create a new `Date` object with the date and time you want to test.
- Use `jest.spyOn(`) to mock the `now` function of the `Time` class and return the Date object you just created.
- Call the method you're testing on the `time` object, and use `expect` to test whether the result is what you expect it to be.
- Save the file, and run the tests to ensure everything is working as expected.

Here's an example of what your new `it` block might look like:

```
it('returns true if it is a holiday', () => {
  const date = new Date('December 25, 2023 00:00:00')
  jest.spyOn(time, 'now').mockImplementation(() => date)
  expect(time.isHolidays()).toBe(true)
})
```

And that's it! By following these steps, you can add new test cases to the `Time` class to ensure that it's working correctly for all days and times.