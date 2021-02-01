export default {
  async getAll(state) {
    const res = await this.$NotificationService.GetAll()
    state.commit('addEntities', res);
    return res;
  },
  async insert(state, entity) {
    return await this.$NotificationService.Insert(entity);
  },
  async update(state, entity) {
    return await this.$NotificationService.Update(entity);
  },
  async delete(state, id) {
    let result = await this.$NotificationService.Delete(id);
    if (result.success) state.commit('delete', id);
    return result;
  },
  async deleteRange(state, list) {
    let result = await this.$NotificationService.DeleteRange(list);
    state.commit('deleteRange', result.filter(x => x.success).select("data"));
    return result;
  },
}