import createApiClient from "./api.service";

class ProductPromotionService {
    constructor(baseUrl = "/api/product-promotions") {
        this.api = createApiClient(baseUrl);
    }

    async create(data) {
        return (await this.api.post("/", data)).data;
    }

    async getByPromotionId(id) {
        return (await this.api.get(`/promotion/${id}`)).data;
    }   

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async delete(id) {
        return (await this.api.delete(`${id}`)).data;
    }

    async updateUserGroup(data, id) {
        return (await this.api.patch(`/promotion/update/${id}`, data)).data;
    }
}

export default new ProductPromotionService();