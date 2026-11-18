/** @jest-environment jsdom */

import { ReadableStream, TransformStream, WritableStream } from "stream/web";
import { TextDecoder, TextEncoder } from "util";

// jsdom lacks these, and DocSearch's dependencies need them at import time.
Object.assign(global, { ReadableStream, TransformStream, WritableStream, TextDecoder, TextEncoder });
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
});
window.scrollTo = () => {};

const React = require("react");
const { act } = React;
const { createRoot } = require("react-dom/client");
const Search = require("../Search").default;

it("opens the DocSearch modal without crashing", async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  process.env.GATSBY_ALGOLIA_APP_ID = "test-app";
  process.env.GATSBY_ALGOLIA_API_KEY = "test-key";
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(<Search />);
  });

  const button = container.querySelector(".DocSearch-Button");
  expect(button).not.toBeNull();

  await act(async () => {
    button.click();
  });

  // DocSearch 5 throws while rendering the modal when `indices` is missing,
  // which unmounts the page and leaves it blank.
  expect(document.querySelector(".DocSearch-Modal")).not.toBeNull();
  expect(container.querySelector(".DocSearch-Button")).not.toBeNull();

  await act(async () => {
    root.unmount();
  });
  container.remove();
});
