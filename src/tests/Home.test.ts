import { render, fireEvent, waitFor, screen } from '@testing-library/vue'
import Home from '../pages/Home.vue'
import { describe, it, expect, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useShowsStore } from '../stores/shows'

// Mock child components to simplify testing and expose needed elements
vi.mock('../components/SearchBar.vue', () => ({
  default: {
    template: `<input placeholder="Search TV shows..." @input="$emit('search', $event.target.value)" />`,
  },
}))

vi.mock('../components/GenreFilterDropdown.vue', () => ({
  default: { template: '<div></div>' },
}))

vi.mock('../components/SortControl.vue', () => ({
  default: { template: '<div></div>' },
}))

vi.mock('../components/ShowCarousel.vue', () => ({
  default: {
    props: ['shows', 'isLoading', 'hasMore'],
    emits: ['load-more'],
    template: `
      <div>
        <div v-if="shows.length === 0 && !isLoading">No shows found.</div>
        <ul>
          <li v-for="show in shows" :key="show.id">{{ show.name }}</li>
        </ul>
      </div>
    `,
  },
}))

const mockShows = [
  { id: 1, name: 'Breaking Bad', genres: ['Drama'], rating: { average: 9.5 } },
  { id: 2, name: 'Stranger Things', genres: ['Sci-Fi'], rating: { average: 8.7 } },
]

describe('Home.vue', () => {
  it('loads and displays shows on mount', async () => {
    const pinia = createTestingPinia({
      stubActions: false,
      initialState: {
        shows: {
          displayedShows: mockShows,
          apiBuffer: [],
        },
      },
      createSpy: vi.fn,
    })

    const store = useShowsStore()
    store.loadMoreShows = vi.fn().mockResolvedValue(true)

    render(Home, {
      global: { plugins: [pinia] },
    })

    await waitFor(() => {
      expect(screen.getByText('Breaking Bad')).toBeTruthy()
      expect(screen.getByText('Stranger Things')).toBeTruthy()
    })

    expect(store.loadMoreShows).toHaveBeenCalled()
  })

  it('shows "No shows found" when filtered list is empty', async () => {
    const pinia = createTestingPinia({
      initialState: {
        shows: {
          displayedShows: [],
          apiBuffer: [],
        },
      },
    })

    render(Home, {
      global: { plugins: [pinia] },
    })

    await waitFor(() => {
      expect(screen.getByText('No shows found.')).toBeTruthy()
    })
  })

  it('filters shows by search input', async () => {
    const pinia = createTestingPinia({
      initialState: {
        shows: {
          displayedShows: mockShows,
          apiBuffer: [],
        },
      },
    })

    render(Home, {
      global: { plugins: [pinia] },
    })

    const input = screen.getByPlaceholderText('Search TV shows...')
    await fireEvent.update(input, 'Stranger')

    await waitFor(() => {
      expect(screen.queryByText('Breaking Bad')).not.toBeInTheDocument()
      expect(screen.getByText('Stranger Things')).toBeTruthy()
    })
  })
})
