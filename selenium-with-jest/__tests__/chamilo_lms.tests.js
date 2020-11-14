const { Builder, By, Key, until, Capabilities } = require("selenium-webdriver");

const grid_url = "http://localhost:4444/wd/hub";
const chamilo_url = "http://host.docker.internal:8080/";

const getElementByName = async (driver, name, timeout = 2000) => {
  const el = await driver.wait(until.elementLocated(By.name(name)), timeout);
  return await driver.wait(until.elementIsVisible(el), timeout);
};

const getElementByTagName = async (driver, name, timeout = 2000) => {
  const el = await driver.wait(until.elementLocated(By.tagName(name)), timeout);
  return el;
};

describe("description", () => {

  const chromeCapabilities = Capabilities.chrome();
  chromeCapabilities.set('chromeOptions', {args: ['--headless']});

  let driver;

  beforeAll(async () => {
    driver = await new Builder()
      .usingServer(grid_url)
      .forBrowser('chrome')
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

    const title = await driver.findElement(By.tagName("title")).getAttribute("innerText");
    expect(title).toContain("Chamilo has not been installed");
  }, 3000);
});
