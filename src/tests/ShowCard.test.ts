import { render } from '@testing-library/vue'
// @ts-ignore
import ShowCard from '../components/ShowCard.vue'
import { test } from 'vitest'

test('renders show card with correct name', () => {
  const show = { id: 1, name: 'Test Show', rating: { average: 5 }, genres: ['Drama'] }
  const { getByText } = render(ShowCard, { props: { show } })
  
  getByText('Test Show')
})

