import { defineStore } from 'pinia';
import productService from '@/services/product.service';

export const useProductBatchStore = defineStore('productBatch', {
  state: () => ({
    listProductBatch: [],
    length: 0,
    totalBatches: 0
  }),

  actions: {
    async fetchListProductBatch() {
      try {
        const response = await productService.fetchListProductBatch();
        this.listProductBatch = response.data;
        this.length = response.data.length;
        this.totalBatches = response.total_batches_quantity;
        console.log("Fetch List product batch from store: ", response);
        console.log("List product batch ref store: ", this.listProductBatch);
        console.log("Total product batch ref store: ", this.totalBatches);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    }
  }

});

