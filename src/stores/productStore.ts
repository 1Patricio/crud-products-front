import { defineStore } from "pinia";
import type { Product } from "../models/Product";
import api from "../api/api";
import { ref } from "vue";

export const useProductStore = defineStore("productStore", () => {
  const products = ref<Product[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function getProducts() {
    isLoading.value = true;
    try {
      const res = await api.get<Product[]>("products");
      products.value = res.data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function getProductById(id: string) {
    isLoading.value = true;
    try {
      const res = await api.get<Product>(`products/${id}`);
      const index = products.value.findIndex((p) => p.id === id);

      if (index !== -1) {
        products.value[index] = res.data;
      }

      return res.data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function addProduct(product: Product) {
    try {
      const res = await api.post<Product>("products", product);
      products.value.push(res.data);
    } catch (err: any) {
      error.value = err.message;
    }
  }

  async function editProduct(id: string, updatedProduct: Product) {
    try {
      const res = await api.put<Product>(`products/${id}`, updatedProduct);
      const index = products.value.findIndex((p) => p.id === id);

      if (index !== -1) {
        products.value[index] = res.data;
      }
    } catch (err: any) {
      error.value = err.message;
    }
  }

  async function deleteProduct(id: string) {
    try {
      await api.delete(`products/${id}`);
      products.value = products.value.filter((p) => p.id !== id);
    } catch (err: any) {
      error.value = err.message;
    }
  }

  return {
    products,
    isLoading,
    error,
    getProducts,
    getProductById,
    addProduct,
    editProduct,
    deleteProduct,
  };
});
