import createApiClient from "./api.service";

class RoleService {
    constructor(baseUrl = "/api/assign-role") {
        this.api = createApiClient(baseUrl);
    }

    async getRoles() {
        return (await this.api.get("/roles")).data;
    }    

    async getPermissions() {
        return (await this.api.get("/permissions")).data;
    }

    async createRole(data) {
        return (await this.api.post("/roles", data)).data;
    }

    async updateRole(id, data) {
        return (await this.api.put(`/roles/${id}`, data)).data;
    }

    async deleteRole(id) {
        return (await this.api.delete(`/roles/${id}`)).data;
    }

    async createPermission(data) {
        return (await this.api.post("/permissions", data)).data;
    }

    async updatePermission(id, data) {
        return (await this.api.put(`/permissions/${id}`, data)).data;
    }

    async deletePermission(id) {
        return (await this.api.delete(`/permissions/${id}`)).data;
    }


}

export default new RoleService()