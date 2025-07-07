import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, fireEvent, waitFor } from '@testing-library/vue'
import ShowDetails from '../pages/ShowDetails.vue'
import * as tvmaze from '../services/tvmaze'

vi.mock('../services/tvmaze')

const mockBack = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
  useRoute: () => ({
    params: { id: '1' },
  }),
}))

describe('ShowDetails.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches show details and renders them', async () => {
    (tvmaze.getShowById as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      name: 'Test Show',
      summary: 'This is a test show.',
      genres: ['Drama', 'Comedy'],
      rating: { average: 8.5 },
      schedule: { days: ['Monday'], time: '20:00' },
      image: { original: 'https://test.com/show.jpg' },
    })

    const { getByText, container } = render(ShowDetails)

    await waitFor(() => {
      expect(getByText('Test Show')).toBeTruthy()
    })

    expect(container.querySelector('p')).toContainHTML('This is a test show.')

    // Check genres label + content via parent
    const genresLabel = getByText('Genres:')
    expect(genresLabel.parentElement?.textContent).toContain('Drama')
    expect(genresLabel.parentElement?.textContent).toContain('Comedy')

    // Check rating similarly
    const ratingLabel = getByText('Rating:')
    expect(ratingLabel.parentElement?.textContent).toContain('8.5')

    // Check schedule similarly
    const scheduleLabel = getByText('Schedule:')
    expect(scheduleLabel.parentElement?.textContent).toContain('Monday')
    expect(scheduleLabel.parentElement?.textContent).toContain('20:00')
  })

  it('calls router.back() when back button clicked', async () => {
    const { getByText } = render(ShowDetails)

    const backButton = getByText('Back')
    await fireEvent.click(backButton)

    expect(mockBack).toHaveBeenCalled()
  })
})
