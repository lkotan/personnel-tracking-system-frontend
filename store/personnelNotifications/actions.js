export default {
  async getAll(state, notificationId) {
    const res = await this.$PersonnelNotificationService.GetAll(notificationId)
    state.commit('addEntities', res);
    return res;
  },
  async getAllByAccountId(state, personnelId) {
    const res = await this.$PersonnelNotificationService.GetAllByPersonnelId(personnelId);
    state.commit('addAllByPersonnelId', res);
    return res;
  },
  async insert(state, entity) {
    return await this.$PersonnelNotificationService.Insert(entity);
  },
  async update(state, entity) {
    return await this.$PersonnelNotificationService.Update(entity);
  },
  async delete(state, id) {
    const result = await this.$PersonnelNotificationService.Delete(id);
    if (result.success) state.commit('delete', id);
    return result;
  },
  async deleteRange(state, list) {
    let result = await this.$PersonnelNotificationService.DeleteRange(list);
    state.commit('deleteRange', result.filter(x => x.success).select("data"));
    return result;
  },
  async getMyAllNotification(state) {
    const res = await this.$PersonnelNotificationService.GetMyAllNotification();
    state.commit('addMyAllNotification', res);
    return res;
  },
  async readMyNotification(state, notifyId) {
    return await this.$PersonnelNotificationService.IsRead(notifyId);
  },


  getAllNotify(state) {

    let connection = this.$HubService.connection();
    connection.start().then(() => {
      let gName = "personel";
      connection.invoke("AddToGroupAll", gName)
      connection.invoke("SendNotifyToAll", gName)
    }).catch(err => console.log(err));

    connection.on("ReceiveNotifyToAll", res => {
      console.log(res);
      state.commit('addMyActiveNotification', res);
    })
  },
}
