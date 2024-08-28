import createApiClient from "./api.service";

class NotificationService {
    constructor(baseUrl = "/api/notification") {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (await this.api.get("/")).data
    }

    async adminReadAll(){
        return (await this.api.post("/admin/read/all")).data;
    }
}

export default new NotificationService()