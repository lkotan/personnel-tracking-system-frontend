import RepositoryService from "../Repositories/RepositoryService";
export default class EmailTemplateService extends RepositoryService {
  constructor(context) {
    super("EmailTemplates");
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
  async GetAll() {
    return (await this.context.$axios.get(`/EmailTemplates`)).data;
  }
  async SelectList() {
    return (await this.context.$axios.get(`/EmailTemplates/SelectList`)).data;
  }
  async EmailTemplateTypes() {
    return (await this.context.$axios.get(`/EmailTemplates/EmailTemplateTypes`)).data;
  }
}
