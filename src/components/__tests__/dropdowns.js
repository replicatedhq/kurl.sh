/** @jest-environment jsdom */

import React, { act } from "react";
import { createRoot } from "react-dom/client";
import Select from "react-select";

const options = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
];

it("renders an open react-select dropdown without crashing", () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(
      <Select
        options={options}
        value={options[0]}
        menuIsOpen
        isSearchable={false}
      />
    );
  });

  expect(container.textContent).toContain("A");
  expect(container.textContent).toContain("B");

  act(() => {
    root.unmount();
  });
  container.remove();
});
