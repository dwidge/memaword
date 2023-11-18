import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/preact";

export function setupTests() {
  document.execCommand = vi.fn();
  afterEach(cleanup);
}
