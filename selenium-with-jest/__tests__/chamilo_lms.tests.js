const { Builder, By, Key, until, Capabilities } = require("selenium-webdriver");
import { findElementByTagName } from "../helpers/helpers";

const grid_url = "http://localhost:4444/wd/hub";
const chamilo_url = "http://chamilo_php7/";

describe("description", () => {
  const chromeCapabilities = Capabilities.chrome();
  chromeCapabilities.set("chromeOptions", { args: ["--headless"] });

  let driver;

  beforeAll(async () => {
    driver = await new Builder()
      .usingServer(grid_url)
      .forBrowser("chrome")
      .withCapabilities(chromeCapabilities)
      .build();

    // eslint-disable-next-line no-undef
    await driver.get(chamilo_url);
  }, 3000);

  afterAll(async () => {
    await driver.quit();
  }, 3000);

  test("test", async () => {
    // const lnk = await getElementByName(driver, 'li1');
    // await lnk.click();

    // const lnk1 = await getElementByName(driver, 'li2');
    // await lnk1.click();

    // const inpf = await getElementById(driver, 'sampletodotext');
    // await inpf.clear();
    // await inpf.sendKeys("Yey, Let's add it to list");

    // const btn = await getElementById(driver, 'addbutton');
    // await btn.click();

    // const output = await getElementByXpath(driver, '//html/body/div/div/div/ul/li[6]/span');
    // const outputVal = await output.getText();
    // console.log(outputVal);

    // expect(outputVal).toEqual("Yey, Let's add it to list");

    // const title = await getElementByTagName(driver, "title");
    // const titleText = await title.getText();

    const title = await (await findElementByTagName(driver, "title")).getAttribute(
      "innerText"
    );
    expect(title).toContain("Chamilo has not been installed");
  }, 3000);
});
