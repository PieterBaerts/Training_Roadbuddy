Feature: User login

  Scenario: Successful login
    Given I open the login page
    When I enter "alice" as username
    And I enter "secret123" as password
    And I click on "Log In"
    Then I should see "Welcome, alice"

  Scenario: Failed login
    Given I open the login page
    When I enter "alice" as username
    And I enter "wrongpassword" as password
    And I click on "Log In"
    Then I should see "Invalid credentials"

  Scenario: Successful admin login
    Given I open the login page
    When I enter "admin" as username
    And I enter "admin123" as password
    And I click on "Log In"
    Then I should see "Welcome, admin"
