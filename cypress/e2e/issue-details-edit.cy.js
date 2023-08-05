import IssueModal from "../pages/IssueModal";

const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
    });
  });

  it('Should update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Story"]')
          .trigger('mouseover')
          .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Story');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');

      cy.get('[data-testid="select:reporter"]').click('bottomRight');
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should('have.text', 'Pickle Rick');

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
    });
  });

  it('Should update title, description successfully', () => {
    const title = 'TEST_TITLE';
    const description = 'TEST_DESCRIPTION';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get('.ql-snow')
        .click()
        .should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
      cy.get('.ql-snow').should('have.text', description);
    });
  });

  it('Task 1. Check dropdown “Priority” on issue detail page. Validates values in issue priorities.', () => {
    let priorityList = ["Lowest", "Low", "Medium", "High", "Highest"];
    const expectedLength = 5;

    //Predefine variable for expected number of elements in the priority dropdown,
    //for example “const expectedLength = 5”
    getIssueDetailsModal().within(() => {
      cy.get('.sc-cMljjf').children().should('have.length', expectedLength)
    });

    //Predefine empty array variable.Decide, which definition is needed: const or let?
    //Push into this array first element from initially selected priority value
    //(value, that is chosen in the dropdown when we open issue detail view).

    //Access the list of all priority options
    //(you have to open the dropdown list before by clicking on the priority field)
    // - choose appropriate selector to access all options from the dropdown.

    //Loop through the elements: each time invoke text value from the current element and save it into your predefined array.

    //Print out added value and length of the array during each iteration, using cy.log(…) command.

    //Assert that created array has the same length as your predefined number, if everything is done correctly.
  });

  it('Task 2. Check that reporter name has only characters in it. Practice usage of string functions. Regex', () => {
    const regex = /^[A-Za-z\s]*$/;
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:reporter"]').click()
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]')
        .should('have.text', 'Pickle Rick')
        .invoke('val')// Get the value of the input field
        .should('match', regex); // Check if the reporter name contains only characters and spaces
    });
  });
});
