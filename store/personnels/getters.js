export default {
  getAll(state) {
    return state.entities;
  },
  getSelectList(state) {
    return state.selectList;
  },
  getPersonnelTypes(state) {
    return state.personnelTypes;
  },
  getDashChart(state) {
    return state.dashChart;
  }
}
