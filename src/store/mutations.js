const mutations = {
  changeActiveTitle(state, title) {
    state.activeTitle = title
  },
  toggleMapUpdateSize(state, newVal) {
    state.mapUpdateSize = newVal
  }
}
export default mutations
