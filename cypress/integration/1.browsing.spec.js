/// <reference types="cypress" />
import { isMobile, getApiUrl } from '../support/utils'

describe('Browsing', () => {
  beforeEach(() => {
    cy.intercept('GET', getApiUrl('/users'), { fixture: 'users.json' })
    cy.intercept('GET', getApiUrl('/posts'), { fixture: 'posts.json' })
    cy.fixture('posts.json').as('postsFixture')
    cy.fixture('users.json').as('usersFixture')
  })

  it('should display blog as homepage', function () {
    const posts = this.postsFixture

    cy.visit('/')
    // the homepage should be the blog
    cy.get('h1.title').should('contain', 'Blog')

    // with the fixtures there should be two blog posts
    cy.getBySel('blog').find('li').as('blog-posts')

    const postMention = ({ title, author }) => `${title} by ${author.name}`

    cy.get('@blog-posts').should('have.length', posts.length)

    cy.get('@blog-posts').first().should('have.text', postMention(posts[0]))
    cy.get('@blog-posts')
      .last()
      .should('have.text', postMention(posts[posts.length - 1]))

    // the blog form should be there too
    cy.get('h1.title').should('contain', 'New Post')
    cy.getBySel('blog-post-form').should('exist')
  })

  it('should have a functional navbar', function () {
    cy.visit('/')

    if (isMobile()) {
      cy.get('.navbar-burger').click()
    }
    cy.get('.navbar .navbar-menu .navbar-start')
      .find('.navbar-item')
      .as('nav-link')

    cy.get('@nav-link').should('have.length', 2)
    cy.get('@nav-link').first().as('blog-link').should('have.text', 'Blog')
    cy.get('@nav-link').last().as('users-link').should('have.text', 'Users')

    cy.get('@users-link').click()
    cy.url().should('include', '/users')

    cy.get('@blog-link').click()
    cy.url().should('include', '/blog')
  })

  it('should display users page', function () {
    const users = this.usersFixture

    cy.visit('/users')
    cy.get('h1.title').should('contain', 'Users')

    // with the fixtures there should be two blog posts
    cy.getBySel('user-list').find('li').as('users')
    cy.get('@users').should('have.length', users.length)

    const authorMention = ({ name, posts }) =>
      posts.length > 0 ? `${name} (author)` : name

    cy.get('@users').first().should('have.text', authorMention(users[0]))
    cy.get('@users')
      .last()
      .should('have.text', authorMention(users[users.length - 1]))

    // the blog form should be there too
    cy.get('h1.title').should('contain', 'New User')
    cy.getBySel('user-form').should('exist')
  })

  describe('Responsiveness', () => {
    context('720p resolution', () => {
      beforeEach(() => {
        // run these tests as if in a desktop browser with a 720p monitor
        cy.viewport(1280, 720)
      })

      it('should not display navbar burger', () => {
        cy.visit('/')
        cy.get('.navbar-burger').should('not.be.visible')
      })
    })

    context('iphone-5 resolution', () => {
      beforeEach(() => {
        // run these tests as if in a mobile browser
        // and ensure our responsive UI is correct
        cy.viewport('iphone-5')
      })

      it('should display navbar burger', () => {
        cy.visit('/')
        cy.get('.navbar-burger').should('be.visible')
      })
    })
  })
})
