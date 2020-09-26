import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  configUrl = "https://gatestudio.tk/store/pedido";

  constructor(private http: HttpClient) { }

  buscarPedido(pedido){
    return this.http.post(this.configUrl,{
      'pedido':pedido
    });
  }
}
