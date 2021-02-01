import RepositoryService from "../Repositories/RepositoryService";
export default class AssigmentTagService extends RepositoryService {
  constructor(context) {
    super("AssigmentTags");
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
    return (await this.context.$axios.get(`/AssigmentTags`)).data;
  }
  async SelectList() {
    return (await this.context.$axios.get(`/AssigmentTags/SelectList`)).data;
  }
}