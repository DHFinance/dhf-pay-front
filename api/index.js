import axios from 'axios';

export const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
let instance = null;

class Api {
  constructor() {
    this.client = axios.create({
      baseURL: API_HOST ? API_HOST + '/api' : 'http://localhost:3001/api',
    });

    return this;
  }

  post = async (url, data, params) => {
    return this.client.post(url, data, params);
  };

  get = async (url, params = {}) => {
    return this.client.get(url, params);
  };

  put = async (url, data, params) => {
    return this.client.put(url, data, params);
  };

  patch = async (url, data, params) => {
    return this.client.patch(url, data, params);
  };

  remove = async (url, params = {}) => {
    return this.client.delete(url, params);
  };

  getInstance = () => {
    return instance;
  };
}

const api = new Api();

export const { post, get, put, patch, remove } = api;

export default api;
