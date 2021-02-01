import RepositoryService from "../Repositories/RepositoryService";
export default class PersonnelNotificationService extends RepositoryService {
  constructor(context) {
    super("PersonnelNotifications");
    this.context = context
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
  async GetAll(notificationId) {
    return (await this.context.$axios.get(`/PersonnelNotifications?notificationId=${notificationId}`)).data;
  }
  async IsRead(id) {
    return (await this.context.$axios.patch(`/PersonnelNotifications/IsRead?id=${id}`)).data;
  }
  async GetAllByPersonnelId(personnelId) {
    return (await this.context.$axios.get(`/PersonnelNotifications/GetAllByPersonnelId?personnelId=${personnelId}`)).data;
  }
  async GetMyAllNotification() {
    return (await this.context.$axios.get(`/PersonnelNotifications/GetAllMyNotification`)).data;
  }
}
