import createApiClient from "./api.service";

class BatchService {
    constructor(baseUrl = "/api/batches") {
        this.api = createApiClient(baseUrl);
    }

    async  getAll() {
        return (await this.api.get("/")).data
    }

    async getHiddenList() {
        return (await this.api.get("/hidden")).data
    }

    async getExpringSoonList() {
        return (await this.api.get("/expiring-soon")).data
    }

    async getExpiredList() {
        return (await this.api.get("/expired")).data
    }

    async get(id) {
        return (await this.api.get(`/${id}`)).data
    }

    async create(data) {
        return (await this.api.post("/", data)).data
    }

    async update(id, data) {
        return (await this.api.patch(`/${id}`, data)).data
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data
    }

    async updateStatus(id, data) {
        return (await this.api.patch(`/status/${id}/`, data)).data;
    }

}

export default new BatchService()