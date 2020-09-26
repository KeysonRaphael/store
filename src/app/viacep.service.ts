import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViacepService {
  configUrl = 'https://viacep.com.br/ws/'

  constructor(private http: HttpClient) { }

  getEndereco(cep){
    return this.http.get(this.configUrl + cep +'/json/')
  }
}
