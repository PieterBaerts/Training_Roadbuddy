import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I open the login page", () => {
  cy.visit("/login");
  cy.reload();
});

When('I enter {string} as username', (username) => {
  cy.get('input[name="username"]').clear().type(username);
});

When('I enter {string} as password', (password) => {
  cy.get('input[name="password"]').clear().type(password);
});

When('I click on {string}', (buttonText) => {
  cy.contains("button", buttonText).click();
});

Then('I should see {string}', (text) => {
  cy.contains(text).should("be.visible");
});
