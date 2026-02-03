// javascript
// filepath: RoadBuddy/frontend/cypress/e2e/passenger_limits.test.js
describe('Passenger Limits for Carpool Rides', () => {
  const baseApi = 'http://127.0.0.1:8000';

  beforeEach(() => {
    cy.request('POST', `${baseApi}/test/reset`);
    cy.intercept('GET', '**/rides*').as('loadRides');
    cy.visit('/');
    cy.wait('@loadRides');
  });

  function createRideViaUI(driver, origin = 'Gent', destination = 'Brussel', time = '2025-06-07T08:00', limit = '2') {
    cy.get('input[name="driver_name"]').clear().type(driver);
    cy.get('input[name="origin"]').clear().type(origin);
    cy.get('input[name="destination"]').clear().type(destination);
    cy.get('input[name="departure_time"]').clear().type(time);
    cy.get('input[name="passenger_limit"]').clear().type(limit);
    cy.intercept('GET', `${baseApi}/carpools/rides/`).as('refreshRides');
    cy.contains('button', 'Create Ride').click();
    cy.wait('@refreshRides');
  }

  function createRideViaAPI(driver, limit = 2) {
    cy.request('POST', `${baseApi}/carpools/rides/`, {
      driver_name: driver,
      origin: 'Gent',
      destination: 'Brussel',
      departure_time: '2025-06-07T08:00',
      passenger_limit: parseInt(limit)
    });
    cy.reload();
    cy.intercept('GET', '**/rides*').as('loadRidesAfterCreate');
    cy.wait('@loadRidesAfterCreate');
  }

  function addPassengerToRide(driver, passenger) {
    cy.get('.ride-list').contains(driver)
      .parents('li')
      .within(() => {
        cy.get('input[name="passenger_name"]').clear().type(passenger);
        cy.contains('button', 'Add Passenger').click();
      });
  }

  it('Driver creates a ride with a passenger limit', () => {
    createRideViaUI('Alice', 'Gent', 'Brussel', '2025-06-07T08:00', '2');
    cy.get('.ride-list').should('contain', 'Alice');
  });

  it('Passenger can join a ride that is not full', () => {
    createRideViaAPI('Bob', 2);
    addPassengerToRide('Bob', 'Charlie');

    // Charlie should be listed under Bob's ride
    cy.get('.ride-list').contains('Bob')
      .parents('li')
      .within(() => {
        cy.contains('Charlie').should('exist');
        // show current passengers count (expects the UI to display a number; adjust if UI differs)
        cy.contains('1').should('exist');
      });
  });

  it('Passenger cannot join a full ride', () => {
    createRideViaAPI('Dana', 1);
    // First passenger fills the ride
    addPassengerToRide('Dana', 'Eve');

    // The Add Passenger button for Dana's ride should now be disabled
    cy.get('.ride-list').contains('Dana')
      .parents('li')
      .within(() => {
        cy.contains('button', 'Add Passenger').should('be.disabled');
        // Attempting to type another passenger should not result in a new passenger being listed
        cy.get('input[name="passenger_name"]').clear().type('Frank');
        // try clicking if not disabled (defensive)
        cy.contains('button', 'Add Passenger').then(($btn) => {
          if (!$btn.prop('disabled')) {
            cy.wrap($btn).click();
          }
        });
      });

    // Ensure second passenger not present
    cy.get('.ride-list').contains('Dana')
      .parents('li')
      .should('not.contain', 'Frank');
  });

  it('Display passenger limit and current passengers', () => {
    createRideViaAPI('Frank', 3);
    addPassengerToRide('Frank', 'Gina');
    addPassengerToRide('Frank', 'Hank');

    cy.get('.ride-list').contains('Frank')
      .parents('li')
      .within(() => {
        // Expect UI to show current count (2) and limit (3). Adjust assertions if the UI formats differently.
        cy.contains('2').should('exist');
        cy.contains('3').should('exist');
        // ensure both passenger names are present
        cy.contains('Gina').should('exist');
        cy.contains('Hank').should('exist');
      });
  });
});