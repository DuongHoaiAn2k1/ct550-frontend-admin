import createApiClient from "./api.service";

class StatisticService {
    constructor(baseUrl = "/api/statistic") {
        this.api = createApiClient(baseUrl);
    }

    async filterUser(data = {}) {
        return (await this.api.post("/filter-user", data)).data;
    }

    async statisticProduct(data = {}){
        return (await this.api.post("/statistic-product", data)).data;
    }

    async statisticOrder(data = {}){
        return (await this.api.post("/statistic-order", data)).data;
    }

    async monthlyRevenue(data = {}){
        return (await this.api.post("/monthly-revenue", data)).data;
    }
    async statisticUserProvince(data = {}){
        return (await this.api.post("/user-province", data)).data;
    }

    async profitByMonth(data = {}){
        return (await this.api.post("/profit-by-month", data)).data;
    }

    async totalSaleByMonth(data = {}){
        return (await this.api.post("/total-sale-by-month", data)).data;
    }
    async totalSaleByYear(data = {}){
        return (await this.api.post("/total-sale-by-year", data)).data;
    }
    async totalProfitByMonth(data = {}){
        return (await this.api.post("/total-profit-by-month", data)).data;
    }
    async totalProfitByYear(data = {}){
        return (await this.api.post("/total-profit-by-year", data)).data;
    }
}

export default new StatisticService()