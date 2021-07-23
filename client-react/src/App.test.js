import { render, screen } from '@testing-library/react'
import App from './App'

test('renders show Blog title', () => {
  render(<App />)
  const titleElement = screen.getByText(/React Blog/i)
  expect(titleElement).toBeInTheDocument()
})
