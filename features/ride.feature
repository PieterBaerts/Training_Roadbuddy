Feature: Carpool ride creation

  Scenario: Add a new ride
    Given the FastAPI server is running
  When I create a ride with driver "Alice" from "Gent" to "Brussel" at "2026-06-07T08:00"
    Then the ride should be listed in the carpool rides
