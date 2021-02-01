export default class RepositoryService {
  constructor(base) {
    this.base = base;
  }
  async Get(id) {
    const result = await this.context.$axios.get(`/${this.base}/${id}`);
    return result.data;
  }
  async Update(model) {
    const result = await this.context.$axios.put(`/${this.base}`, model);
    return result.data;
  }
  async Insert(model) {
    const result = await this.context.$axios.post(`/${this.base}`, model);
    return result.data;
  }
  async Delete(id) {
    const result = await this.context.$axios.delete(`/${this.base}/${id}`);
    return result.data;
  }
  async DeleteRange(list) {
    const result = await this.context.$axios.post(`/${this.base}/DeleteRange`, list);
    return result.data;
  }
}