export default {
  addEntities(state, entities) {
    state.entities = entities;
  },
  addAllMyAssigment(state, entities) {
    state.myAssigment=entities
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
  addStatuses(state, entities) {
    state.statuses = entities;
  },
  addStatusId(state, statusId) {
    state.statusId = statusId;
  },
  addPersonnelId(state, personnelId) {
    state.personnelId = personnelId;
  },
  addKeyword(state, keyword) {
    state.keyword = keyword;
  },

    addChangeMyStatus(state, params) {
      let success = false;
      let models = state.myAssigment;
      let entity = models.filter(x => x.id == parseInt(params.assigmentId))[0];

      if (entity == undefined) {
        success = true;
      }

      const nextStatus = state.statuses.filter(x => x.id == params.status)[0];
      const currentStatus = state.statuses.filter(x => x.id == entity.status)[0];

      if (params.success) {
        entity.status = nextStatus.description;
      } else entity.status = currentStatus.description;

      const index = models.findIndex(x => x.id == entity.id);
      models[index] = entity;
      if (success) state.myAssigment = models;
    },

  addChangePriority(state, {
    assigmentId,
    priority
  }) {
    let models = state.entities;
    let entity = models.filter(x => x.id == assigmentId)[0];
    entity.priority = priority;
    state.entities = models;
  },
   addChangeMyPriority(state, {
     assigmentId,
     priority
   }) {
     let models = state.myAssigment;
     let entity = models.filter(x => x.id == assigmentId)[0];
     entity.priority = priority;
     state.myAssigment = models;
   }
}
