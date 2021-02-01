export default {
  async getAll(state) {
    const res = await this.$PersonnelService.GetAll()
    state.commit('addEntities', res);
    return res;
  },
  async getSelectList(state) {
    const res = await this.$PersonnelService.SelectList();
    state.commit('addSelectList', res);
    return res;
  },
  async insert(state, entity) {
    return await this.$PersonnelService.Insert(entity);
  },
  async update(state, entity) {
    return await this.$PersonnelService.Update(entity);
  },
  async delete(state, id) {
    let result = await this.$PersonnelService.Delete(id);
    if (result.success) state.commit('delete', id);
    return result;
  },
  async deleteRange(state, list) {
    let result = await this.$PersonnelService.DeleteRange(list);
    state.commit('deleteRange', result.filter(x => x.success).select("data"));
    return result;
  },
  async isBlockedChange(state, id) {
    const res = await this.$PersonnelService.IsBlockedChange(id);
    if (!res.success) state.commit('isBlockedChange', id);
    return res;
  },
  async getPersonnelTypes(state) {
    const res = await this.$PersonnelService.PersonnelTypes();
    state.commit("addPersonnelTypes", res);
    return res;
  },
  getDashChart(state, chart) {
   state.commit("addDashChart", chart);
  }
}
