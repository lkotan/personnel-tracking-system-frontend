export default {
  getAll(state) {
    return state.entities;
  },
  getAllMyAssigment(state) {
    return state.myAssigment
  },
  getStatuses(state) {
    return state.statuses;
  },
  getStatusId(state) {
    return state.statusId;
  },
  getPersonnelId(state) {
    return state.personnelId;
  },
   getKeyword(state) {
     return state.keyword;
  },
  
}
