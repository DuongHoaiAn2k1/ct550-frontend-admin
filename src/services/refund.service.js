import createApiClient from "./api.service";

class RefundService {
    constructor(baseUrl = "/api/refund") {
        this.api = createApiClient(baseUrl);
    }

    create(data) {
        return this.api.post("/", data);
    }

    async getAll() {
        return (await this.api.get("/")).data;
    }
    
    async getToday() {
        return (await this.api.get("/today")).data;
    }

    async update(data, id) {
        return (await this.api.patch(`/${id}`, data)).data;
    }

    async getBetweenDate(data) {
        return (await this.api.post("/bydate/all", data)).data;
    }
    
}

export default new RefundService();