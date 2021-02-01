export default {
  async getAll(state) {
    const res = await this.$EmailTemplateService.GetAll()
    state.commit('addEntities', res);
    return res;
  },
  async getSelectList(state) {
    const res = await this.$EmailTemplateService.SelectList()
    state.commit('addSelectList', res);
    return res
  },
  async insert(state, entity) {
    return await this.$EmailTemplateService.Insert(entity);
  },
  async update(state, entity) {
    return await this.$EmailTemplateService.Update(entity);
  },
  async delete(state, id) {
    let result = await this.$EmailTemplateService.Delete(id);
    if (result.success) state.commit('delete', id);
    return result;
  },
  async deleteRange(state, list) {
    let result = await this.$EmailTemplateService.DeleteRange(list);
    state.commit('deleteRange', result.filter(x => x.success).select("data"));
    return result;
  },
  async getEmailTemplateTypes(state) {
    if (state.getters.getEmailTemplateTypes.length > 0) return state.getters.getEmailTemplateTypes;
    let result = await this.$EmailTemplateService.EmailTemplateTypes();
    state.commit('addEmailTemplateTypes', result);
    return result;
  }
}
