/// <reference types="cypress" />
import { isMobile } from '../support/utils'

const post = {
  title: 'The Best Post',
  content: "It's great yo.",
  authorName: 'John',
}

// TODO: Add proper form validation to Vue client
// const errorMessages = {
//   notLoggedIn: 'You need to be "logged in" as a user to add a post',
//   empty: (name) => `${name} cannot be empty`,
// }

describe('Blog Posts', () => {
  before(() => {
    // clear and seed the database prior to the tests
    cy.exec('yarn api:db:reset')
  })

  beforeEach(() => {
    cy.visit('/blog')

    cy.getBySel('blog').find('ul').as('blog')

    cy.getBySel('title-field').as('title-input')
    cy.getBySel('content-field').as('content-input')
    cy.getBySel('blog-post-form').find('[type=submit]').as('submit')

    cy.getBySel('user-select').get('select').as('user-select')
  })

  it('should display blog post', () => {
    cy.get('@blog').find('li').contains(post.title).as('post')
    cy.get('@post').parent().should('include.text', `by ${post.authorName}`)
    cy.get('@post').click()

    // Show post page
    cy.url().should('include', '/posts/1')
    cy.get('h1.title').should('have.text', post.title)
    cy.get('h2.subtitle').contains(`Author: ${post.authorName}`).should('exist')
    cy.get('.content').contains(post.content).should('exist')
    cy.get('.button').contains('Delete').should('exist')

    // Go to edit mode
    cy.get('.button').contains('Edit').click()
    cy.getBySel('blog-post-form').should('exist')
    cy.get('@title-input').should('exist')
    cy.get('@content-input').should('exist')
    cy.get('@submit').should('exist')
    cy.get('.button').contains('Delete').should('not.exist')

    // Go back to read mode if cancelled
    cy.get('.button').contains('Cancel').click()
    cy.get('h2.subtitle').contains(`Author: ${post.authorName}`).should('exist')
    cy.get('.button').contains('Delete').should('exist')
    cy.get('.button').contains('Cancel').should('not.exist')
  })

  it('should have proper form validation', () => {
    // Form should be disabled by default
    cy.get('@submit').should('be.disabled')

    // Title and body required
    // Dirty the fields to get error messages to appear
    cy.get('@title-input').type(' ').type('{backspace}').blur()

    // cy.get('.help.is-danger')
    //   .contains(errorMessages.empty('Title'))
    //   .should('exist')
    cy.get('@content-input').type(' ').type('{backspace}').blur()
    // cy.get('.help.is-danger')
    //   .contains(errorMessages.empty('Content'))
    //   .should('exist')

    // Current user must be selected
    // cy.get('.help.is-danger')
    //   .contains(errorMessages.notLoggedIn)
    //   .should('exist')
    if (isMobile()) {
      cy.get('.navbar-burger').click()
    }
    cy.get('@user-select').select(post.authorName)
    // cy.get('.help.is-danger')
    //   .contains(errorMessages.notLoggedIn)
    //   .should('not.exist')

    // Type valid content
    cy.get('@title-input').type('A valid post').blur()
    cy.get('@content-input').type('With a valid content').blur()
    cy.get('.help.is-danger').should('not.exist')
    cy.get('@submit').should('not.be.disabled')
  })

  it('should create, update and delete blog post', () => {
    // Spy on requests to wait for their completion
    cy.intercept('POST', '/posts').as('createPost')
    cy.intercept('PATCH', '/posts/*').as('editPost')
    cy.intercept('DELETE', '/posts/*').as('deletePost')

    const originalTitle = 'A Title'
    const editedTitle = 'Edited Title'

    // Create
    cy.get('@title-input').type(originalTitle).blur()
    cy.get('@content-input').type(post.content).blur()
    if (isMobile()) {
      cy.get('.navbar-burger').click()
    }
    cy.get('@user-select').select(post.authorName)
    cy.get('@submit').click()
    cy.wait('@createPost')
    // Form should have been cleaned up
    cy.get('@title-input').should('contain.text', '')
    cy.get('@content-input').should('contain.text', '')
    cy.get('.help').should('not.exist')
    cy.get('@submit').should('be.disabled')

    // New post should appear in the list
    cy.get('@blog').find('li').contains(originalTitle).click()
    // cy.getBySel('blog').find('li').contains(originalTitle).click()

    // Update
    cy.url().should('include', '/posts/3')
    cy.get('.button').contains('Edit').click()
    cy.get('@title-input').clear().type(editedTitle)
    cy.get('@submit').click()
    cy.wait('@editPost')
    // Should be back to read mode
    cy.get('h1.title').should('have.text', editedTitle)
    // Should be in post list
    cy.go('back')
    cy.getBySel('blog')
      .find('li')
      .contains(editedTitle)
      // Go back to post page
      .click()

    // Delete
    cy.get('.button').contains('Delete').click()
    cy.on('window:confirm', () => true)
    cy.wait('@deletePost')
    cy.url().should('include', '/posts')
    cy.getBySel('blog').find('li').contains(editedTitle).should('not.exist')
  })
})
