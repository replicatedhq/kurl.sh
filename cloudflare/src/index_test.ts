import { describe, it } from "mocha";
import { expect } from "chai";
import { isTerminalRequest } from "./";

const chrome = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36`;

describe("isTerminalRequest", () => {
  describe("curl", () => {

    it("is a curl request", async () => {

      expect(isTerminalRequest("https://kurl.sh/latest", "curl/7.37.0")).to.equal(true);
    });

    it("is chrome", async () => {

      expect(isTerminalRequest("https://kurl.sh/latest", chrome)).to.equal(false);
    });

    it("is chrome containing the script querystring", async () => {

      expect(isTerminalRequest("https://kurl.sh/latest?type=script", chrome)).to.equal(true);
    });

  });
});
