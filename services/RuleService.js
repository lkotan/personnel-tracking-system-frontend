export default class RuleService {
  constructor(context) {
    this.context = context
  }
  async GetAll(roleId) {
    return (await this.context.$axios.get(`/Rules?roleId=${roleId}`)).data;
  }
  async SaveRange(models) {
    return (await this.context.$axios.post('/Rules/SaveRange', models)).data;
  }
}