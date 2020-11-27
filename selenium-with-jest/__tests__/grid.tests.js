const { Builder, By, Key, until, Capabilities } = require("selenium-webdriver");
import {
  findElementByTagName,
  findVisibleElementByCssSelector,
  getVisibleElementByName,
  getVisibleElementByXpath,
  getVisibleElementById,
} from "../helpers/helpers";

const grid_url = "http://localhost:4444/wd/hub";
const chamilo_url = "http://chamilo_php7/";

// Google Chrome Capabilities
const chromeCapabilities = Capabilities.chrome();
chromeCapabilities.set("goog:chromeOptions", { args: ["--headless"] });
// Mozilla Firefox Capabilities
const firefoxCapabilities = Capabilities.firefox();
firefoxCapabilities.set("moz:firefoxOptions", { args: ["--headless"] });


/***********/
/* Firefox */
/***********/
// Tests wizard until Step6 (no installation)
describe("Firefox", () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder()
      .usingServer(grid_url)
      .forBrowser("firefox")
      .withCapabilities(firefoxCapabilities)
      .build();

    // eslint-disable-next-line no-undef
    await driver.get(chamilo_url);
  }, 10000);

  afterAll(async () => {
    await driver.quit();
  }, 10000);

  test("Welcome page", async () => {
    // Browser title has correct content
    const title = await (
      await findElementByTagName(driver, "title")
    ).getAttribute("innerText");
    expect(title).toContain("Chamilo has not been installed");

    // Wizard welcome title has correct content
    const WelcomeH2XPath =
      "/html/body/div/div/div/div/div[2]/div/div/form/div/div/div/h2";
    const WelcomeText = await (
      await getVisibleElementByXpath(driver, WelcomeH2XPath)
    ).getText();
    expect(WelcomeText).toContain(
      "Welcome to the Chamilo 1.11.12 stable installation wizard"
    );
  }, 3000);

  test("Setup wizard, test database connection", async () => {
    // Find and click install button
    const installButton = await findVisibleElementByCssSelector(
      driver,
      "button[type=submit]"
    );
    await installButton.click();

    /**************/
    /* Step1 Page */
    /**************/

    // Step1: Browser title has correct content
    const wizardTitle = await (
      await findElementByTagName(driver, "title")
    ).getAttribute("innerText");
    expect(wizardTitle).toContain("— Chamilo installation — Version 1.11.12");

    // Step1: Wizard page h2 title
    const wizardH2XPath =
      "/html/body/div/div/div/div[1]/div/div[1]/form/div/h2";
    const wizardStep1H2Text = await (
      await getVisibleElementByXpath(driver, wizardH2XPath)
    ).getText();
    expect(wizardStep1H2Text).toContain("Step 1 – Installation Language");

    // Step1: Next Button
    const step1NextButton = await getVisibleElementByName(driver, "step1");
    const step1NextButtonValue = await step1NextButton.getAttribute("value");
    expect(step1NextButtonValue).toContain("Next");
    await step1NextButton.click();

    /**************/
    /* Step2 Page */
    /**************/

    // Step2: Wizard page h2 title
    const wizardStep2H2Text = await (
      await getVisibleElementByXpath(driver, wizardH2XPath)
    ).getText();
    expect(wizardStep2H2Text).toContain("Step 2 – Requirements");

    // Step2: Install Button
    const step2NextButton = await getVisibleElementByName(
      driver,
      "step2_install"
    );
    const step2NextButtonValue = await step2NextButton.getAttribute("value");
    expect(step2NextButtonValue).toContain("New installation");
    await step2NextButton.click();

    /**************/
    /* Step3 Page */
    /**************/

    // Step3: Wizard page header h2 title
    const headerPageHeaderTitleXPath =
      "/html/body/div/div/div/div[1]/div/div[1]/form/div[1]";
    const step3PageHeaderTitleText = await (
      await getVisibleElementByXpath(driver, headerPageHeaderTitleXPath)
    ).getText();
    expect(step3PageHeaderTitleText).toContain("New installation");

    // Step3: Wizard page h2 title
    const wizardNewInstallH2XPath =
      "/html/body/div/div/div/div[1]/div/div[1]/form/div[2]/h2";
    const wizardStep3H2Text = await (
      await getVisibleElementByXpath(driver, wizardNewInstallH2XPath)
    ).getText();
    expect(wizardStep3H2Text).toContain("Step 3 – Licence");

    // Step3: Accept license checkbox
    const step3AcceptLicence = await getVisibleElementById(
      driver,
      "accept_licence"
    );
    if (!(await step3AcceptLicence.isSelected())) {
      await step3AcceptLicence.click();
    }
    expect(await step3AcceptLicence.isSelected()).toBeTruthy();

    // Step3: Next Button
    const step3NextButton = await getVisibleElementByName(driver, "step3");
    const step3NextButtonValue = await step3NextButton.getAttribute("value");
    expect(step3NextButtonValue).toContain("Next");
    await step3NextButton.click();

    /**************/
    /* Step4 Page */
    /**************/

    // Step4: Wizard page header h2 title
    const step4PageHeaderTitleText = await (
      await getVisibleElementByXpath(driver, headerPageHeaderTitleXPath)
    ).getText();
    expect(step4PageHeaderTitleText).toContain("New installation");

    // Step4: Wizard page h2 title
    const wizardStep4H2Text = await (
      await getVisibleElementByXpath(driver, wizardNewInstallH2XPath)
    ).getText();
    expect(wizardStep4H2Text).toContain("Step 4 – MySQL database settings");

    // Step4: Enter form field values
    const dbHostFormField = await findVisibleElementByCssSelector(
      driver,
      "input[name=dbHostForm][type=text]"
    );
    await dbHostFormField.clear();
    await dbHostFormField.sendKeys("mariadb");

    const dbUsernameFormField = await findVisibleElementByCssSelector(
      driver,
      "input[name=dbUsernameForm][type=text]"
    );
    await dbUsernameFormField.clear();
    await dbUsernameFormField.sendKeys("chamilo");

    const dbPassFormFormField = await findVisibleElementByCssSelector(
      driver,
      "input[name=dbPassForm][type=password]"
    );
    await dbPassFormFormField.clear();
    await dbPassFormFormField.sendKeys("chamilo");

    // Step4: Database connection test Button
    const step4TestDatabaseButton = await getVisibleElementByName(
      driver,
      "step3"
    );
    const step4TestDatabaseButtonValue = await step4TestDatabaseButton.getAttribute(
      "value"
    );
    expect(step4TestDatabaseButtonValue).toContain("step3");
    await step4TestDatabaseButton.click();

    // Step4: Test database connection
    const dbConnectionStatus = await getVisibleElementById(driver, "db_status");
    const dbConnectionStatusClasses = await dbConnectionStatus.getAttribute(
      "class"
    );
    expect(dbConnectionStatusClasses).toContain("alert-success");

    // Step4: Next Button
    const step4NextButton = await getVisibleElementByName(driver, "step4");
    const step4NextButtonValue = await step4NextButton.getAttribute("value");
    expect(step4NextButtonValue).toContain("Next");
    await step4NextButton.click();

    /**************/
    /* Step5 Page */
    /**************/

    // Step5: Wizard page header h2 title
    const step5PageHeaderTitleText = await (
      await getVisibleElementByXpath(driver, headerPageHeaderTitleXPath)
    ).getText();
    expect(step5PageHeaderTitleText).toContain("New installation");

    // Step5: Wizard page h2 title
    const wizardStep5H2Text = await (
      await getVisibleElementByXpath(driver, wizardNewInstallH2XPath)
    ).getText();
    expect(wizardStep5H2Text).toContain("Step 5 – Config settings");

    // Step5: Enter form field values
    const passFormField = await findVisibleElementByCssSelector(
      driver,
      "input[name=passForm][type=password]"
    );
    await passFormField.clear();
    await passFormField.sendKeys("admin");

    // Step4: Next Button
    const step5NextButton = await getVisibleElementByName(driver, "step5");
    const step5NextButtonValue = await step5NextButton.getAttribute("value");
    expect(step5NextButtonValue).toContain("Next");
    await step5NextButton.click();

    /**************/
    /* Step6 Page */
    /**************/

    // Step6: Wizard page header h2 title
    const step6PageHeaderTitleXPath =
      "/html/body/div/div/div/div[1]/div/div[1]/form/div[1]/h2";
    const step6PageHeaderTitleText = await (
      await getVisibleElementByXpath(driver, step6PageHeaderTitleXPath)
    ).getText();
    expect(step6PageHeaderTitleText).toContain("New installation");

    // Step6: Wizard page h2 title
    const wizardNewInstallH3XPath =
      "/html/body/div/div/div/div[1]/div/div[1]/form/div[2]/h3";
    const wizardStep6H2Text = await (
      await getVisibleElementByXpath(driver, wizardNewInstallH3XPath)
    ).getText();
    expect(wizardStep6H2Text).toContain("Step 6 – Last check before install");
  }, 30000);
});


