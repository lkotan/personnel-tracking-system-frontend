export default {
  async getAll(state, myAssigment = false) {
    const res = await this.$AssigmentService.GetAll(state.getters.getPersonnelId, state.getters.getStatusId, state.getters.getKeyword);
    state.commit("addEntities", res);
    return res;
  },
   async getAllMyAssigment(state) {
     const res = await this.$AssigmentService.GetAllMyAssigment();
     state.commit("addAllMyAssigment", res);
     return res;
   },
  async insert(state, entity) {
    return await this.$AssigmentService.Insert(entity);
  },
  async update(state, entity) {
    return await this.$AssigmentService.Update(entity);
  },
  async delete(state, id) {
    let result = await this.$AssigmentService.Delete(id);
    if (result.success) state.commit('delete', id);
    return result;
  },
  async deleteRange(state, list) {
    let result = await this.$AssigmentService.DeleteRange(list);
    state.commit('deleteRange', result.filter(x => x.success).select("data"));
    return result;
  },

  async getStatuses(state) {
    const data = state.getters.getStatuses;
    if (data.length > 0) return data;
    const res = await this.$AssigmentService.Statuses();
    state.commit('addStatuses', res);
    return res;
  },
  async changeMyStatus(state, params) {
    const response = (await this.$AssigmentService.ChangeMyStatus(params.assigmentId, params.status)).data;
    params.success = response.success;
    state.commit('addChangeMyStatus', params);
    return response;
  },

  async changePriority(state, {
    assigmentId,
    priority
  }) {
    const res = await this.$AssigmentService.ChangePriority(assigmentId, priority);
    if (res.success) state.commit('addChangePriority', {
      assigmentId,
      priority
    });
    return res;
  },
    async changeMyPriority(state, {
      assigmentId,
      priority
    }) {
      const res = await this.$AssigmentService.ChangePriority(assigmentId, priority);
      if (res.success) state.commit('addChangeMyPriority', {
        assigmentId,
        priority
      });
      return res;
    },
}
