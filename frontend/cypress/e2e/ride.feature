Feature: Create carpool ride via UI

  Scenario: User creates a new carpool ride
    Given I open the carpool page
    When I fill in "Alice" as driver
    And I fill in "Gent" as origin
    And I fill in "Brussel" as destination
    And I set the departure time to "2026-06-07T08:00"
    And I set the number of passengers to "5"
    And I click on "Create Ride"
    Then I should see "Alice" in the ride list

  Scenario: User adds a passenger to a carpool ride
    Given I open the carpool page
    And a carpool ride exists with driver "Alice"
    When I fill in "Bob" as passenger
    And I click on "Add Passenger"
    Then I should see "Bob" listed under "Alice"'s ride

  Scenario: Creating a ride with a past departure time shows an error
    Given I open the carpool page
    When I fill in "Alice" as driver
    And I fill in "Gent" as origin
    And I fill in "Brussel" as destination
    And I set the departure time to "2000-01-01T08:00"
    And I set the number of passengers to "3"
    And I click on "Create Ride" without waiting
    Then I should see a message "Departure time must be in the future"
    And I should not see "Alice" in the ride list

  Scenario: Admin can delete a carpool ride
    Given I am logged in as admin
    And a carpool ride exists with driver "Alice"
    When I click on "Delete" for "Alice"'s ride
    Then I should not see "Alice" in the ride list

  Scenario: Regular user cannot delete a carpool ride
    Given I am logged in as a regular user
    And a carpool ride exists with driver "Alice"
    Then I should not see a "Delete" button for "Alice"'s ride