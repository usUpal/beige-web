/* eslint-disable import/no-anonymous-default-export */
import { API_ENDPOINT } from '@/config';
import axiosLib from 'axios';

const axios = axiosLib.create({
  baseURL: API_ENDPOINT,
});

const reqConfig = (obj: any) => ({
  headers: {
    Authorization: `Bearer ${obj.idToken}`,
  },
});

export default {
  async handleOrderMake(orderData: ShootTypes) {
    try {
      const response = axios.post(
        `/orders`,
        orderData
        // reqConfig(this)
      );
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  },
};
