export default class AuthService {
  constructor(context) {
    this.context = context
  }
  async ChangePassword(model) {
    return (await this.context.$axios.put("/Auth/ChangePassword", model)).data
  }
}