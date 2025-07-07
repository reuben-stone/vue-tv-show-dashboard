import { render, fireEvent } from '@testing-library/vue'
// @ts-ignore
import ShowCard from '../components/ShowCard.vue'
import { describe, it, expect, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

describe('ShowCard.vue', () => {
  const mockShow = {
    id: 42,
    name: 'Test Show',
    rating: { average: 8.5 },
    image: {
      medium: 'https://example.com/test.jpg',
    },
  }

  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/show/:id', name: 'ShowDetail', component: { template: '<div>Show Detail</div>' } }],
  })

  it('renders show name and rating', async () => {
    const { getByText, getByAltText } = render(ShowCard, {
      global: {
        plugins: [router],
      },
      props: { show: mockShow },
    })

    expect(getByText('Test Show')).toBeTruthy()
    expect(getByText('Rating: 8.5')).toBeTruthy()
    expect(getByAltText('show.name')).toHaveAttribute('src', mockShow.image.medium)
  })

  it('navigates to show detail on click', async () => {
    router.push = vi.fn()
    const { getByText } = render(ShowCard, {
      global: {
        plugins: [router],
        mocks: {
          $router: router,
        },
      },
      props: { show: mockShow },
    })

    const card = getByText('Test Show').closest('div')
    await fireEvent.click(card!)

    expect(router.push).toHaveBeenCalledWith('/show/42')
  })
})
