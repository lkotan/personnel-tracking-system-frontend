export default {
  addEntities(state, entities) {
    state.entities = entities;
  },
  delete(state, id) {
    let models = state.myAllNotification;
    state.myAllNotification = models.filter(x => x.id != id);
  },
  deleteRange(state, list) {
    let models = state.entities;
    for (let i = 0; i < list.length; i++) {
      models = models.filter(x => x.id != list[i]);
    }
    state.entities = models;
  },
  addSelectList(state, entities) {
    state.selectList = entities;
  },
  addAllByPersonnelId(state, entities) {
    state.personnelEntities = entities;
  },
  addMyAllNotification(state, entities) {
    state.myAllNotification = entities;
  },
  addMyActiveNotification(state, entities) {
    state.myActiveNotification = entities.filter(x => x.isRead == false);
  }
}
