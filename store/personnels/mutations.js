export default {
  addEntities(state, entities) {
    state.entities = entities;
  },
  delete(state, id) {
    let models = state.entities;
    state.entities = models.filter(x => x.id != id);
  },
  deleteRange(state, list) {

    let models = state.entities;
    for (let i = 0; i < list.length; i++) {
      models = models.filter(x => x.id != list[i]);
    }
    state.entities = models;
  },
  isBlockedChange(state, id) {
    let models = state.entities;
    models.forEach(x => {
      if (x.id == id) x.isBlocked = !x.isBlocked
    });
    state.entities = models;
  },
  addSelectList(state, entities) {
    state.selectList = entities;
  },
  addPersonnelTypes(state, types) {
    state.personnelTypes = types;
  },
  addDashChart(state, dashChart) {
    state.dashChart = [];
     state.dashChart = dashChart;
  }
}