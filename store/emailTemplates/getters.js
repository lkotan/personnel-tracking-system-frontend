export default {
  getAll(state) {
    return state.entities;
  },
  getSelectList(state) {
    return state.selectList;
  },
  getEmailTemplateTypes(state) {
    return state.emailTemplateTypes;
  }
}
