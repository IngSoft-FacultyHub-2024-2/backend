import "tsarch/dist/jest";

import { filesOfProject } from "tsarch";
import path from "path"

describe("architecture", () => {
    jest.setTimeout(60000);

  it("controllers should only be placed on controllers folder ", async () => {
    const folder = path.join(__dirname, "src")
    const rule = filesOfProject()
      .inFolder(folder + "/controllers")
      .should()
      .beInFolder(folder + "/controllers")
     await expect(rule).toPassAsync();
  });

  it("modules should only depend on other modules", async () => {
    const configFile = path.resolve('.', 'tsconfig.json');
    const folderPath = path.dirname(configFile);
    const rule = filesOfProject()
      .inFolder(folderPath + "/modules")
      .should()
      .dependOnFiles()
      .inFolder(folderPath + "/modules")
     await expect(rule).toPassAsync();

  });

  it("modules logic should be cycle free", async ()=> {
    const rule = filesOfProject()
        .inFolder("modules")
        .should()
        .beFreeOfCycles()

    await expect(rule).toPassAsync()
  });

});