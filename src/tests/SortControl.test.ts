import { render, fireEvent } from '@testing-library/vue'
// @ts-ignore
import SortControl from '../components/SortControl.vue'
import { describe, it, expect, vi } from 'vitest'

describe('SortControl.vue', () => {
  it('renders with correct initial selected option', () => {
    const { getByDisplayValue } = render(SortControl, {
      props: {
        sortOrder: 'asc',
      },
    })

    expect(getByDisplayValue('Lowest rated first')).toBeTruthy()
  })

  it('emits update when selection changes', async () => {
    const updateHandler = vi.fn()

    const { getByRole } = render(SortControl, {
      props: {
        sortOrder: 'asc',
        'onUpdate:sortOrder': updateHandler,
      },
    })

    const select = getByRole('combobox')
    expect((select as HTMLSelectElement).value).toBe('asc')

    // Change to "desc"
    await fireEvent.update(select, 'desc')

    expect(updateHandler).toHaveBeenCalledWith('desc')
  })

  it('renders both sorting options', () => {
    const { getByText } = render(SortControl, {
      props: { sortOrder: 'desc' },
    })

    expect(getByText('Highest rated first')).toBeTruthy()
    expect(getByText('Lowest rated first')).toBeTruthy()
  })
})
