const { By, Key, until } = require("selenium-webdriver");

const findElementByTagName = async (driver, name, timeout = 2000) => {
  const element = await driver.wait(
    until.elementLocated(By.css(name)),
    timeout
  );
  return element;
};

/**
 * Get a visible element by css selector. Waits for element to be displayed in the rendered page
 * @param {*} driver
 * @param {*} name
 * @param {*} timeout
 */
const findVisibleElementByCssSelector = async (driver, name, timeout = 2000) => {
  const element = await driver.wait(
    until.elementLocated(By.css(name)),
    timeout
  );
  return await driver.wait(until.elementIsVisible(element), timeout);
};

const getVisibleElementByName = async (driver, name, timeout = 2000) => {
  const element = await driver.wait(
    until.elementLocated(By.name(name)),
    timeout
  );
  return await driver.wait(until.elementIsVisible(element), timeout);
};

const getVisibleElementById = async (driver, id, timeout = 2000) => {
  const element = await driver.wait(until.elementLocated(By.id(id)), timeout);
  return await driver.wait(until.elementIsVisible(element), timeout);
};

const getVisibleElementByXpath = async (driver, xpath, timeout = 2000) => {
  const element = await driver.wait(
    until.elementLocated(By.xpath(xpath)),
    timeout
  );
  return await driver.wait(until.elementIsVisible(element), timeout);
};

export {
  findElementByTagName,
  findVisibleElementByCssSelector,
  getVisibleElementByName,
  getVisibleElementByXpath,
  getVisibleElementById,
};
