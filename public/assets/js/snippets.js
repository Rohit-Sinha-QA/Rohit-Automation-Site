// Ready-to-copy code for every element on the Practice Elements page.
// java = Selenium 4 Java, python = Selenium 4 Python, cypress = Cypress JS, playwright = Playwright Python (sync)
window.SNIPPETS = {
  textbox: {
    title: "Input Box",
    java: `WebElement box = driver.findElement(By.id("idtextbox1"));
box.clear();
box.sendKeys("Hello, Selenium!");
System.out.println(box.getAttribute("value"));`,
    python: `box = driver.find_element(By.ID, "idtextbox1")
box.clear()
box.send_keys("Hello, Selenium!")
print(box.get_attribute("value"))`,
    cypress: `cy.get('#idtextbox1').clear().type('Hello, Cypress!')
cy.get('#idtextbox1').should('have.value', 'Hello, Cypress!')`,
    playwright: `box = page.locator("#idtextbox1")
box.fill("Hello, Playwright!")
expect(box).to_have_value("Hello, Playwright!")`,
  },
  textarea: {
    title: "Text Area",
    java: `WebElement area = driver.findElement(By.id("idtextarea1"));
area.sendKeys("Line one" + Keys.ENTER + "Line two");
String count = driver.findElement(By.id("textareaCount")).getText();`,
    python: `area = driver.find_element(By.ID, "idtextarea1")
area.send_keys("Line one" + Keys.ENTER + "Line two")
count = driver.find_element(By.ID, "textareaCount").text`,
    cypress: `cy.get('#idtextarea1').type('Line one{enter}Line two')
cy.get('#textareaCount').should('have.text', '17')`,
    playwright: `page.locator("#idtextarea1").fill("Line one\\nLine two")
expect(page.locator("#textareaCount")).to_have_text("17")`,
  },
  readonly: {
    title: "Read-only & Disabled Inputs",
    java: `WebElement ro = driver.findElement(By.id("idreadonly"));
System.out.println(ro.getAttribute("readonly"));   // "true"
WebElement dis = driver.findElement(By.id("iddisabled"));
System.out.println(dis.isEnabled());               // false`,
    python: `ro = driver.find_element(By.ID, "idreadonly")
print(ro.get_attribute("readonly"))   # "true"
dis = driver.find_element(By.ID, "iddisabled")
print(dis.is_enabled())               # False`,
    cypress: `cy.get('#idreadonly').should('have.attr', 'readonly')
cy.get('#iddisabled').should('be.disabled')`,
    playwright: `expect(page.locator("#idreadonly")).not_to_be_editable()
expect(page.locator("#iddisabled")).to_be_disabled()`,
  },
  buttons: {
    title: "Buttons",
    java: `driver.findElement(By.id("clickMeBtn")).click();
String result = driver.findElement(By.id("clickResult")).getText();
boolean enabled = driver.findElement(By.id("disabledBtn")).isEnabled(); // false`,
    python: `driver.find_element(By.ID, "clickMeBtn").click()
result = driver.find_element(By.ID, "clickResult").text
enabled = driver.find_element(By.ID, "disabledBtn").is_enabled()  # False`,
    cypress: `cy.contains('button', 'Count Clicks').click()
cy.get('#clickResult').should('have.text', 'Button clicked 1 time')
cy.get('#disabledBtn').should('be.disabled')`,
    playwright: `page.get_by_role("button", name="Count Clicks").click()
expect(page.locator("#clickResult")).to_have_text("Button clicked 1 time")
expect(page.locator("#disabledBtn")).to_be_disabled()`,
  },
  links: {
    title: "Links",
    java: `driver.findElement(By.linkText("Go to Overview page")).click();
driver.navigate().back();
driver.findElement(By.partialLinkText("Broken")).getAttribute("href");
List<WebElement> links = driver.findElements(By.tagName("a"));`,
    python: `driver.find_element(By.LINK_TEXT, "Go to Overview page").click()
driver.back()
driver.find_element(By.PARTIAL_LINK_TEXT, "Broken").get_attribute("href")
links = driver.find_elements(By.TAG_NAME, "a")`,
    cypress: `cy.contains('a', 'Go to Overview page').click()
cy.go('back')
cy.get('#idbrokenlink').then($a => cy.request({ url: $a.prop('href'), failOnStatusCode: false })
  .its('status').should('eq', 404))`,
    playwright: `page.get_by_role("link", name="Go to Overview page").click()
page.go_back()
href = page.locator("#idbrokenlink").get_attribute("href")
assert page.request.get(href).status == 404`,
  },
  radio: {
    title: "Radio Button",
    java: `driver.findElement(By.id("idradiobutton2")).click();
System.out.println(driver.findElement(By.id("idradiobutton2")).isSelected()); // true
System.out.println(driver.findElement(By.id("idradiobutton3")).isEnabled());  // false`,
    python: `driver.find_element(By.ID, "idradiobutton2").click()
print(driver.find_element(By.ID, "idradiobutton2").is_selected())  # True
print(driver.find_element(By.ID, "idradiobutton3").is_enabled())   # False`,
    cypress: `cy.get('#idradiobutton2').check().should('be.checked')
cy.get('#idradiobutton3').should('be.disabled')`,
    playwright: `page.get_by_label("Female").check()
expect(page.locator("#idradiobutton2")).to_be_checked()
expect(page.locator("#idradiobutton3")).to_be_disabled()`,
  },
  checkbox: {
    title: "Checkbox",
    java: `List<WebElement> boxes = driver.findElements(By.name("hobbies"));
for (WebElement b : boxes) { if (!b.isSelected()) b.click(); }
driver.findElement(By.id("idcheckbox2")).click(); // uncheck Reading`,
    python: `for box in driver.find_elements(By.NAME, "hobbies"):
    if not box.is_selected():
        box.click()
driver.find_element(By.ID, "idcheckbox2").click()  # uncheck Reading`,
    cypress: `cy.get('input[name="hobbies"]').check()
cy.get('#idcheckbox2').uncheck().should('not.be.checked')`,
    playwright: `for box in page.locator("input[name=hobbies]").all():
    box.check()
page.locator("#idcheckbox2").uncheck()
expect(page.locator("#checkboxResult")).to_have_text("Checked: Sports, Music")`,
  },
  toggle: {
    title: "Toggle Switch",
    java: `WebElement toggle = driver.findElement(By.id("idtoggle"));
toggle.click();
System.out.println(driver.findElement(By.id("toggleState")).getText()); // Notifications are ON`,
    python: `driver.find_element(By.ID, "idtoggle").click()
print(driver.find_element(By.ID, "toggleState").text)  # Notifications are ON`,
    cypress: `cy.get('#idtoggle').check()
cy.get('#toggleState').should('have.text', 'Notifications are ON')`,
    playwright: `page.get_by_role("switch").check()
expect(page.locator("#toggleState")).to_have_text("Notifications are ON")`,
  },
  static_dropdown: {
    title: "Static Dropdown (<select>)",
    java: `Select state = new Select(driver.findElement(By.id("state")));
state.selectByVisibleText("Telangana");
state.selectByValue("Karna");
state.selectByIndex(5);
System.out.println(state.getFirstSelectedOption().getText());
System.out.println(state.getOptions().size());`,
    python: `from selenium.webdriver.support.ui import Select
state = Select(driver.find_element(By.ID, "state"))
state.select_by_visible_text("Telangana")
state.select_by_value("Karna")
state.select_by_index(5)
print(state.first_selected_option.text, len(state.options))`,
    cypress: `cy.get('#state').select('Telangana').should('have.value', 'Telan')
cy.get('#state').select('Karna')
cy.get('#state option').should('have.length', 36)`,
    playwright: `state = page.locator("#state")
state.select_option(label="Telangana")
state.select_option("Karna")         # by value
state.select_option(index=5)
expect(state.locator("option")).to_have_count(36)`,
  },
  multi_select: {
    title: "Multi Select",
    java: `Select langs = new Select(driver.findElement(By.id("multiSelect")));
System.out.println(langs.isMultiple()); // true
langs.selectByVisibleText("Java");
langs.selectByValue("python");
langs.deselectAll();`,
    python: `langs = Select(driver.find_element(By.ID, "multiSelect"))
print(langs.is_multiple)
langs.select_by_visible_text("Java")
langs.select_by_value("python")
print([o.text for o in langs.all_selected_options])`,
    cypress: `cy.get('#multiSelect').select(['Java', 'Python'])
cy.get('#multiSelect').invoke('val').should('deep.equal', ['java', 'python'])`,
    playwright: `page.locator("#multiSelect").select_option(["java", "python"])
expect(page.locator("#multiSelect")).to_have_values(["java", "python"])`,
  },
  span_dropdown: {
    title: "Span (custom) Dropdown",
    java: `driver.findElement(By.id("spanDropdownSelected")).click();
driver.findElement(By.xpath("//ul[@id='spanDropdownOptions']/li[text()='Kerala']")).click();
System.out.println(driver.findElement(By.id("spanDropdownSelected")).getText());`,
    python: `driver.find_element(By.ID, "spanDropdownSelected").click()
driver.find_element(By.XPATH, "//ul[@id='spanDropdownOptions']/li[text()='Kerala']").click()
print(driver.find_element(By.ID, "spanDropdownSelected").text)`,
    cypress: `cy.get('#spanDropdownSelected').click()
cy.get('#spanDropdownOptions li').contains('Kerala').click()
cy.get('#spanDropdownSelected').should('have.text', 'Kerala')`,
    playwright: `page.locator("#spanDropdownSelected").click()
page.locator("#spanDropdownOptions li", has_text="Kerala").click()
expect(page.locator("#spanDropdownSelected")).to_have_text("Kerala")`,
  },
  dynamic_dropdown: {
    title: "Dynamic (auto-suggest) Dropdown",
    java: `driver.findElement(By.id("searchBox")).sendKeys("Ma");
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
List<WebElement> items = wait.until(ExpectedConditions
    .visibilityOfAllElementsLocatedBy(By.cssSelector("#suggestionsList li")));
for (WebElement li : items) { if (li.getText().equals("Maharashtra")) { li.click(); break; } }`,
    python: `driver.find_element(By.ID, "searchBox").send_keys("Ma")
items = WebDriverWait(driver, 5).until(
    EC.visibility_of_all_elements_located((By.CSS_SELECTOR, "#suggestionsList li")))
for li in items:
    if li.text == "Maharashtra":
        li.click()
        break`,
    cypress: `cy.get('#searchBox').type('Ma')
cy.get('#suggestionsList li').contains('Maharashtra').click()
cy.get('#searchBox').should('have.value', 'Maharashtra')`,
    playwright: `page.locator("#searchBox").press_sequentially("Ma")
page.locator("#suggestionsList").get_by_role("option", name="Maharashtra").click()
expect(page.locator("#searchBox")).to_have_value("Maharashtra")`,
  },
  date: {
    title: "Date Picker (<input type=date>)",
    java: `// Chrome expects the keys in your OS date format, e.g. dd-mm-yyyy or mm/dd/yyyy
driver.findElement(By.id("datePicker")).sendKeys("15082026");
// or set the value directly in ISO format:
((JavascriptExecutor) driver).executeScript(
    "arguments[0].value='2026-08-15'; arguments[0].dispatchEvent(new Event('change'))",
    driver.findElement(By.id("datePicker")));`,
    python: `date = driver.find_element(By.ID, "datePicker")
date.send_keys("15082026")   # typed in your OS date format
driver.execute_script(
    "arguments[0].value='2026-08-15'; arguments[0].dispatchEvent(new Event('change'))", date)`,
    cypress: `cy.get('#datePicker').type('2026-08-15')   // Cypress always uses yyyy-mm-dd
cy.get('#dateResult').should('have.text', 'Selected date: 2026-08-15')`,
    playwright: `page.locator("#datePicker").fill("2026-08-15")   # always yyyy-mm-dd
expect(page.locator("#dateResult")).to_have_text("Selected date: 2026-08-15")`,
  },
  file_upload: {
    title: "File Upload",
    java: `driver.findElement(By.id("idfileupload"))
      .sendKeys("C:\\\\Users\\\\you\\\\Documents\\\\resume.pdf");   // absolute path
System.out.println(driver.findElement(By.id("fileUploadResult")).getText());`,
    python: `import os
driver.find_element(By.ID, "idfileupload").send_keys(os.path.abspath("data/resume.pdf"))
print(driver.find_element(By.ID, "fileUploadResult").text)`,
    cypress: `cy.get('#idfileupload').selectFile('cypress/fixtures/resume.pdf')
cy.get('#fileUploadResult').should('contain', 'resume.pdf')`,
    playwright: `page.locator("#idfileupload").set_input_files("data/resume.pdf")
expect(page.locator("#fileUploadResult")).to_have_text("Uploaded: resume.pdf")`,
  },
  multi_upload: {
    title: "Multiple File Upload (hidden input)",
    java: `// The <input type=file> is hidden behind the button. sendKeys works on it directly.
// Join several absolute paths with a new line:
driver.findElement(By.id("fileInput")).sendKeys("C:\\\\files\\\\a.txt\\nC:\\\\files\\\\b.txt");
List<WebElement> names = driver.findElements(By.cssSelector("#fileList li"));`,
    python: `paths = [os.path.abspath("data/a.txt"), os.path.abspath("data/b.txt")]
driver.find_element(By.ID, "fileInput").send_keys("\\n".join(paths))
names = [li.text for li in driver.find_elements(By.CSS_SELECTOR, "#fileList li")]`,
    cypress: `cy.get('#fileInput').selectFile(['cypress/fixtures/a.txt', 'cypress/fixtures/b.txt'], { force: true })
cy.get('#fileList li').should('have.length', 2)`,
    playwright: `# Option 1: set files on the hidden input
page.locator("#fileInput").set_input_files(["data/a.txt", "data/b.txt"])
# Option 2: click the button and catch the file chooser
with page.expect_file_chooser() as fc:
    page.get_by_role("button", name="Upload Here").click()
fc.value.set_files(["data/a.txt", "data/b.txt"])
expect(page.locator("#fileList li")).to_have_count(2)`,
  },
  hover: {
    title: "Mouse Hover",
    java: `Actions actions = new Actions(driver);
actions.moveToElement(driver.findElement(By.id("hoverBtn"))).perform();
System.out.println(driver.findElement(By.id("text")).getText());`,
    python: `from selenium.webdriver.common.action_chains import ActionChains
ActionChains(driver).move_to_element(driver.find_element(By.ID, "hoverBtn")).perform()
print(driver.find_element(By.ID, "text").text)`,
    cypress: `cy.get('#hoverBtn').trigger('mouseover')
cy.get('#text').should('be.visible').and('contain', 'You hovered')`,
    playwright: `page.locator("#hoverBtn").hover()
expect(page.locator("#text")).to_have_text("✅ You hovered using mouse")`,
  },
  double_click: {
    title: "Double Click",
    java: `new Actions(driver).doubleClick(driver.findElement(By.id("dblClick"))).perform();
System.out.println(driver.findElement(By.id("dclick")).getText());`,
    python: `ActionChains(driver).double_click(driver.find_element(By.ID, "dblClick")).perform()
print(driver.find_element(By.ID, "dclick").text)`,
    cypress: `cy.get('#dblClick').dblclick()
cy.get('#dclick').should('contain', 'You double-clicked')`,
    playwright: `page.locator("#dblClick").dblclick()
expect(page.locator("#dclick")).to_have_text("✅ You double-clicked the button!")`,
  },
  right_click: {
    title: "Right Click (context click)",
    java: `new Actions(driver).contextClick(driver.findElement(By.id("rightClick"))).perform();
System.out.println(driver.findElement(By.id("rclick")).getText());`,
    python: `ActionChains(driver).context_click(driver.find_element(By.ID, "rightClick")).perform()
print(driver.find_element(By.ID, "rclick").text)`,
    cypress: `cy.get('#rightClick').rightclick()
cy.get('#rclick').should('contain', 'You right-clicked')`,
    playwright: `page.locator("#rightClick").click(button="right")
expect(page.locator("#rclick")).to_have_text("✅ You right-clicked the button!")`,
  },
  slider: {
    title: "Slider",
    java: `WebElement slider = driver.findElement(By.id("slider"));
new Actions(driver).dragAndDropBy(slider, 60, 0).perform();      // move right
for (int i = 0; i < 5; i++) slider.sendKeys(Keys.ARROW_RIGHT); // or use keys
System.out.println(driver.findElement(By.id("sliderValue")).getText());`,
    python: `slider = driver.find_element(By.ID, "slider")
ActionChains(driver).drag_and_drop_by_offset(slider, 60, 0).perform()
for _ in range(5):
    slider.send_keys(Keys.ARROW_RIGHT)
print(driver.find_element(By.ID, "sliderValue").text)`,
    cypress: `cy.get('#slider').invoke('val', 80).trigger('input')
cy.get('#sliderValue').should('have.text', 'Value: 80')`,
    playwright: `page.locator("#slider").fill("80")
expect(page.locator("#sliderValue")).to_have_text("Value: 80")`,
  },
  resize: {
    title: "Resizable Box",
    java: `WebElement handle = driver.findElement(By.id("resizeHandle"));
new Actions(driver).clickAndHold(handle).moveByOffset(100, 50).release().perform();
System.out.println(driver.findElement(By.id("resizeResult")).getText());`,
    python: `handle = driver.find_element(By.ID, "resizeHandle")
ActionChains(driver).click_and_hold(handle).move_by_offset(100, 50).release().perform()
print(driver.find_element(By.ID, "resizeResult").text)`,
    cypress: `cy.get('#resizeHandle').then($h => {
  const r = $h[0].getBoundingClientRect()
  cy.wrap($h).trigger('mousedown', { button: 0 })
  cy.document().trigger('mousemove', { clientX: r.right + 100, clientY: r.bottom + 50 })
  cy.document().trigger('mouseup')
})`,
    playwright: `box = page.locator("#resizeHandle").bounding_box()
page.mouse.move(box["x"] + 5, box["y"] + 5)
page.mouse.down()
page.mouse.move(box["x"] + 105, box["y"] + 55)
page.mouse.up()`,
  },
  drag_drop: {
    title: "Drag and Drop",
    java: `WebElement src = driver.findElement(By.id("draggable"));
WebElement dst = driver.findElement(By.id("droppable"));
new Actions(driver).dragAndDrop(src, dst).perform();
System.out.println(dst.getText()); // Dropped!`,
    python: `src = driver.find_element(By.ID, "draggable")
dst = driver.find_element(By.ID, "droppable")
ActionChains(driver).drag_and_drop(src, dst).perform()
print(dst.text)  # Dropped!`,
    cypress: `cy.get('#draggable').trigger('mousedown', { button: 0 })
cy.get('#droppable').trigger('mousemove').trigger('mouseup')
cy.get('#droppable').should('have.text', 'Dropped!')`,
    playwright: `page.locator("#draggable").drag_to(page.locator("#droppable"))
expect(page.locator("#droppable")).to_have_text("Dropped!")`,
  },
  alerts: {
    title: "JavaScript Alerts",
    java: `driver.findElement(By.id("idalert")).click();
Alert alert = driver.switchTo().alert();
System.out.println(alert.getText());
alert.accept();

driver.findElement(By.id("idconfirm")).click();
driver.switchTo().alert().dismiss();

driver.findElement(By.id("idprompt")).click();
Alert p = driver.switchTo().alert();
p.sendKeys("Rohit");
p.accept();
System.out.println(driver.findElement(By.id("message")).getText());`,
    python: `driver.find_element(By.ID, "idalert").click()
alert = driver.switch_to.alert
print(alert.text)
alert.accept()

driver.find_element(By.ID, "idconfirm").click()
driver.switch_to.alert.dismiss()

driver.find_element(By.ID, "idprompt").click()
p = driver.switch_to.alert
p.send_keys("Rohit")
p.accept()
print(driver.find_element(By.ID, "message").text)`,
    cypress: `cy.on('window:alert', txt => expect(txt).to.eq('This is an OK alert!'))
cy.get('#idalert').click()

cy.on('window:confirm', () => false)          // click Cancel
cy.get('#idconfirm').click()
cy.get('#message').should('contain', 'dismissed')

cy.window().then(win => cy.stub(win, 'prompt').returns('Rohit'))
cy.get('#idprompt').click()
cy.get('#message').should('contain', 'Rohit')`,
    playwright: `page.once("dialog", lambda d: d.accept())
page.locator("#idalert").click()

page.once("dialog", lambda d: d.dismiss())
page.locator("#idconfirm").click()
expect(page.locator("#message")).to_have_text("❌ You dismissed the alert!")

page.once("dialog", lambda d: d.accept("Rohit"))
page.locator("#idprompt").click()
expect(page.locator("#message")).to_have_text("✅ You entered: Rohit")`,
  },
  modal: {
    title: "HTML Modal",
    java: `driver.findElement(By.id("openModalBtn")).click();
new WebDriverWait(driver, Duration.ofSeconds(5))
    .until(ExpectedConditions.visibilityOfElementLocated(By.id("practiceModal")));
driver.findElement(By.id("modalEmail")).sendKeys("me@test.com");
driver.findElement(By.id("modalSubmit")).click();`,
    python: `driver.find_element(By.ID, "openModalBtn").click()
WebDriverWait(driver, 5).until(EC.visibility_of_element_located((By.ID, "practiceModal")))
driver.find_element(By.ID, "modalEmail").send_keys("me@test.com")
driver.find_element(By.ID, "modalSubmit").click()`,
    cypress: `cy.get('#openModalBtn').click()
cy.get('#practiceModal').should('be.visible').within(() => {
  cy.get('#modalEmail').type('me@test.com')
  cy.contains('button', 'Subscribe').click()
})
cy.get('#modalResult').should('have.text', 'Subscribed with me@test.com')`,
    playwright: `page.get_by_role("button", name="Open Modal").click()
dialog = page.get_by_role("dialog", name="Subscribe to updates")
dialog.get_by_label("Email address").fill("me@test.com")
dialog.get_by_role("button", name="Subscribe").click()
expect(page.locator("#modalResult")).to_have_text("Subscribed with me@test.com")`,
  },
  iframe: {
    title: "Iframe",
    java: `driver.switchTo().frame("iframe-name");          // by name, id, index or WebElement
driver.findElement(By.id("frameInput")).sendKeys("Inside the frame");
driver.findElement(By.id("frameButton")).click();
System.out.println(driver.findElement(By.id("frameResult")).getText());
driver.switchTo().defaultContent();`,
    python: `driver.switch_to.frame("iframe-name")
driver.find_element(By.ID, "frameInput").send_keys("Inside the frame")
driver.find_element(By.ID, "frameButton").click()
print(driver.find_element(By.ID, "frameResult").text)
driver.switch_to.default_content()`,
    cypress: `cy.get('#iframe-id').its('0.contentDocument.body').should('not.be.empty')
  .then(cy.wrap).within(() => {
    cy.get('#frameInput').type('Inside the frame')
    cy.get('#frameButton').click()
    cy.get('#frameResult').should('contain', 'Inside the frame')
  })`,
    playwright: `frame = page.frame_locator("#iframe-id")
frame.locator("#frameInput").fill("Inside the frame")
frame.get_by_role("button", name="Submit").click()
expect(frame.locator("#frameResult")).to_have_text("You submitted: Inside the frame")`,
  },
  hide_show: {
    title: "Hide and Show",
    java: `driver.findElement(By.id("show-textbox")).click();
System.out.println(driver.findElement(By.id("displayed-text")).isDisplayed()); // true
driver.findElement(By.id("hide-textbox")).click();
System.out.println(driver.findElement(By.id("displayed-text")).isDisplayed()); // false`,
    python: `driver.find_element(By.ID, "show-textbox").click()
print(driver.find_element(By.ID, "displayed-text").is_displayed())  # True
driver.find_element(By.ID, "hide-textbox").click()
print(driver.find_element(By.ID, "displayed-text").is_displayed())  # False`,
    cypress: `cy.get('#show-textbox').click()
cy.get('#displayed-text').should('be.visible')
cy.get('#hide-textbox').click()
cy.get('#displayed-text').should('not.be.visible')`,
    playwright: `page.locator("#show-textbox").click()
expect(page.locator("#displayed-text")).to_be_visible()
page.locator("#hide-textbox").click()
expect(page.locator("#displayed-text")).to_be_hidden()`,
  },
  webtable_link: {
    title: "Open the WebTable page",
    java: `driver.findElement(By.id("idwebtable")).click();
List<WebElement> rows = driver.findElements(By.cssSelector("#dataTable tbody tr"));`,
    python: `driver.find_element(By.ID, "idwebtable").click()
rows = driver.find_elements(By.CSS_SELECTOR, "#dataTable tbody tr")`,
    cypress: `cy.get('#idwebtable').click()
cy.url().should('include', 'webTable')`,
    playwright: `page.locator("#idwebtable").click()
expect(page).to_have_url(re.compile("webTable"))`,
  },
  new_tab: {
    title: "New Tab",
    java: `String parent = driver.getWindowHandle();
driver.findElement(By.id("idnewtab")).click();
for (String h : driver.getWindowHandles()) {
    if (!h.equals(parent)) { driver.switchTo().window(h); break; }
}
System.out.println(driver.getTitle());
driver.close();
driver.switchTo().window(parent);`,
    python: `parent = driver.current_window_handle
driver.find_element(By.ID, "idnewtab").click()
for h in driver.window_handles:
    if h != parent:
        driver.switch_to.window(h)
print(driver.title)
driver.close()
driver.switch_to.window(parent)`,
    cypress: `// Cypress has one tab: remove target and open the link in the same tab
cy.get('#idnewtab').invoke('removeAttr', 'target').click()
cy.title().should('contain', 'Overview')`,
    playwright: `with page.context.expect_page() as info:
    page.locator("#idnewtab").click()
new_tab = info.value
expect(new_tab).to_have_title(re.compile("Overview"))
new_tab.close()`,
  },
  new_window: {
    title: "New Window",
    java: `String parent = driver.getWindowHandle();
driver.findElement(By.id("idnewwindow")).click();
new WebDriverWait(driver, Duration.ofSeconds(5)).until(ExpectedConditions.numberOfWindowsToBe(2));
for (String h : driver.getWindowHandles()) if (!h.equals(parent)) driver.switchTo().window(h);
System.out.println(driver.findElement(By.tagName("h1")).getText());`,
    python: `parent = driver.current_window_handle
driver.find_element(By.ID, "idnewwindow").click()
WebDriverWait(driver, 5).until(EC.number_of_windows_to_be(2))
driver.switch_to.window([h for h in driver.window_handles if h != parent][0])
print(driver.find_element(By.TAG_NAME, "h1").text)`,
    cypress: `// Stub window.open and visit the URL it was called with
cy.window().then(win => cy.stub(win, 'open').as('open'))
cy.get('#idnewwindow').click()
cy.get('@open').should('be.calledWithMatch', '/frames/new-window.html')`,
    playwright: `with page.expect_popup() as info:
    page.locator("#idnewwindow").click()
popup = info.value
expect(popup.get_by_role("heading", level=1)).to_have_text("New Window")`,
  },
  bad_ssl: {
    title: "Bad SSL certificate",
    java: `ChromeOptions options = new ChromeOptions();
options.setAcceptInsecureCerts(true);
WebDriver driver = new ChromeDriver(options);
driver.get("https://expired.badssl.com/");`,
    python: `options = webdriver.ChromeOptions()
options.accept_insecure_certs = True
driver = webdriver.Chrome(options=options)
driver.get("https://expired.badssl.com/")`,
    cypress: `// Cypress accepts insecure certificates by default (chromeWebSecurity).
cy.visit('https://expired.badssl.com/')`,
    playwright: `context = browser.new_context(ignore_https_errors=True)
page = context.new_page()
page.goto("https://expired.badssl.com/")`,
  },
  wait_visible: {
    title: "Wait until visible",
    java: `driver.findElement(By.id("WaitVisible")).click();
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement text = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("delayText")));
System.out.println(text.getText());`,
    python: `driver.find_element(By.ID, "WaitVisible").click()
text = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.ID, "delayText")))
print(text.text)`,
    cypress: `cy.get('#WaitVisible').click()
cy.get('#delayText', { timeout: 10000 }).should('have.text', 'Sorry, I am late !!!!!')`,
    playwright: `page.locator("#WaitVisible").click()
expect(page.locator("#delayText")).to_have_text("Sorry, I am late !!!!!", timeout=10_000)`,
  },
  wait_clickable: {
    title: "Wait until clickable",
    java: `driver.findElement(By.id("enableRadioBtn")).click();
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
wait.until(ExpectedConditions.elementToBeClickable(By.id("delayedRadio"))).click();`,
    python: `driver.find_element(By.ID, "enableRadioBtn").click()
WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.ID, "delayedRadio"))).click()`,
    cypress: `cy.get('#enableRadioBtn').click()
cy.get('#delayedRadio', { timeout: 10000 }).should('be.enabled').check()`,
    playwright: `page.locator("#enableRadioBtn").click()
page.locator("#delayedRadio").check(timeout=10_000)   # auto-waits until enabled
expect(page.locator("#delayedRadio")).to_be_checked()`,
  },
  shadow: {
    title: "Shadow DOM",
    java: `SearchContext shadow = driver.findElement(By.id("shadow-host")).getShadowRoot();
shadow.findElement(By.cssSelector("#shadow-input")).sendKeys("Hello Shadow");   // CSS only
System.out.println(shadow.findElement(By.cssSelector("#shadow-output")).getText());`,
    python: `shadow = driver.find_element(By.ID, "shadow-host").shadow_root
shadow.find_element(By.CSS_SELECTOR, "#shadow-input").send_keys("Hello Shadow")
print(shadow.find_element(By.CSS_SELECTOR, "#shadow-output").text)`,
    cypress: `cy.get('#shadow-host').shadow().find('#shadow-input').type('Hello Shadow')
// or set includeShadowDom: true in cypress.config.js`,
    playwright: `# Playwright CSS locators pierce open shadow roots automatically
page.locator("#shadow-input").fill("Hello Shadow")
expect(page.locator("#shadow-output")).to_have_text("You typed: Hello Shadow")`,
  },
  dynamic_xpath: {
    title: "Dynamic Xpath",
    java: `// id looks like dynamic_4821 and changes on every load
driver.findElement(By.xpath("//input[starts-with(@id,'dynamic_')]")).sendKeys("found it");
driver.findElement(By.xpath("//input[contains(@name,'dynamic_name')]"));
driver.findElement(By.cssSelector("input[id^='dynamic_']"));`,
    python: `driver.find_element(By.XPATH, "//input[starts-with(@id,'dynamic_')]").send_keys("found it")
driver.find_element(By.CSS_SELECTOR, "input[id^='dynamic_']")`,
    cypress: `cy.get("input[id^='dynamic_']").type('found it')`,
    playwright: `page.locator("xpath=//input[starts-with(@id,'dynamic_')]").fill("found it")
page.locator("input[id^='dynamic_']")   # CSS starts-with`,
  },
};
