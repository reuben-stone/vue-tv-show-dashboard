import { render, fireEvent } from '@testing-library/vue'
// @ts-ignore
import GenreFilterDropdown from '../components/GenreFilterDropdown.vue'
import { describe, it, expect, vi } from 'vitest'

describe('GenreFilterDropdown.vue', () => {
  const genres = ['Action', 'Comedy', 'Drama']

  it('renders all genre buttons', () => {
    const { getByText } = render(GenreFilterDropdown, {
      props: {
        allGenres: genres,
        selectedGenres: [],
      },
    })

    genres.forEach((genre) => {
      expect(getByText(genre)).toBeTruthy()
    })
  })

  it('emits selection when genre is clicked', async () => {
    const updateHandler = vi.fn()

    const { getByText } = render(GenreFilterDropdown, {
      props: {
        allGenres: genres,
        selectedGenres: [],
        'onUpdate:selectedGenres': updateHandler,
      },
    })

    const actionBtn = getByText('Action')
    await fireEvent.click(actionBtn)

    expect(updateHandler).toHaveBeenCalledWith(['Action'])
  })

  it('emits updated selection when genre is clicked again (deselected)', async () => {
    const updateHandler = vi.fn()

    const { getByText } = render(GenreFilterDropdown, {
      props: {
        allGenres: genres,
        selectedGenres: ['Action'],
        'onUpdate:selectedGenres': updateHandler,
      },
    })

    const actionBtn = getByText('Action')
    await fireEvent.click(actionBtn)

    expect(updateHandler).toHaveBeenCalledWith([])
  })

  it('shows and clears selected genres', async () => {
    const updateHandler = vi.fn()

    const { getByText } = render(GenreFilterDropdown, {
      props: {
        allGenres: genres,
        selectedGenres: ['Comedy'],
        'onUpdate:selectedGenres': updateHandler,
      },
    })

    const clearBtn = getByText('Clear')
    expect(clearBtn).toBeTruthy()

    await fireEvent.click(clearBtn)
    expect(updateHandler).toHaveBeenCalledWith([])
  })
})
