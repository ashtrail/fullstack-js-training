/// <reference types="cypress" />

describe('Users', () => {
  before(() => {
    // clear and seed the database prior to the tests
    cy.exec('yarn api:db:reset')
  })

  beforeEach(() => {
    cy.visit('/users')
    cy.getBySel('user-list').find('li').as('users')
    cy.getBySel('username-field').as('name-input')
    cy.getBySel('user-form').find('[type=submit]').as('submit')
  })

  it('should display user', () => {
    cy.get('@users').contains('John').as('user')
    cy.get('@user').parent().should('include.text', '(author)')
    cy.get('@user').click()

    // Show user page
    cy.url().should('include', '/users/1')
    cy.get('h1.title').should('have.text', 'John')
    cy.get('.button').contains('Delete').should('exist')
    // Show posts
    cy.get('.subtitle').should('have.text', 'Posts')
    cy.get('li').contains('The Best Post').should('exist')
    // Go to edit mode
    cy.get('.button').contains('Edit').click()
    cy.getBySel('user-form').should('exist')
    cy.contains('Posts').should('not.exist')
    cy.get('.button').contains('Delete').should('not.exist')
    // Go back to read mode if cancelled
    cy.get('.button').contains('Cancel').click()
    cy.get('.subtitle').should('have.text', 'Posts')
    cy.get('.button').contains('Delete').should('exist')
    cy.get('.button').contains('Cancel').should('not.exist')
  })

  it('should have proper form validation', () => {
    // Form should be disabled by default
    cy.get('@submit').should('be.disabled')

    // John already exists
    cy.get('@users').contains('John').as('user')
    cy.get('@name-input').type('John')
    cy.get('.help.is-danger')
      .contains('This username is not available')
      .should('exist')
    cy.get('@submit').should('be.disabled')

    // Can't submit empty text
    cy.get('@name-input').clear()
    cy.get('.help.is-danger')
      .contains('User name cannot be empty')
      .should('exist')

    // A valid name should be submittable
    cy.get('@name-input').type('James')
    cy.get('.help.is-success')
      .contains('This username is available')
      .should('exist')
    cy.get('@submit').should('not.be.disabled')

    // Go to John's page
    cy.get('@user').click()
    cy.get('.button').contains('Edit').click()
    cy.get('@name-input').should('have.value', 'John')

    // TODO: check proper form clean up
    // cy.get('.help.is-danger').should('not.exist')

    // Dirty the field to get the error message to appear
    cy.get('@name-input').type(' ').type('{backspace}')
    // Shouldn't be able to edit with same name
    cy.get('.help.is-danger')
      .contains('This is the current username')
      .should('exist')
    cy.get('@submit').should('be.disabled')
    cy.get('@name-input').type('y')
    cy.get('.help.is-success')
      .contains('This username is available')
      .should('exist')
    cy.get('@submit').should('not.be.disabled')
  })

  it('should create, update and delete user', () => {
    // Spy on requests to wait for their completion
    cy.intercept('POST', '/users').as('createUser')
    cy.intercept('PATCH', '/users/*').as('editUser')
    cy.intercept('DELETE', '/users/*').as('deleteUser')

    const originalName = 'James'
    const editedName = 'Jarvis'

    // Create
    cy.get('@name-input').type(originalName)
    cy.get('@submit').click()
    cy.wait('@createUser')
    // Form should have been cleaned up
    cy.get('@name-input').should('contain.text', '')
    // TODO: check proper form clean up
    // cy.get('.help').should('not.exist')
    cy.get('@submit').should('be.disabled')
    // New user should appear in user list
    cy.getBySel('user-list')
      .find('li')
      .contains(originalName)
      .should('not.have.text', '(author)')
      .click()

    // Update
    cy.url().should('include', '/users/3')
    cy.get('.button').contains('Edit').click()
    cy.get('@name-input').clear().type(editedName)
    cy.get('@submit').click()
    cy.wait('@editUser')
    // Should be back to read mode
    cy.get('h1.title').should('have.text', editedName)
    // Should be in users list
    cy.go('back')
    cy.getBySel('user-list')
      .find('li')
      .contains(editedName)
      // Go back to user page
      .click()

    // Delete
    cy.get('.button').contains('Delete').click()
    cy.on('window:confirm', () => true)
    cy.wait('@deleteUser')
    cy.url().should('include', '/users')
    cy.getBySel('user-list').find('li').contains(editedName).should('not.exist')
  })
})
