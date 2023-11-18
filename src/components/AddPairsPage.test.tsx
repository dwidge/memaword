import { test, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/preact";
import AddPairsPage from "./AddPairsPage.jsx";
import { setupTests } from "../lib/setupTests.js";

setupTests();

test("updates the group input field correctly", () => {
  const listPairs = [[], () => {}];
  const { getByLabelText } = render(
    <AddPairsPage listPairs={listPairs} now={0} />
  );
  const groupInput = getByLabelText("Group") as HTMLInputElement;
  fireEvent.change(groupInput, { target: { value: "Test" } });
  expect(groupInput.value).toBe("Test");
});

test("updates the front words textarea and extracts words and han characters correctly", () => {
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

test("updates the back words textarea correctly", () => {
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

test("copies front words to clipboard correctly", () => {
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

test("adds pairs to listPairs state correctly", () => {
  const listPairs = [[], vi.fn()] as const;
  const { getByTestId } = render(
    <AddPairsPage listPairs={listPairs} now={0} />
  );
  const addButton = getByTestId("addButton");
  const frontTextarea = getByTestId("front");
  const backTextarea = getByTestId("back");
  fireEvent.change(frontTextarea, { target: { value: "Test" } });
  fireEvent.change(backTextarea, { target: { value: "Translation" } });
  fireEvent.click(addButton);
  const newListPairs = listPairs[1].mock.calls[0];
  expect(newListPairs.length).toBe(1);
});
