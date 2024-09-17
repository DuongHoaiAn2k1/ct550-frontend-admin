import createApiClient from "./api.service";

class AdminService {
  constructor(baseUrl = "/api/admin") {
    this.api = createApiClient(baseUrl);
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async createStaff(data) {
    return (await this.api.post("/create-staff", data)).data;
  }

  async getListStaff() {
    return (await this.api.get("/staff")).data;
  }

  async deleteStaff(id) {
    return (await this.api.delete(`/staff/${id}`)).data;
  }
}

export default new AdminService();
