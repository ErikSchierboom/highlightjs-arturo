import { describe, expect, test } from "bun:test";
import { Glob } from "bun";
import Path from "path";
import hljs from "highlight.js";
import hljsDefineArturo from "../src/arturo";

hljs.registerLanguage("arturo", hljsDefineArturo);

test("detect", async () => {
  const code = await Bun.file(
    Path.join(__dirname, "detect", "default.txt")
  ).text();
  const actual = hljs.highlightAuto(code).language;
  expect(actual).toBe("arturo");
});

describe("markup", async () => {
  const markupFilePaths = new Glob("test/markup/*.txt").scan(".");
  const toExpectedPath = (path: Path.ParsedPath) =>
    Path.format({ ...path, base: "", ext: ".expected" });

  for await (const filePath of markupFilePaths) {
    const path = Path.parse(filePath);

    test(path.name, async () => {
      const actual = hljs.highlight("arturo", await Bun.file(filePath).text());
      const expected = await Bun.file(toExpectedPath(path)).text();
      expect(actual.value.trim()).toBe(expected.trim());
    });
  }
});
