import RepositoryService from "../Repositories/RepositoryService";
export default class PersonnelService extends RepositoryService {
  constructor(context) {
    super("Personnels");
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
  async GetAll() {
    return (await this.context.$axios.get(`/Personnels`)).data;
  }
  async SelectList() {
    return (await this.context.$axios.get(`/Personnels/SelectList`)).data;
  }
  async IsBlockedChange(id) {
    return (await this.context.$axios.patch(`/Personnels/IsBlockedChange?id=${id}`)).data;
  }
  async ForgotPassword(email) {
    return (await this.context.$axios.post(`/Personnels/ForgotPassword?email=${email}`)).data;
  }
  async PersonnelTypes() {
    return (await this.context.$axios.get("/Personnels/PersonnelTypes")).data;
  }
  async Search(keyword) {
    return (await this.context.$axios.get(`/Personnels/Search?keyword=${keyword}`)).data;
  }
  async Profile() {
    return (await this.context.$axios.get(`/Personnels/Profile`)).data;
  }
}
