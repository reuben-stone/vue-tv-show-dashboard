export async function getAllShows() {
  const res = await fetch('https://api.tvmaze.com/shows')
  return await res.json()
}

export async function getShowById(id: string | number) {
  const res = await fetch(`https://api.tvmaze.com/shows/${id}`)
  return await res.json()
}

export async function searchShowsByName(query: string) {
  const res = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
  const data = await res.json()
  return data.map((entry: any) => entry.show)
}

export async function getShowsByPage(page: number) {
  const res = await fetch(`https://api.tvmaze.com/shows?page=${page}`)
  if (!res.ok) throw new Error('Failed to fetch shows')
  return await res.json()
}
