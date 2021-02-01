export default {
  async getAll(state) {
    const res = await this.$RoleService.GetAll()
    state.commit('addEntities', res);
    return res;
  },
  async insert(state, entity) {
    return await this.$RoleService.Insert(entity);
  },
  async update(state, entity) {
    return await this.$RoleService.Update(entity);
  },
  async delete(state, id) {
    let result = await this.$RoleService.Delete(id);
    if (result.success) state.commit('delete', id);
    return result;
  },
  async deleteRange(state, list) {
    let result = await this.$RoleService.DeleteRange(list);
    state.commit('deleteRange', result.filter(x => x.success).select("data"));
    return result;
  },
   async isBlockedChange(state, id) {
     const res = await this.$RoleService.IsBlockedChange(id);
     if (!res.success) state.commit('isBlockedChange', id);
     return res;
   },
}