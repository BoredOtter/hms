import axios from 'axios';

const httpClient = axios.create({
  baseURL: '', 
  timeout: 4000, 
  headers: {
    'Accept': 'application/json',
    // 'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
  }
});

export default httpClient;