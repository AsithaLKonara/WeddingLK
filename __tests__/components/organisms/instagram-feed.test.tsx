import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import InstagramFeed from '@/components/organisms/instagram-feed'

// Mock the useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}), { virtual: true })

describe('InstagramFeed Component', () => {
  it('renders without crashing', () => {
    render(<InstagramFeed />)
    expect(screen.getByText('Loading posts...')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(<InstagramFeed />)
    expect(screen.getByText('Loading posts...')).toBeInTheDocument()
  })
})
