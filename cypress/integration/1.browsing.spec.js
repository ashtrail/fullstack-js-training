/// <reference types="cypress" />
import { isMobile } from '../support/utils'

describe('Browsing', () => {
  before(() => {
    cy.intercept('GET', '/users', { fixture: 'users.json' })
    cy.intercept('GET', '/posts', { fixture: 'posts.json' })
  })

  it('should display blog as homepage', () => {
    cy.visit('/')

    // the homepage should be the blog
    cy.get('h1.title').should('contain', 'Blog')

    // with the fixtures there should be two blog posts
    cy.getBySel('blog').find('li').as('blog-posts')
    cy.get('@blog-posts').should('have.length', 2)

    cy.get('@blog-posts').first().should('have.text', 'The Best Post by John')
    cy.get('@blog-posts')
      .last()
      .should('have.text', 'The Second Best Post by Jane')

    // the blog form should be there too
    cy.get('h1.title').should('contain', 'New Post')
    cy.getBySel('blog-post-form').should('exist')
  })

  it('should have a functional navbar', () => {
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

  it('should display users page', () => {
    cy.visit('/users')

    cy.get('h1.title').should('contain', 'Users')

    // with the fixtures there should be two blog posts
    cy.getBySel('user-list').find('li').as('users')
    cy.get('@users').should('have.length', 2)

    cy.get('@users').first().should('have.text', 'John (author)')
    cy.get('@users').last().should('have.text', 'Jane (author)')

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
