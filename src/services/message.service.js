import createApiClient from "./api.service";

class MessageService {
    constructor(baseUrl = "/api/messages") {
        this.api = createApiClient(baseUrl);
    }

   async get(id) {
        return (await this.api.get(`/${id}`)).data; 
    }

    async getAll() {
        return (await this.api.get("/all")).data;
    }

    async create(data) {
        return (await this.api.post("/", data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }  
    
    async getAllUser() {
        return (await this.api.get("/user/all")).data;
    }
}

export default new MessageService()