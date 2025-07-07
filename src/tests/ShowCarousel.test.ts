// src/tests/ShowCarousel.test.ts
import { render, fireEvent } from '@testing-library/vue'
import ShowCarousel from '../components/ShowCarousel.vue' // adjust path

const mockShows = [
  { id: 1, name: 'Breaking Bad' },
  { id: 2, name: 'Stranger Things' },
]

describe('ShowCarousel.vue', () => {
  it('renders shows passed via prop', () => {
    const { getByText } = render(ShowCarousel, {
      props: {
        shows: mockShows,
        cardWidth: 256,
        isLoading: false,
        hasMore: false,
      },
    })

    expect(getByText('Breaking Bad')).toBeTruthy()
    expect(getByText('Stranger Things')).toBeTruthy()
  })

  it('shows "No shows found." when shows array is empty and not loading', () => {
    const { getByText } = render(ShowCarousel, {
      props: {
        shows: [],
        isLoading: false,
        hasMore: false,
      },
    })

    expect(getByText('No shows found.')).toBeTruthy()
  })

  it('shows loading spinner when loading and no shows', () => {
    const { getByTestId } = render(ShowCarousel, {
      props: {
        shows: [],
        isLoading: true,
        hasMore: false,
      },
    })

    // Assuming your LoadingSpinner component has data-testid="loading-spinner"
    expect(getByTestId('loading-spinner')).toBeTruthy()
  })

  it('shows load more button when hasMore is true and shows exist', async () => {
    const { getByText, emitted } = render(ShowCarousel, {
      props: {
        shows: mockShows,
        isLoading: false,
        hasMore: true,
      },
    })

    const button = getByText('Load More')
    expect(button).toBeTruthy()

    await fireEvent.click(button)
    expect(emitted()['load-more']).toBeTruthy()
  })

  it('disables load more button when isLoading', () => {
    const { getByText } = render(ShowCarousel, {
      props: {
        shows: mockShows,
        isLoading: true,
        hasMore: true,
      },
    })

    const button = getByText('Loading...')
    expect(button).toBeTruthy()
    expect(button).toBeDisabled()
  })
})
