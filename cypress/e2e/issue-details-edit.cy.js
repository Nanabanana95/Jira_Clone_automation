const selectType = '[data-testid="select:type"]';
const selectOptionStory = '[data-testid="select-option:Story"]';
const selectAssignees = '[data-testid="select:assignees"]';
const selectStatus = '[data-testid="select:status"]';
const selectReporter = '[data-testid="select:reporter"]';
const selectOptionDone = '[data-testid="select-option:Done"]';
const selectOptionLordGaben = '[data-testid="select-option:Lord Gaben"]';
const selectOptionBabyYoda = '[data-testid="select-option:Baby Yoda"]';
const selectOptionPickleRick = '[data-testid="select-option:Pickle Rick"]';
const selectPriority = '[data-testid="select:priority"]';
const selectOptionMedium = '[data-testid="select-option:Medium"]';
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
      cy.get(selectType).click('bottomRight');
      cy.get(selectOptionStory)
          .trigger('mouseover')
          .trigger('click');
      cy.get(selectType).should('contain', 'Story');

      cy.get(selectStatus).click('bottomRight');
      cy.get(selectOptionDone).click();
      cy.get(selectStatus).should('have.text', 'Done');

      cy.get(selectAssignees).click('bottomRight');
      cy.get(selectOptionLordGaben).click();
      cy.get(selectAssignees).click('bottomRight');
      cy.get(selectOptionBabyYoda).click();
      cy.get(selectAssignees).should('contain', 'Baby Yoda');
      cy.get(selectAssignees).should('contain', 'Lord Gaben');

      cy.get(selectReporter).click('bottomRight');
      cy.get(selectOptionPickleRick).click();
      cy.get(selectReporter).should('have.text', 'Pickle Rick');

      cy.get(selectPriority).click('bottomRight');
      cy.get(selectOptionMedium).click();
      cy.get(selectPriority).should('have.text', 'Medium');
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

  it('Should check, that priority fields has ${numberOfPriorities} values', () => {
    const numberOfPriorities = 5;
    let priorities = [];
    //add already chosen priority to the list
    cy.get(selectPriority).invoke('text').then((extractedPriority) => {
      priorities.push(extractedPriority);
    })
    //click to open priority dropdown - options
    cy.get(selectPriority).click();
    //get number of options from the page
    cy.get('[data-select-option-value]').then(($options) => {
      const itemCount = Cypress.$($options).length;
      //iterate through the options and
      //add text from each option to the list
      for (let index = 0; index < itemCount; index++) {
        cy.get('[data-select-option-value]')
          .eq(index).invoke('text').then((extractedPriority) => {
            priorities.push(extractedPriority);
            if (index == (itemCount - 1)) {
              cy.log("TOTAL calculated array length: " + priorities.length);
              expect(priorities.length).to.be.eq(numberOfPriorities);
            }
          });
        };
    });
  });

  it('Task 2. Repoter name should contain only characters in it. Regex', () => {
    const regex = /^[A-Za-z\s]*$/;
    getIssueDetailsModal().within(() => {
      cy.get(selectReporter).click()
      cy.get(selectOptionPickleRick).click();
      cy.get(selectReporter)
        .should('have.text', 'Pickle Rick')
        .invoke('val')// Get the value of the input field
        .should('match', regex);
    });
  });
});
