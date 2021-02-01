export default {
  async getAll(state) {
    const res = await this.$DepartmentService.GetAll()
    state.commit('addEntities', res);
    return res;
  },
  async getSelectList(state) {
    const res = await this.$DepartmentService.SelectList();
    state.commit('addSelectList', res);
    return res;
  },
  async insert(state, entity) {
    return await this.$DepartmentService.Insert(entity);
  },
  async update(state, entity) {
    return await this.$DepartmentService.Update(entity);
  },
  async delete(state, id) {
    let result = await this.$DepartmentService.Delete(id);
    if (result.success) state.commit('delete', id);
    return result;
  },
  async deleteRange(state, list) {
    let result = await this.$DepartmentService.DeleteRange(list);
    state.commit('deleteRange', result.filter(x => x.success).select("data"));
    return result;
  },
}