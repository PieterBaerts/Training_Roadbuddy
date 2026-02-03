Feature: Passenger Limits for Carpool Rides

  Scenario: Driver creates a ride with a passenger limit
    Given I open the carpool page
    When I fill in "Alice" as driver
    And I fill in "Gent" as origin
    And I fill in "Brussel" as destination
    And I set the departure time to "2026-06-07T08:00"
    And I set the passenger limit to "2"
    And I click on "Create Ride"
    Then I should see "Alice" in the ride list
    And I should see "0/2" passengers for "Alice"'s ride

  Scenario: Passenger cannot join a full ride
    Given I open the carpool page
    And a carpool ride exists with driver "Alice" and passenger limit "1"
    And "Bob" has joined "Alice"'s ride
    When I fill in "Charlie" as passenger
    Then the "Add Passenger" button should be disabled
    And I should not see "Charlie" listed under "Alice"'s ride
    And I should see a message "This ride is full."

  Scenario: Passenger can join a ride that is not full
    Given I open the carpool page
    And a carpool ride exists with driver "Alice" and passenger limit "2"
    And "Bob" has joined "Alice"'s ride
    When I fill in "Charlie" as passenger
    And I click on "Add Passenger"
    Then I should see "Charlie" listed under "Alice"'s ride
    And I should see "2/2" passengers for "Alice"'s ride

  Scenario: Display passenger limit and current passengers
    Given I open the carpool page
    And a carpool ride exists with driver "Alice" and passenger limit "3"
    And "Bob" has joined "Alice"'s ride
    When I view "Alice"'s ride details
    Then I should see "1/3" passengers for "Alice"'s ride
