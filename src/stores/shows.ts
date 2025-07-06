import { defineStore } from 'pinia'

export const useShowsStore = defineStore('shows', {
  state: () => ({
    apiPage: 0,
    apiBuffer: [] as any[],       // Queue of unrendered shows
    displayedShows: [] as any[],  // Shows visible to the user
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
      // Load from buffer or fetch more
      if (this.apiBuffer.length === 0) {
        const hasMore = await this.fetchApiPage()
        if (!hasMore) return false
      }

      const nextBatch = this.apiBuffer.splice(0, batchSize)
      this.displayedShows.push(...nextBatch)
      return nextBatch.length > 0
    },

    clearShows() {
      this.apiPage = 0
      this.apiBuffer = []
      this.displayedShows = []
    },
  },
})
