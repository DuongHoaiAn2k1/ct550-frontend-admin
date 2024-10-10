import { defineStore } from "pinia";
import productService from "@/services/product.service";    

export const useProductStore = defineStore("product", {
    state: () => ({
        listProduct: [],
        length: 0
    }),

    getters: {
        getListProduct: (state) => state.listProduct,
    },
    actions: {
        async fetchListProduct() {
            try {
                const response = await productService.getAll();
                this.listProduct = response.listProduct;
                this.length = response.length
                console.log("List product ref store: ", this.listProduct);
                console.log("Fetch List product from store: ", response);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        },
    },
});