import { render, fireEvent } from '@testing-library/vue'
import SearchBar from '../SearchBar.vue'

test('SearchBar emits search event', async () => {
  const { getByPlaceholderText, emitted } = render(SearchBar)

  const input = getByPlaceholderText(/search/i)
  await fireEvent.update(input, 'Breaking Bad')
  await fireEvent.keyDown(input, { key: 'Enter' })

  expect(emitted().search).toBeTruthy()
  expect(emitted().search[0]).toEqual(['Breaking Bad'])
})