Feature: Filter Carpool Rides

  Scenario: Filter by origin
    Given the carpool page is open
    And the following rides exist:
      | driver | origin    | destination | departure_time      | passenger_limit |
      | Alice  | Gent      | Brussel     | 2026-06-07T08:00:00 | 2               |
      | Bob    | Antwerpen | Brussel     | 2026-06-07T09:00:00 | 3               |
    When I filter by origin "Gent"
    Then I should see "Alice" in the ride list
    And I should not see "Bob" in the ride list

  Scenario: Filter by destination
    Given the carpool page is open
    And the following rides exist:
      | driver | origin    | destination | departure_time      | passenger_limit |
      | Alice  | Gent      | Brussel     | 2026-06-07T08:00:00 | 2               |
      | Bob    | Antwerpen | Gent        | 2026-06-07T09:00:00 | 3               |
    When I filter by destination "Brussel"
    Then I should see "Alice" in the ride list
    And I should not see "Bob" in the ride list

  Scenario: Filter by origin and destination
    Given the carpool page is open
    And the following rides exist:
      | driver | origin    | destination | departure_time      | passenger_limit |
      | Alice  | Gent      | Brussel     | 2026-06-07T08:00:00 | 2               |
      | Bob    | Gent      | Antwerpen   | 2026-06-07T09:00:00 | 3               |
      | Carol  | Antwerpen | Brussel     | 2026-06-07T10:00:00 | 4               |
    When I filter by origin "Gent"
    And I filter by destination "Brussel"
    Then I should see "Alice" in the ride list
    And I should not see "Bob" in the ride list
    And I should not see "Carol" in the ride list

  Scenario: No rides match the filter
    Given the carpool page is open
    And the following rides exist:
      | driver | origin    | destination | departure_time      | passenger_limit |
      | Alice  | Gent      | Brussel     | 2026-06-07T08:00:00 | 2               |
    When I filter by origin "Antwerpen"
    Then I should not see any rides in the list

  Scenario: Clear the filters
    Given the carpool page is open
    And the following rides exist:
      | driver | origin    | destination | departure_time      | passenger_limit |
      | Alice  | Gent      | Brussel     | 2026-06-07T08:00:00 | 2               |
      | Bob    | Antwerpen | Brussel     | 2026-06-07T09:00:00 | 3               |
    And I have filtered by origin "Gent"
    When I clear the filters
    Then I should see "Alice" in the ride list
    And I should see "Bob" in the ride list
