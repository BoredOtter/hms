import axios from 'axios';

const httpClient = axios.create({
  // Podaj tutaj dodatkowe konfiguracje, np. bazowy URL, nagłówki, timeout itp.
  baseURL: 'https://example.com/api', // Przykładowy bazowy URL
  timeout: 5000, // Przykładowy timeout (czas oczekiwania na odpowiedź w milisekundach)
  headers: {
    'Content-Type': 'application/json', // Przykładowy nagłówek Content-Type
    // Tutaj możesz dodać inne nagłówki, jeśli są potrzebne
  }
});

export default httpClient;