/**********/
/* Chrome */
/**********/
// Tests wizard and installs chamilo
describe("Chrome", () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder()
      .usingServer(grid_url)
      .forBrowser("chrome")
      .withCapabilities(chromeCapabilities)
      .build();

    // eslint-disable-next-line no-undef
    await driver.get(chamilo_url);
  }, 10000);

  afterAll(async () => {
    await driver.quit();
  }, 10000);

  test("Welcome page", async () => {
    // Browser title has correct content
    const title = await (
      await findElementByTagName(driver, "title")
    ).getAttribute("innerText");
    expect(title).toContain("Chamilo has not been installed");

    // Wizard welcome title has correct content
    const WelcomeH2XPath =
      "/html/body/div/div/div/div/div[2]/div/div/form/div/div/div/h2";
    const WelcomeText = await (
      await getVisibleElementByXpath(driver, WelcomeH2XPath)
    ).getText();
    expect(WelcomeText).toContain(
      "Welcome to the Chamilo 1.11.12 stable installation wizard"
    );
  }, 3000);

  test("Setup wizard, test database connection, install chamilo, login admin user", async () => {
    // Find and click install button
    const installButton = await findVisibleElementByCssSelector(
      driver,
      "button[type=submit]"
    );
    await installButton.click();

    /**************/
    /* Step1 Page */
    /**************/

    // Step1: Browser title has correct content
    const wizardTitle = await (
      await findElementByTagName(driver, "title")
    ).getAttribute("innerText");
    expect(wizardTitle).toContain("— Chamilo installation — Version 1.11.12");

    // Step1: Wizard page h2 title
    const wizardH2XPath =
      "/html/body/div/div/div/div[1]/div/div[1]/form/div/h2";
    const wizardStep1H2Text = await (
      await getVisibleElementByXpath(driver, wizardH2XPath)
    ).getText();
    expect(wizardStep1H2Text).toContain("Step 1 – Installation Language");

    // Step1: Next Button
    const step1NextButton = await getVisibleElementByName(driver, "step1");
    const step1NextButtonValue = await step1NextButton.getAttribute("value");
    expect(step1NextButtonValue).toContain("Next");
    await step1NextButton.click();

    /**************/
    /* Step2 Page */
    /**************/

    // Step2: Wizard page h2 title
    const wizardStep2H2Text = await (
      await getVisibleElementByXpath(driver, wizardH2XPath)
    ).getText();
    expect(wizardStep2H2Text).toContain("Step 2 – Requirements");

    // Step2: Install Button
    const step2NextButton = await getVisibleElementByName(
      driver,
      "step2_install"
    );
    const step2NextButtonValue = await step2NextButton.getAttribute("value");
    expect(step2NextButtonValue).toContain("New installation");
    await step2NextButton.click();

    /**************/
    /* Step3 Page */
    /**************/

    // Step3: Wizard page header h2 title
    const headerPageHeaderTitleXPath =
      "/html/body/div/div/div/div[1]/div/div[1]/form/div[1]";
    const step3PageHeaderTitleText = await (
      await getVisibleElementByXpath(driver, headerPageHeaderTitleXPath)
    ).getText();
    expect(step3PageHeaderTitleText).toContain("New installation");

    // Step3: Wizard page h2 title
    const wizardNewInstallH2XPath =
      "/html/body/div/div/div/div[1]/div/div[1]/form/div[2]/h2";
    const wizardStep3H2Text = await (
      await getVisibleElementByXpath(driver, wizardNewInstallH2XPath)
    ).getText();
    expect(wizardStep3H2Text).toContain("Step 3 – Licence");

    // Step3: Accept license checkbox
    const step3AcceptLicence = await getVisibleElementById(
      driver,
      "accept_licence"
    );
    if (!(await step3AcceptLicence.isSelected())) {
      await step3AcceptLicence.click();
    }
    expect(await step3AcceptLicence.isSelected()).toBeTruthy();

    // Step3: Next Button
    const step3NextButton = await getVisibleElementByName(driver, "step3");
    const step3NextButtonValue = await step3NextButton.getAttribute("value");
    expect(step3NextButtonValue).toContain("Next");
    await step3NextButton.click();

    /**************/
    /* Step4 Page */
    /**************/

    // Step4: Wizard page header h2 title
    const step4PageHeaderTitleText = await (
      await getVisibleElementByXpath(driver, headerPageHeaderTitleXPath)
    ).getText();
    expect(step4PageHeaderTitleText).toContain("New installation");

    // Step4: Wizard page h2 title
    const wizardStep4H2Text = await (
      await getVisibleElementByXpath(driver, wizardNewInstallH2XPath)
    ).getText();
    expect(wizardStep4H2Text).toContain("Step 4 – MySQL database settings");

    // Step4: Enter form field values
    const dbHostFormField = await findVisibleElementByCssSelector(
      driver,
      "input[name=dbHostForm][type=text]"
    );
    await dbHostFormField.clear();
    await dbHostFormField.sendKeys("mariadb");

    const dbUsernameFormField = await findVisibleElementByCssSelector(
      driver,
      "input[name=dbUsernameForm][type=text]"
    );
    await dbUsernameFormField.clear();
    await dbUsernameFormField.sendKeys("chamilo");

    const dbPassFormFormField = await findVisibleElementByCssSelector(
      driver,
      "input[name=dbPassForm][type=password]"
    );
    await dbPassFormFormField.clear();
    await dbPassFormFormField.sendKeys("chamilo");

    // Step4: Database connection test Button
    const step4TestDatabaseButton = await getVisibleElementByName(
      driver,
      "step3"
    );
    const step4TestDatabaseButtonValue = await step4TestDatabaseButton.getAttribute(
      "value"
    );
    expect(step4TestDatabaseButtonValue).toContain("step3");
    await step4TestDatabaseButton.click();

    // Step4: Test database connection
    const dbConnectionStatus = await getVisibleElementById(driver, "db_status");
    const dbConnectionStatusClasses = await dbConnectionStatus.getAttribute(
      "class"
    );
    expect(dbConnectionStatusClasses).toContain("alert-success");

    // Step4: Next Button
    const step4NextButton = await getVisibleElementByName(driver, "step4");
    const step4NextButtonValue = await step4NextButton.getAttribute("value");
    expect(step4NextButtonValue).toContain("Next");
    await step4NextButton.click();

    /**************/
    /* Step5 Page */
    /**************/

    // Step5: Wizard page header h2 title
    const step5PageHeaderTitleText = await (
      await getVisibleElementByXpath(driver, headerPageHeaderTitleXPath)
    ).getText();
    expect(step5PageHeaderTitleText).toContain("New installation");

    // Step5: Wizard page h2 title
    const wizardStep5H2Text = await (
      await getVisibleElementByXpath(driver, wizardNewInstallH2XPath)
    ).getText();
    expect(wizardStep5H2Text).toContain("Step 5 – Config settings");

    // Step5: Enter form field values
    const passFormField = await findVisibleElementByCssSelector(
      driver,
      "input[name=passForm][type=password]"
    );
    await passFormField.clear();
    await passFormField.sendKeys("admin");

    // Step4: Next Button
    const step5NextButton = await getVisibleElementByName(driver, "step5");
    const step5NextButtonValue = await step5NextButton.getAttribute("value");
    expect(step5NextButtonValue).toContain("Next");
    await step5NextButton.click();

    /**************/
    /* Step6 Page */
    /**************/

    // Step6: Wizard page header h2 title
    const step6PageHeaderTitleXPath =
      "/html/body/div/div/div/div[1]/div/div[1]/form/div[1]/h2";
    const step6PageHeaderTitleText = await (
      await getVisibleElementByXpath(driver, step6PageHeaderTitleXPath)
    ).getText();
    expect(step6PageHeaderTitleText).toContain("New installation");

    // Step6: Wizard page h3 title
    const wizardNewInstallH3XPath =
      "/html/body/div/div/div/div[1]/div/div[1]/form/div[2]/h3";
    const wizardStep6H3Text = await (
      await getVisibleElementByXpath(driver, wizardNewInstallH3XPath)
    ).getText();
    expect(wizardStep6H3Text).toContain("Step 6 – Last check before install");

    // Step6: Find and click install button
    const finalInstallButton = await findVisibleElementByCssSelector(
      driver,
      "button[id=button_step6][type=submit]"
    );
    const finalInstallButtonClasses = await finalInstallButton.getAttribute(
      "class"
    );
    expect(finalInstallButtonClasses).toContain("btn-success");
    await finalInstallButton.click();

    /**************/
    /* Step7 Page */
    /**************/
    // Step7: Wizard page h3 title
    const wizardFinalInstallH3XPath =
      "/html/body/div/div/div/div[1]/div/div[1]/form/div[1]/h3"
    const wizardStep7H3Text = await (
      await getVisibleElementByXpath(driver, wizardFinalInstallH3XPath)
    ).getText();
    expect(wizardStep7H3Text).toContain("Step 7 – Installation process execution");

    // Step7: Portal button
    const portalLink = await findVisibleElementByCssSelector(
      driver,
      "a[href='../../index.php']"
    );
    const portalLinkClasses = await portalLink.getAttribute(
      "class"
    );
    expect(portalLinkClasses).toContain("btn-success");
    const portalLinkText = await portalLink.getText();
    expect(portalLinkText).toContain("Go to your newly created portal.");
    await portalLink.click();

    /*********************/
    /* Portal Login Page */
    /*********************/
    // Portal Login: Navbar Link
    const navBarLink = await findVisibleElementByCssSelector(
      driver,
      "a[href='"+ chamilo_url +"index.php'][title=Homepage]"
    );
    const navBarLinkText = await navBarLink.getText();
    expect(navBarLinkText).toContain("Homepage");

    // Portal Login: Enter form field values
    const loginUsernameField = await findVisibleElementByCssSelector(
      driver,
      "input[id=login][placeholder=Username][name=login][type=text]"
    );
    await loginUsernameField.clear();
    await loginUsernameField.sendKeys("admin");

    const loginPasswordField = await findVisibleElementByCssSelector(
      driver,
      "input[id=password][placeholder=Pass][name=password][type=password]"
    );
    await loginPasswordField.clear();
    await loginPasswordField.sendKeys("admin");

    // Portal Login: Login Button
    const portalLoginButton = await findVisibleElementByCssSelector(
      driver,
      "button[id=formLogin_submitAuth][name=submitAuth][type=submit]"
    );
    const portalLoginButtonText = await portalLoginButton.getText();
    expect(portalLoginButtonText).toContain("Login");
    await portalLoginButton.click();

    /*****************************/
    /* Portal Administrator Page */
    /*****************************/
    // Portal Administrator Page: Navbar Link
    const navBarAdministrationLink = await findVisibleElementByCssSelector(
      driver,
      "a[href='"+ chamilo_url +"main/admin/'][title=Administration]"
    );
    const navBarAdministrationLinkText = await navBarAdministrationLink.getText();
    expect(navBarAdministrationLinkText).toContain("Administration");

    // Portal Administrator Page: User list Link
    const userListLink = await findVisibleElementByCssSelector(
      driver,
      "a[href='user_list.php']"
    );
    const userListLinkText = await userListLink.getText();
    expect(userListLinkText).toContain("User list");

  }, 60000);
});
