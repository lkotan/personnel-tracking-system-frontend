export default {
  async getAll(state, roleId) {
    const res = await this.$RuleService.GetAll(roleId);
    state.commit('addEntities', res);
    return res;
  },
  async insert(state, entity) {
    return await this.$RuleService.Insert(entity);
  },
  async saveRange(state, entity) {
    return await this.$RuleService.SaveRange(entity);
  },
  async update(state, entity) {
    return await this.$RuleService.Update(entity);
  },
  async delete(state, id) {
    const result = await this.$RuleService.Delete(id);
    if (result.success) state.commit('delete', id);
    return result;
  },
  async deleteRange(state, list) {
    let result = await this.$RuleService.DeleteRange(list);
    state.commit('deleteRange', result.filter(x => x.success).select("data"));
    return result;
  }
}
