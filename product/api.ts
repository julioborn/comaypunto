import axios from "axios";
import { Product } from "./types";
import Papa from "papaparse"

export default {
    list: async (): Promise<Product[]> => {
        return axios
            .get(
                `https://docs.google.com/spreadsheets/d/e/2PACX-1vSA7Hy5mWb4n9RuCu86Shn66NSKv50FDucLQZBctJ7rsWPUMqT-suPLXj2cx8Q04ZnqJmmA_-_CXpr0/pub?output=csv`,
                {
                    responseType: "blob",
                },
            )
            .then(
                (response) =>
                    new Promise<Product[]>((resolve, reject) => {
                        Papa.parse(response.data, {
                            header: true,
                            complete: (results) => {
                                const products = results.data as Product[]
                                return resolve(
                                    products.map((product) => ({
                                        ...product,
                                        precio: Number(product.precio),
                                    })),
                                )
                            },
                            error: (error) => reject(error.message)
                        })
                    })
            )
    }
}