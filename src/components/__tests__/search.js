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

// Render the real DocSearch, and record the props Search passes to it.
jest.mock("@docsearch/react", () => {
  const actual = jest.requireActual("@docsearch/react");
  const React = jest.requireActual("react");
  const receivedProps = [];
  const DocSearch = React.forwardRef((props, ref) => {
    receivedProps.push(props);
    return React.createElement(actual.DocSearch, { ...props, ref });
  });
  return { ...actual, DocSearch, receivedProps };
});

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

  // Without `indices`, DocSearch 5 throws while rendering the modal and act()
  // rethrows it, so the test fails above. In production the same error
  // unmounts the page and leaves it blank.
  expect(document.querySelector(".DocSearch-Modal")).not.toBeNull();
  expect(container.querySelector(".DocSearch-Button")).not.toBeNull();

  const { receivedProps } = require("@docsearch/react");
  expect(receivedProps.at(-1).indices).toEqual(["kurl-algolia-config"]);

  await act(async () => {
    root.unmount();
  });
  container.remove();
});
