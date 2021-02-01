import RepositoryService from "../Repositories/RepositoryService";

export default class AssigmentService extends RepositoryService {
  constructor(context) {
    super("Assigments");
    this.context = context;
  }
  async Get(id) {
    return await super.Get(id);
  }
  async Insert(model) {
    return await super.Insert(model);
  }
  async Update(model) {
    return await super.Update(model);
  }
  async Delete(id) {
    return await super.Delete(id);
  }
  async DeleteRange(list) {
    return await super.DeleteRange(list);
  }
  async GetAllMyAssigment() {
      return (await this.context.$axios.get(`/Assigments/GetAllMyAssigment`)).data;
  }
  async GetAll(personnelId, statusId, keyword) {
    let query = "";
    if (keyword != "") {
      if (personnelId != null) {
        if (statusId != null) query = `?personnelId=${personnelId}&statusId=${statusId}&keyword=${keyword}`
        else query = `?personnelId=${personnelId}&keyword=${keyword}`
      }
      else {
        if (statusId != null) query = `?statusId=${statusId}&keyword=${keyword}`
        else query = `?keyword=${keyword}`
      }
    }
    else {
      if (personnelId != null) {
        if (statusId != null) query = `?personnelId=${personnelId}&statusId=${statusId}`
        else query = `?personnelId=${personnelId}`
      }
       else if (statusId != null) query = `?statusId=${statusId}`
    }
    return (await this.context.$axios.get(`/Assigments${query}`)).data;
  }
  async ChangePriority(assigmentId, priority) {
    return (await this.context.$axios.patch(`/Assigments/ChangePriority?assigmentId=${assigmentId}&priority=${priority}`)).data;
  }
  async PriorityDegree() {
    return (await this.context.$axios.get(`/Assigments/PriorityDegree`)).data;
  }
  async Statuses() {
    return (await this.context.$axios.get(`/Assigments/Statuses`)).data;
  }
 async ChangeMyStatus(assigmentId, status) {
   return (await this.context.$axios.patch(`/Assigments/ChangeMyStatus?assigmentId=${assigmentId}&status=${status}`));
 }
}
