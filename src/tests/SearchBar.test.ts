import { render, fireEvent } from '@testing-library/vue'
// @ts-ignore
import SearchBar from '../components/SearchBar.vue'
import { describe, it, expect, vi } from 'vitest'

describe('SearchBar.vue', () => {
  it('renders the input with correct placeholder', () => {
    const { getByPlaceholderText } = render(SearchBar)

    const input = getByPlaceholderText('Search TV shows...')
    expect(input).toBeTruthy()
  })

  it('emits search event with typed value', async () => {
    const searchHandler = vi.fn()

    const { getByPlaceholderText } = render(SearchBar, {
      props: {
        onSearch: searchHandler,
      },
    })

    const input = getByPlaceholderText('Search TV shows...')
    await fireEvent.update(input, 'Succession')

    expect(searchHandler).toHaveBeenCalledWith('Succession')
  })
})
