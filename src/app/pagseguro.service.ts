import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PagseguroService {
  constructor(private http: HttpClient) { }

  finalizarBoleto(items,hash,endereco,cliente){
    var url = 'https://gatestudio.tk/store/pagseguro/boleto';
    return this.http.post(url,{
      'items':items,
      'hash':hash,
      'rua':endereco.rua,
      'numero':endereco.numero,
      'bairro':endereco.bairro,
      'cidade':endereco.cidade,
      'cep':endereco.cep,
      'estado':endereco.estado,
      'complemento':endereco.complemento,
      'nome':cliente.nome,
      'email':cliente.email,
      'ddd':cliente.ddd,
      'telefone':cliente.telefone,
      'cpf':cliente.cpf,
      'nascimento':cliente.nascimento,},{
      headers:{"Content-Type": "application/json","Accept": "application/json"
    }
    },)
  }

  finalizarCartao(items,hash,endereco,cliente,cartao){
    var url = 'https://gatestudio.tk/store/pagseguro/cartao';
    return this.http.post(url,{
      'items':items,
      'hash':hash,
      'rua':endereco.rua,
      'numero':endereco.numero,
      'bairro':endereco.bairro,
      'cidade':endereco.cidade,
      'cep':endereco.cep,
      'estado':endereco.estado,
      'complemento':endereco.complemento,
      'nome':cliente.nome,
      'email':cliente.email,
      'ddd':cliente.ddd,
      'telefone':cliente.telefone,
      'cpf':cliente.cpf,
      'nascimento':cliente.nascimento,
      'token':cartao.token,
      'parcelas':cartao.parcelas,
      'valorParcelas':cartao.valorParcelas,
      'maxParcelas':cartao.maxParcelas,

    },{
      headers:{"Content-Type": "application/json","Accept": "application/json"
    }
    },)
  }

  gerarSessao(){
    return this.http.get('https://gatestudio.tk/store/pagseguro/sessao')
  }


}
