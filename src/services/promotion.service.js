import createApiClient from "./api.service";

 class PromotionService {
    constructor(baseUrl = "/api/promotion") {
        this.api = createApiClient(baseUrl);
    }

    async getPromotions() {
        return (await this.api.get("/")).data;
    }

    async create(data){
        return (await this.api.post("/", data)).data
    }

    async update(data, id){
        return (await this.api.patch(`/${id}`, data)).data
    }

    async delete(id){
        return (await this.api.delete(`/${id}`)).data
    }

    async getByDate(data) {
        return (await this.api.post("/bydate/all", data)).data;
    }

    async sotfDelete(id){
        return (await this.api.post(`/soft/delete/${id}`)).data
    }

    async getDetail(id){
        return (await this.api.get(`/detail/${id}`)).data;
    }
}

export default new PromotionService()