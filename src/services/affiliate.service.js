import createApiClient from "./api.service"

class AffiliateService {
    constructor(baseUrl = "/api/affiliate") {
        this.api = createApiClient(baseUrl);
    }

    async create(){
        return (await this.api.post("request/create")).data;
    }     

    async getAll(){
        return (await this.api.get("request/list")).data;
    }

    async approved(affiliate_request_id){
        return (await this.api.patch(`request/approved/${affiliate_request_id}`)).data;
    }

    async rejected(affiliate_request_id, data){
        return (await this.api.patch(`request/rejected/${affiliate_request_id}`, data)).data;
    }

    async getListCommission(){
        return (await this.api.get("commission/list")).data;
    }

    async createCommission(data){
        return (await this.api.post("commission/create", data)).data;
    }

    async updateCommission(data, commission_id){
        return (await this.api.patch(`commission/update/${commission_id}`, data)).data;
    }

    async deleteCommission(id){
        return (await this.api.delete(`commission/delete/${id}`)).data;
    }

    async getWithdraw(){
        return (await this.api.get("withdrawal/get-all")).data
    }

    async done(id){ 
        return (await this.api.patch(`withdrawal/update/${id}`)).data
    }
}

export default new AffiliateService()