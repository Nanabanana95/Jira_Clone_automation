const issueDetailModal = '[data-testid="modal:issue-details"]';
const deleteButton = '[data-testid="icon:trash"]';
const confirmationPopup = '[data-testid="modal:confirm"]';
const closeDetailModalButton = '[data-testid="icon:close"]';

describe('Issue delete', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            //System will already open issue from the board in beforeEach block  
            cy.visit(url + '/board?modal-issue-details=true');
            cy.contains('This is an issue of type: Task.').click();
        });
    });
    
    it('Test 1. Deleting the issue', () => {
        // Click on trash icon and assert that the confirm modal is visible
        cy.get(deleteButton).should('be.visible').click()
        cy.get(confirmationPopup).should('be.visible')

        //Click on the Delete button, assert that the confirm modal in no longer visible
        cy.get(confirmationPopup).contains('button', 'Delete issue').click()
        cy.contains('Are you sure you want to delete this issue?').should('not.exist')

        //Assert that the issue is deleted
        cy.contains('This is an issue of type: Task.').should('not.exist')
    });

    it('Test 2. Start the issue deleting process, but cancel this action', () => {
        //Сlick on the trash icon
        cy.get(deleteButton).should('be.visible').click()
        
        //Cancel the deletion in the confirmation pop - up, pop-up is not visible
        cy.get(confirmationPopup).contains('Cancel').click()
        cy.contains('Are you sure you want to delete this issue?').should('not.exist')
       
        cy.get(issueDetailModal).within(() => {
            cy.get(closeDetailModalButton).first().click()
        });
        cy.get(issueDetailModal).should('not.exist')
        
        //Assert that issue is not deleted and still displayed on the Jira board
        cy.reload()
        cy.contains('This is an issue of type: Task.').should('exist')
    });
});