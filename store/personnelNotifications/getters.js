export default {
  getAll(state) {
    return state.entities;
  },
  getSelectList(state) {
    return state.selectList;
  },
  getAllByPersonnelId(state) {
    return state.personnelEntities
  },
  getMyAllNotification(state) {
    return state.myAllNotification
  },
  myActiveNotification(state) {
    return state.myActiveNotification
  },
}
