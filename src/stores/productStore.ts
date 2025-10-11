import { defineStore } from 'pinia';
import type { Product } from '../models/Product';
import api from '../api/api';
import { v4 as uuidv4 } from 'uuid';


export const useProductStore = defineStore('productStore', {
    state: () => ({
        products: [] as Product[],
        isLoading: false,
        error: null as string | null
    }),

    actions: {
        async getProducts() {
            this.isLoading = true;
            try {
                const res = await api.get<Product[]>('products');
                this.products = res.data;
            } catch (err: any) {
                this.error = err.message;
            } finally {
                this.isLoading = false
            }
        },

        async getProductById(id: string) {
            this.isLoading = true;
            try {
                const res = await api.get<Product>(`products/${id}`);
                const index = this.products.findIndex((u) => u.id === id)

                if (index !== -1) {
                    this.products[index] = res.data;
                }

                return res.data;
            } catch (err: any) {
                this.error = err.message;
            } finally {
                this.isLoading = false
            }
        },

        async addProduct(product: Product) {
            try {
                product.id = uuidv4();
                let res = await api.post<Product>('products', product);

                this.products.push(res.data);
            } catch (err: any) {
                this.error = err.message;
            }
        },

        async editProduct(id: string, editProduct: Product) {
            try {
                const res = await api.put<Product>(`products/${id}`, editProduct);
                const index = this.products.findIndex((u) => u.id === id);
                if (index !== -1) this.products[index] = res.data;
            } catch (err: any) {
                this.error = err.message;
            }
        },

        async deleteProduct(id: string) {
            try {
                await api.delete<Product>(`products/${id}`);
                this.products = this.products.filter((u) => u.id !== id)
            } catch (err: any) {
                this.error = err.message;
            }
        },
    },
})