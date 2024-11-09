import createApiClient from "./api.service.js";

class UserService {
  constructor(baseUrl = "/api/user") {
    this.api = createApiClient(baseUrl);
  }

  async getListUser() {
    return (await this.api.get("/list-user")).data;
  }

  async getListUserByRole(role) {
    return (await this.api.get(`/list-user/${role}`)).data;
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }
  async register(data) {
    return (await this.api.post("/register", data)).data;
  }
  async login(data) {
    return (await this.api.post("/login", data)).data;
  }
  async deleteUser(id) {
    return (await this.api.delete(`${id}`)).data;
  }

  //check
  async filterUser(data) {
    return (await this.api.post("/filter/users", data)).data;
  }

  async getListUserWithRole() {
    return (await this.api.get("/role/user/get-list")).data;
  }

  async getListAffiliate() {
    return (await this.api.get("/affiliate/get")).data;
  }
  async resetPassword(data) {
    return (await this.api.post("/reset/password/user", data)).data;
  }

  async getTopCustomerByMonth(data) {
    return (await this.api.post("/top-customers", data)).data;
  }

  async givingPoint(data) {
    return (await this.api.post("/giving-point", data)).data;
  }
}

export default new UserService();
