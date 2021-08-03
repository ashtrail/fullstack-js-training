/// <reference types="cypress" />
import { isMobile, getApiUrl } from '../support/utils'

describe('Blog Posts', () => {
  beforeEach(() => {
    cy.intercept('GET', getApiUrl('/users'), {
      fixture: 'users.json',
    })
    cy.intercept('GET', getApiUrl('/posts'), {
      fixture: 'posts.json',
    })

    cy.visit('/blog')

    cy.getBySel('blog').find('ul').as('blog')

    cy.getBySel('title-field').as('title-input')
    cy.getBySel('content-field').as('content-input')
    cy.getBySel('blog-post-form').find('[type=submit]').as('submit')

    cy.getBySel('user-select').get('select').as('user-select')

    cy.fixture('posts.json').as('postsFixture')
  })

  it('should display blog post', function () {
    const post = this.postsFixture[0]

    cy.get('@blog').find('li').contains(post.title).as('post')
    cy.get('@post').parent().should('include.text', `by ${post.author.name}`)
    cy.get('@post').click()

    // Show post page
    cy.url().should('include', `/posts/${post.id}`)
    cy.get('h1.title').should('have.text', post.title)
    cy.get('h2.subtitle')
      .contains(`Author: ${post.author.name}`)
      .should('exist')
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
    cy.get('h2.subtitle')
      .contains(`Author: ${post.author.name}`)
      .should('exist')
    cy.get('.button').contains('Delete').should('exist')
    cy.get('.button').contains('Cancel').should('not.exist')
  })

  it('should have proper form validation', function () {
    const errorMessages = {
      notLoggedIn: 'You need to be "logged in" as a user to add a post',
      empty: (name) => `${name} cannot be empty`,
    }
    const userName = this.postsFixture[0].author.name

    // Form should be disabled by default
    cy.get('@submit').should('be.disabled')

    // Title and body required
    // Dirty the fields to get error messages to appear
    cy.get('@title-input').type(' ').type('{backspace}').blur()

    cy.get('.help.is-danger')
      .contains(errorMessages.empty('Title'))
      .should('exist')
    cy.get('@content-input').type(' ').type('{backspace}').blur()
    cy.get('.help.is-danger')
      .contains(errorMessages.empty('Content'))
      .should('exist')

    // Current user must be selected
    cy.get('.help.is-danger')
      .contains(errorMessages.notLoggedIn)
      .should('exist')
    if (isMobile()) {
      cy.get('.navbar-burger').click()
    }
    cy.get('@user-select').select(userName)
    cy.get('.help.is-danger')
      .contains(errorMessages.notLoggedIn)
      .should('not.exist')

    // Type valid content
    cy.get('@title-input').type('A valid post').blur()
    cy.get('@content-input').type('With a valid content').blur()
    cy.get('.help.is-danger').should('not.exist')
    cy.get('@submit').should('not.be.disabled')
  })

  it('should create, update and delete blog post', function () {
    const originalTitle = 'A Title'
    const editedTitle = 'Edited Title'

    const post = { ...this.postsFixture[0], id: 3, title: originalTitle }
    const editedPost = { ...post, title: editedTitle }

    // Stub server responses to speed up test
    cy.intercept('POST', '/posts', {
      statusCode: 201,
      body: post,
    }).as('createPost')
    cy.intercept('PATCH', '/posts/*', {
      statusCode: 200,
      body: editedPost,
    }).as('editPost')
    cy.intercept('GET', `/posts/${post.id}`, {
      statusCode: 200,
      body: post,
    })
    cy.intercept('DELETE', '/posts/*', {
      statusCode: 204,
    }).as('deletePost')

    // Create
    cy.get('@title-input').type(originalTitle).blur()
    cy.get('@content-input').type(post.content).blur()
    if (isMobile()) {
      cy.get('.navbar-burger').click()
    }
    cy.get('@user-select').select(post.author.name)
    cy.get('@submit').click()
    cy.intercept('GET', getApiUrl('/posts'), {
      statusCode: 200,
      body: [...this.postsFixture, post],
    })
    cy.wait('@createPost')
    // Form should have been cleaned up
    cy.get('@title-input').should('contain.text', '')
    cy.get('@content-input').should('contain.text', '')
    cy.get('.help').should('not.exist')
    cy.get('@submit').should('be.disabled')

    // New post should appear in the list
    cy.get('@blog').find('li').contains(originalTitle).click()

    // Update
    cy.url().should('include', '/posts/3')
    cy.get('.button').contains('Edit').click()
    cy.get('@title-input').clear().type(editedTitle)
    cy.get('@submit').click()
    cy.intercept('GET', `/posts/${post.id}`, {
      statusCode: 200,
      body: editedPost,
    })
    cy.intercept('GET', getApiUrl('/posts'), {
      statusCode: 200,
      body: [...this.postsFixture, editedPost],
    })
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
