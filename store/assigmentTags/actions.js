export default {
  async getAll(state) {
    const res = await this.$AssigmentTagService.GetAll()
    state.commit('addEntities', res);
    return res;
  },
  async getSelectList(state) {
    const res = await this.$AssigmentTagService.SelectList();
    state.commit('addSelectList', res);
    return res;
  },
  async insert(state, entity) {
    return await this.$AssigmentTagService.Insert(entity);
  },
  async update(state, entity) {
    return await this.$AssigmentTagService.Update(entity);
  },
  async delete(state, id) {
    let result = await this.$AssigmentTagService.Delete(id);
    if (result.success) state.commit('delete', id);
    return result;
  },
  async deleteRange(state, list) {
    let result = await this.$AssigmentTagService.DeleteRange(list);
    state.commit('deleteRange', result.filter(x => x.success).select("data"));
    return result;
  },
}