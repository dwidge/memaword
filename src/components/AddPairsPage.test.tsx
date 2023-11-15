import { test, expect } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import AddPairsPage from "./AddPairsPage.jsx";

test("updates the group input field correctly", () => {
  const listPairs = [[], () => {}];
  const { getByLabelText } = render(
    <AddPairsPage listPairs={listPairs} now={0} />
  );
  const groupInput = getByLabelText("Group") as HTMLInputElement;
  fireEvent.change(groupInput, { target: { value: "Test" } });
  expect(groupInput.value).toBe("Test");
});

test.skip("updates the front words textarea and extracts words and han characters correctly", () => {
  const listPairs = [[], () => {}];
  const { getByTestId, getByText } = render(
    <AddPairsPage listPairs={listPairs} now={0} />
  );
  const frontTextarea = getByTestId("front") as HTMLTextAreaElement;
  fireEvent.change(frontTextarea, { target: { value: "Test\n测试" } });
  expect(frontTextarea.value).toBe("Test\n测试");
  fireEvent.click(getByText("Words"));
  // Assert the words extraction logic
  fireEvent.click(getByText("Han"));
  // Assert the han character extraction logic
});

test.skip("updates the back words textarea correctly", () => {
  const listPairs = [[], () => {}];
  const { getByTestId } = render(
    <AddPairsPage listPairs={listPairs} now={0} />
  );
  const backTextarea = getByTestId("back") as HTMLTextAreaElement;
  fireEvent.change(backTextarea, {
    target: { value: "Translation 1\nTranslation 2" },
  });
  expect(backTextarea.value).toBe("Translation 1\nTranslation 2");
});

test.skip("copies front words to clipboard correctly", () => {
  const listPairs = [[], () => {}];
  const { getByTestId } = render(
    <AddPairsPage listPairs={listPairs} now={0} />
  );
  const copyButton = getByTestId("copyButton");
  const frontTextarea = getByTestId("front");
  fireEvent.change(frontTextarea, { target: { value: "Test" } });
  fireEvent.click(copyButton);
  // Add an assertion to check if the text was copied to clipboard
});

test.skip("adds pairs to listPairs state correctly", () => {
  const listPairs = [[], () => {}];
  const { getByTestId } = render(
    <AddPairsPage listPairs={listPairs} now={0} />
  );
  const addButton = getByTestId("addButton");
  const frontTextarea = getByTestId("front");
  const backTextarea = getByTestId("back");
  fireEvent.change(frontTextarea, { target: { value: "Test" } });
  fireEvent.change(backTextarea, { target: { value: "Translation" } });
  fireEvent.click(addButton);
  expect(listPairs[0].length).toBe(1);
});
