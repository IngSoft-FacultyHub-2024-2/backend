import "tsarch/dist/jest";

import { filesOfProject } from "tsarch";

describe("architecture", () => {
    jest.setTimeout(60000);

  it("controllers should only be placed on controllers folder ", async () => {
    const rule = filesOfProject()
      .inFolder("controllers")
      .should()
      .beInFolder("controllers")
     await expect(rule).toPassAsync();
  });

  it("modules should only depend on other modules", async () => {
    const rule = filesOfProject()
      .inFolder("modules")
      .should()
      .dependOnFiles()
      .inFolder("modules")
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