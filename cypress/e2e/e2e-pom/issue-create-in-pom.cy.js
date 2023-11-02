import IssueModal from "../../pages/IssueModal";

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    //open issue creation modal  
    cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  //data set with which we are creating issue, saved as variable
  const issueDetails = {
    title: "Issue for test",
    type: "Bug",
    description: "TEST_DESCRIPTION",
    assignee: "Lord Gaben",
  };

  //number of issues we expect to see in the backlog after the test
  const EXPECTED_AMOUNT_OF_ISSUES = '5';

  it('Should create issue successfully', () => {
    IssueModal.createIssue(issueDetailsMyIssue);
    IssueModal.ensureIssueIsCreated(EXPECTED_AMOUNT_OF_ISSUES, issueDetails);
  });
})