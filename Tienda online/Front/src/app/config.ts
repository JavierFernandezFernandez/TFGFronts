import { HttpHeaders } from "@angular/common/http";

export const API_URL = 'http://localhost:8080';
export const BRANDS: string[] = ['Intel', 'AMD', 'Nvidia', 'Windows'];

export function GET_HEADERS(): HttpHeaders {
  let headers:HttpHeaders = new HttpHeaders();
  const token = localStorage.getItem('token');
  if (token) {
    return headers.set('Authorization', `Bearer ${token}`);
  }
  return headers
}
