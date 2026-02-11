import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";


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

When('I set the number of passengers to {string}', (limit) => {
  cy.get('input[name="passenger_limit"]').type(limit);
});

When('I click on {string}', (buttonText) => {
  cy.intercept("GET", "http://127.0.0.1:8000/carpools/rides/").as("refreshRides"); // Changed URL

  cy.contains("button", buttonText).click();
  // wait for the frontend to refresh rides after the action
  cy.wait("@refreshRides");
});

// Click a button but do NOT wait for the rides refresh (useful when client-side validation blocks the request)
When('I click on {string} without waiting', (buttonText) => {
  cy.contains('button', buttonText).click();
});


Then('I should see {string} in the ride list', (driverName) => {
  cy.wait(1000); // Added wait
  cy.get('.ride-list').should('contain', driverName);
});

Then('I should not see {string} in the ride list', (driverName) => {
  cy.get('.ride-list').should('not.contain', driverName);
});

Given('a carpool ride exists with driver {string}', (driverName) => {
  cy.request("POST", "http://127.0.0.1:8000/carpools/rides/", {
    driver_name: driverName,
    origin: "Gent",
    destination: "Brussel",
  departure_time: "2026-06-07T08:00",
    passenger_limit: 5 // Default passenger limit for existing rides
  });
  // reload frontend and wait for rides to load to avoid timing issues
  cy.intercept("GET", "**/rides*").as("loadRidesAfterCreate");
  cy.window().then((win) => win.location.assign("/"));
  cy.wait("@loadRidesAfterCreate");
});

When('I fill in {string} as passenger', (passenger) => {
  cy.get('input[name="passenger_name"]').type(passenger);
});

Then('I should see {string} listed under {string}\'s ride', (passenger, driver) => {
  cy.get('.ride-list').within(() => {
    cy.contains(driver)
      .parents('li')
      .within(() => {
        cy.contains(passenger).should("exist");
      });
  });
});

beforeEach(() => {
  cy.request("POST", "http://127.0.0.1:8000/test/reset");
});

// Given("I open the carpool page", () => { ... }); // Already present

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

Then(`I should not see {string} listed under {string}'s ride`, (passenger, driver) => {
  cy.get('.ride-list').within(() => {
    cy.contains(driver)
      .parents('li')
      .within(() => {
        cy.contains(passenger).should("not.exist");
      });
  });
});

Given("I am logged in as admin", () => {
  localStorage.setItem("user", JSON.stringify({ username: "admin", role: "admin" }));
});

Given("I am logged in as a regular user", () => {
  localStorage.setItem("user", JSON.stringify({ username: "alice", role: "user" }));
});

When('I click on "Delete" for {string}\'s ride', (driverName) => {
  cy.get('.ride-list').contains(driverName)
    .parents('li')
    .find('button')
    .contains('Delete')
    .click();
  // Cypress automatically accepts window:confirm by default, but we can be explicit:
  cy.on('window:confirm', () => true);
});

Then('I should not see a "Delete" button for {string}\'s ride', (driverName) => {
  cy.get('.ride-list').contains(driverName)
    .parents('li')
    .within(() => {
      cy.get('button').contains('Delete').should('not.exist');
    });
});

When(`I view {string}'s ride details`, (driverName) => {
  // In this current UI, viewing ride details means just being on the carpool page
  // and looking at the ride list. No specific action needed here.
  cy.get('.ride-list').contains(driverName).should('be.visible');
});