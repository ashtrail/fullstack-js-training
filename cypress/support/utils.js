export const isMobile = () => {
  return (
    Cypress.config('viewportWidth') <
    Cypress.env('mobileViewportWidthBreakpoint')
  )
}

const apiUrl = Cypress.env('apiUrl')
export const getApiUrl = (route) => `${apiUrl}${route}`
