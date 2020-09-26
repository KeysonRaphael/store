import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  configUrl = "https://gatestudio.tk/store/produtos";

  constructor(private http: HttpClient) { }

  buscarProdutos(){
    return this.http.get(this.configUrl);
  }

  buscarProdutosPorCategoria(valor){
    return this.http.get(this.configUrl,{params:{
      categoria:valor
    }});
  }

  buscarProdutosPorNome(valor){
    return this.http.get(this.configUrl,{params:{
      busca:valor
    }});
  }

  buscarCategorias(){
    return this.http.get(this.configUrl+'/categorias');
  }
}
