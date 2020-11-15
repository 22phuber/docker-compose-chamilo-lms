const { By, Key, until } = require("selenium-webdriver");

const findElementByTagName = async (driver, name, timeout = 2000) => {
  const element = await driver.findElement(By.tagName(name));
  return element;
}

const getElementByName = async (driver, name, timeout = 2000) => {
  const el = await driver.wait(until.elementLocated(By.name(name)), timeout);
  return await driver.wait(until.elementIsVisible(el), timeout);
}

const getElementByTagName = async (driver, name, timeout = 2000) => {
  const el = await driver.wait(until.elementLocated(By.tagName(name)), timeout);
  return el;
}

export { findElementByTagName, getElementByName, getElementByTagName };
