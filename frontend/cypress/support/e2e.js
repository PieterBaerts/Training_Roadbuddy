beforeEach(() => {
  cy.request("POST", "http://127.0.0.1:8000/test/reset");
});
