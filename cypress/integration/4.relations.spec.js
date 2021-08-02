/// <reference types="cypress" />
import { isMobile } from '../support/utils'

describe('Data relations', () => {
  beforeEach(() => {
    // clear and seed the database prior to the tests
    cy.exec('yarn api:db:reset')
    cy.fixture('users.json').as('users')
    cy.fixture('posts.json').as('posts')
  })

  it('should update post author when the user is modified', function () {
    const user = this.users[0]
    const post = user.posts[0]
    const editedName = 'Jarvis'

    // Spy on requests to wait for their completion
    cy.intercept('PATCH', '/users/*').as('editUser')
    cy.intercept('DELETE', '/users/*').as('deleteUser')

    cy.visit('/users')
    // Check user and post exist
    cy.getBySel('user-list').find('li').contains(user.name).click()
    cy.get('li').contains(post.title).should('exist')

    // Edit user
    cy.get('.button').contains('Edit').click()
    cy.getBySel('username-field').clear().type(editedName)
    cy.getBySel('user-form').find('[type=submit]').click()
    cy.wait('@editUser')
    // Check the post has the edited name of its author
    cy.get('li').contains(post.title).click()
    cy.get('h2.subtitle').contains(editedName).should('exist').click()

    // Delete user
    cy.get('.button').contains('Delete').click()
    cy.on('window:confirm', () => true)
    cy.wait('@deleteUser')
    // Go to the blog post list and check their post has also been deleted
    if (isMobile()) {
      cy.get('.navbar-burger').click()
    }
    cy.getBySel('navlink-blog').click()
    cy.getBySel('blog').find('li').contains(post.title).should('not.exist')
  })

  it("should update author's posts when a post is modified", function () {
    const user = this.users[0]
    const post = {
      title: 'A new post',
      content: 'With some content',
    }
    const editedTitle = 'A modified title'

    // Spy on requests to wait for their completion
    cy.intercept('POST', '/posts').as('createPost')
    cy.intercept('PATCH', '/posts/*').as('editPost')
    cy.intercept('DELETE', '/posts/*').as('deletePost')

    // Check post doesn't exist in user's post list
    cy.visit('/users')
    cy.getBySel('user-list').find('li').contains(user.name).click()
    cy.get('li').contains(post.title).should('not.exist')

    // Create new post
    cy.visit('/blog')
    cy.getBySel('blog-post-form').find('[type=submit]').as('submit')
    cy.getBySel('title-field').type(post.title).blur()
    cy.getBySel('content-field').type(post.content).blur()
    if (isMobile()) {
      cy.get('.navbar-burger').click()
    }
    cy.getBySel('user-select').get('select').select(user.name)
    cy.get('@submit').click()
    cy.wait('@createPost')
    // Check user has the new post in their list
    cy.getBySel('blog').find('li').contains(user.name).click()
    cy.get('li').contains(post.title).should('exist').click()

    // Edit post
    cy.get('.button').contains('Edit').click()
    cy.getBySel('title-field').clear().type(editedTitle)
    cy.get('@submit').click()
    cy.wait('@editPost')
    cy.get('h2.subtitle').contains(user.name).should('exist').click()
    // Check user has the edited title in their list
    cy.get('li').contains(post.title).should('not.exist')
    cy.get('li').contains(editedTitle).should('exist').click()

    // Delete post
    cy.get('.button').contains('Delete').click()
    cy.on('window:confirm', () => true)
    cy.wait('@deletePost')
    // Back to the blog page
    // Navigate back to the user page without reloading the SPA
    cy.getBySel('navlink-users').click()
    cy.getBySel('user-list').find('li').contains(user.name).click()
    // Check that the post isn't in the user list anymore
    cy.get('li').contains(post.title).should('not.exist')
    cy.get('li').contains(editedTitle).should('not.exist')
  })
})
