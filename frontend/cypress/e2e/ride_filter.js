import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("the carpool page is open", () => {
  cy.intercept("GET", "**/rides*").as("loadRides");
  cy.window().then((win) => win.location.assign("/"));
  cy.wait("@loadRides");
});

Given("the following rides exist:", (dataTable) => {
  for (const ride of dataTable.hashes()) {
    cy.request("POST", "http://127.0.0.1:8000/carpools/rides/", {
      driver_name: ride.driver,
      origin: ride.origin,
      destination: ride.destination,
      departure_time: ride.departure_time,
      passenger_limit: parseInt(ride.passenger_limit)
    });
  }
  cy.intercept("GET", "**/rides*").as("loadRidesAfterCreate");
  cy.window().then((win) => win.location.assign("/"));
  cy.wait("@loadRidesAfterCreate");
});

When('I filter by origin {string}', (origin) => {
  cy.get('input[name="filterOrigin"]').type(origin);
});

When('I filter by destination {string}', (destination) => {
  cy.get('input[name="filterDestination"]').type(destination);
});

Then('I should see {string} in the ride list', (driverName) => {
  cy.get('.ride-list').should('contain', driverName);
});

Then('I should not see {string} in the ride list', (driverName) => {
  cy.get('.ride-list').should('not.contain', driverName);
});

Then('I should not see any rides in the list', () => {
  cy.get('.ride-list li').should('not.exist');
});

When('I clear the filters', () => {
  cy.contains('button', 'Clear Filters').click();
});

When('I have filtered by origin {string}', (origin) => {
  cy.get('input[name="filterOrigin"]').type(origin);
});
