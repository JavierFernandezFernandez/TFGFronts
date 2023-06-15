import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTerm:string = ''
  constructor() { }
  setSearchTerm(actualTerm: string){
    this.searchTerm = actualTerm
  }
  getSearchTerm(): string{
    return this.searchTerm
  }
}
