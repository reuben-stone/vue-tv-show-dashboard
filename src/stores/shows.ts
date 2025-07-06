import { defineStore } from 'pinia'

export const useShowsStore = defineStore('shows', {
  state: () => ({
    apiPage: 0,              // API page number (increments by 1)
    apiBuffer: [] as any[],  // raw shows fetched but not yet displayed
    displayedShows: [] as any[], // shows currently visible in UI
  }),
  actions: {
    async fetchApiPage() {
      const res = await fetch(`https://api.tvmaze.com/shows?page=${this.apiPage}`)
      if (!res.ok) throw new Error('Failed to fetch shows')
      const data = await res.json()
      if (data.length === 0) return false
      this.apiBuffer.push(...data)
      this.apiPage++
      return true
    },

    async loadMoreShows(batchSize = 20) {
      // If buffer is empty, fetch next API page
      if (this.apiBuffer.length === 0) {
        const hasMore = await this.fetchApiPage()
        if (!hasMore) return false // no more data
      }

      // Take up to batchSize shows from buffer and add to displayedShows
      const nextBatch = this.apiBuffer.splice(0, batchSize)
      this.displayedShows.push(...nextBatch)
      return true
    },

    clearShows() {
      this.apiBuffer = []
      this.displayedShows = []
      this.apiPage = 0
    },
  },
})
