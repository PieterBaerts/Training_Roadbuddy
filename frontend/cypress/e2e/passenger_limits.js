import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

beforeEach(() => {
  cy.request("POST", "http://127.0.0.1:8000/test/reset");
});

Given("I open the carpool page", () => {
  cy.intercept("GET", "**/rides*").as("loadRides");
  cy.window().then((win) => win.location.assign("/"));
  cy.wait("@loadRides");
});

When('I fill in {string} as driver', (driver) => {
  cy.get('input[name="driver_name"]').type(driver);
});

When('I fill in {string} as origin', (origin) => {
  cy.get('input[name="origin"]').type(origin);
});

When('I fill in {string} as destination', (dest) => {
  cy.get('input[name="destination"]').type(dest);
});

When('I set the departure time to {string}', (time) => {
  cy.get('input[name="departure_time"]').type(time);
});

When('I click on {string}', (buttonText) => {
  cy.intercept("GET", "http://127.0.0.1:8000/carpools/rides/").as("refreshRides");

  cy.contains("button", buttonText).click();
  cy.wait("@refreshRides");

  // No further assertion here; specific steps handle checking results
});

Then('I should see {string} in the ride list', (driverName) => {
  cy.get('.ride-list').should('contain', driverName);
});

When('I fill in {string} as passenger', (passenger) => {
  cy.get('input[name="passenger_name"]').type(passenger);
});

Then(`I should see {string} listed under {string}'s ride`, (passenger, driver) => {
  cy.get('.ride-list').within(() => {
    cy.contains(driver)
      .parents('li') // find ancestor <li>
      .within(() => {
        cy.contains(passenger).should("exist");
      });
  });
});

When('I set the passenger limit to {string}', (limit) => {
  cy.get('input[name="passenger_limit"]').type(limit);
});

Given('a carpool ride exists with driver {string} and passenger limit {string}', (driverName, limit) => {
  cy.request("POST", "http://127.0.0.1:8000/carpools/rides/", {
    driver_name: driverName,
    origin: "Gent",
    destination: "Brussel",
  departure_time: "2026-06-07T08:00",
    passenger_limit: parseInt(limit)
  });
  cy.intercept("GET", "**/rides*").as("loadRidesAfterCreate");
  cy.window().then((win) => win.location.assign("/"));
  cy.wait("@loadRidesAfterCreate");
});

Given(`{string} has joined {string}'s ride`, (passengerName, driverName) => {
  cy.get('.ride-list').contains(driverName)
    .parents('li')
    .find('input[name="passenger_name"]')
    .type(passengerName);
  cy.get('.ride-list').contains(driverName)
    .parents('li')
    .find('button')
    .contains('Add Passenger')
    .click();
});

Then(`I should see {string} passengers for {string}'s ride`, (passengerCount, driverName) => {
  cy.get('.ride-list').contains(driverName)
    .parents('li')
    .should('contain', passengerCount);
});

Then('I should see a message {string}', (message) => {
  cy.contains(message).should('be.visible');
});

Then('the {string} button should be disabled', (buttonText) => {
  cy.contains('button', buttonText).should('be.disabled');
});

Then(`I should not see {string} listed under {string}'s ride`, (passenger, driver) => {
  cy.get('.ride-list').within(() => {
    cy.contains(driver)
      .parents('li') // find ancestor <li>
      .within(() => {
        cy.contains(passenger).should("not.exist");
      });
  });
});

When(`I view {string}'s ride details`, (driverName) => {
  // In this current UI, viewing ride details means just being on the carpool page
  // and looking at the ride list. No specific action needed here.
  cy.get('.ride-list').contains(driverName).should('be.visible');
});