// stores/storeInitializer.js
import { useCategoryStore } from './category';

export function initializeStores() {
  const categoryStore = useCategoryStore();

  

  categoryStore.fetchListCategory();

}
