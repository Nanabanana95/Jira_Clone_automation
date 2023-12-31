import { NumberModule, faker } from '@faker-js/faker';

const randomTitle = faker.word.adjective()
const randomWord = faker.word.adjective()
const submitButton = 'button[type="submit"]';
const issueModal = '[data-testid="modal:issue-create"]';
const title = 'input[name="title"]';
const issueType = '[data-testid="select:type"]';
const descriptionField = '.ql-editor';
const selectType = '[data-testid="select:type"]';
const selectOptionStory = '[data-testid="select-option:Story"]';
const selectOptionLordGaben = '[data-testid="select-option:Lord Gaben"]';
const selectOptionBabyYoda = '[data-testid="select-option:Baby Yoda"]';
const modalIssueCreate = '[data-testid="modal:issue-create"]';
const listIssue = '[data-testid="list-issue"]';


describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    //System will already open issue creating modal in beforeEach block  
    cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  it('Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get(issueModal).within(() => {
      
      //open issue type dropdown and choose Story
      cy.get(selectType).click();
      cy.get(selectOptionStory)
          .trigger('click');

      //Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');

      //Type value to title input field
      //Order of filling in the fields is first description, then title on purpose
      //Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');
      
      //Select Lord Gaben from reporter dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get(selectOptionLordGaben).click();

      //Click on button "Create issue"
      cy.get(submitButton).click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get(modalIssueCreate).should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    
    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get(listIssue)
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE');
      //Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
      cy.get('[data-testid="icon:story"]').should('be.visible');
    });
  });

  it('Test 1. Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get(issueModal).within(() => {

      //open issue type dropdown and choose Bug
      cy.get(issueType).click()
      cy.get('[data-testid="select-option:Bug"]')
        .trigger('click');

      //Type value to description input field
      cy.get(descriptionField).type('My bug description');

      //Type value to title input field
      cy.get(title).type('Bug');

      //Select Pickle Rick from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      
      //Select Highest priority
      cy.get('[data-testid="select:priority"]').click()
      cy.get('[data-testid="select-option:Highest"]').click()

      //Click on button "Create issue"
      cy.get(submitButton).click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get(issueModal).should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');
  });

  it('Test 2. Should create an issue using random data plugin', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get(issueModal).within(() => {

      //open issue type dropdown and choose Task


      //Type random value to description and title input field
      cy.get(descriptionField).type(randomWord);
      cy.get(title).type(randomTitle);

      //Select Baby Yoda from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get(selectOptionBabyYoda).click();

      //Select low priority
      cy.get('[data-testid="select:priority"]').click()
      cy.get('[data-testid="select-option:Low"]').click()

      //Click on button "Create issue"
      cy.get(submitButton).click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get(issueModal).should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');
  });

  it('Should validate title is required field if missing', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get(issueModal).within(() => {
      //Try to click create issue button without filling any data
      cy.get(submitButton).click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });

  it('Task 3. Verify that application is removing unnecessary spaces on the board view.', () => {
    const title = ' Hello world ';
    
    cy.get(modalIssueCreate).within(() => {
      cy.get('.ql-editor').type('TEST_DESCRIPTION');
      cy.get('input[name="title"]').debounced('type', title);
      cy.get(submitButton).click();
    });

    cy.get(modalIssueCreate).should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');
    cy.get('[data-testid="board-list:backlog').within(() => {
      cy.get(listIssue).first().find('p')
        .click()
        .should('contain', title.trim())
    });
  });
});