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
  addSelectList(state, entities) {
    state.selectList = entities;
  },
  addEmailTemplateTypes(state, entities) {
    state.emailTemplateTypes = entities;
  }
}
