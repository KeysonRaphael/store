import { Component, OnInit, Input, NgZone } from '@angular/core';
import { FreteService } from '../frete.service';
import { PagseguroService } from '../pagseguro.service';
import { ViacepService } from '../viacep.service';

declare var PagSeguroDirectPayment: any;

@Component({
  selector: 'app-sacola',
  templateUrl: './sacola.component.html',
  styleUrls: ['./sacola.component.css']
})
export class SacolaComponent implements OnInit {

  @Input() fretes;
  @Input() valorTotal;
  @Input() sacola;
  sessao;
  finalizado = 0;
  cartao = 0;
  cep = "";
  butaob = 'bg-light text-black';
  butaoc = 'bg-light text-black';
  frete: any;
  loading = false;

  email = "";
  nome = "";
  cpf = "";
  celular = "";
  
  numero = "";
  bairro = "";
  cidade = "";
  estado = "";

  observacao;

  hash;
  hashCode = "";
  rua = "";
  complemento = "";
  ddd = "";
  telefone = "";
  nascimento = "";
  tokenCard = "";
  parcelas;
  valorParcelas = "";
  maxParcelas = "";
  numeroCartao = "";
  bandeira = "";
  cvv = "";
  mes = "";
  ano = "";
  parcela = "";
  parabens = false;


  constructor(public freteSe : FreteService, public cepSe : ViacepService,public zone:NgZone, public pagse:PagseguroService) {
    this.carregaJavascriptPagseguro()
   }

  ngOnInit(): void {
    // alert(window["PagSeguroDirectPayment"])
    this.gerarSessao()
  }

  carregaJavascriptPagseguro() {
    new Promise((resolve) => {
      let script: HTMLScriptElement = document.createElement('script');
      script.addEventListener('load', r => resolve());
      script.src = 'https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js';
      document.head.appendChild(script);
    });
  }

  gerarToken(){
    this.loading = true;
    if (this.numeroCartao == '' && this.numeroCartao.length < 16) {
      return;
    }else if (this.bandeira == '') {
      return;
    }else if(this.cvv == '' && this.cvv.length < 3){
      return;
    }else if(this.mes == '' && this.mes.length < 2){
      return;
    }else if(this.ano == '' && this.ano.length < 4){
      return;
    }
    PagSeguroDirectPayment.createCardToken({
      cardNumber: this.numeroCartao, // Número do cartão de crédito
      brand: this.bandeira, // Bandeira do cartão
      cvv: this.cvv, // CVV do cartão
      expirationMonth: this.mes, // Mês da expiração do cartão
      expirationYear: this.ano, // Ano da expiração do cartão, é necessário os 4 dígitos.
      success: (response) => {
           this.tokenCard = response.card.token
           this.finalizarCartao()
      },
      error: function(response) {
               // Callback para chamadas que falharam.
      },
      complete: function(response) {
           // Callback para todas chamadas.
      }
   });
  }

  gerarParcelas(bandeira){
    PagSeguroDirectPayment.getInstallments({
      amount: this.valorTotal,
      maxInstallmentNoInterest: 2,
      brand: bandeira,
      success: (response)=>{
        this.parcelas = response.installments[bandeira]
     },
      error: function(response) {
          // callback para chamadas que falharam.
     },
      complete: function(response){
          // Callback para todas chamadas.
     }
    });
  }

  gerarBandeira(){
    if (this.numeroCartao.length <= 5){
      return
    }else{
      if (this.bandeira == '') {
         var numero = this.numeroCartao.substring(0, 6)
         PagSeguroDirectPayment.getBrand({
          cardBin: numero,
          success: (response)=>{
            this.bandeira = response.brand.name
            this.gerarParcelas(this.bandeira)
          },
          error: function(response) {
            //tratamento do erro
          },
          complete: function(response) {
            //tratamento comum para todas chamadas
          }
        });
      }
    }
  }

  gerarSessao() {
    this.pagse.gerarSessao().subscribe((data) => {
      this.sessao = data;
      this.setSession()
    }
    )
  }

  setSession() {
    PagSeguroDirectPayment.setSessionId(this.sessao)
    // let sender_hash = this.onSenderHashReady()
    var loop = setInterval(()=>{
      if (PagSeguroDirectPayment.getSenderHash()){
        this.hashCode = PagSeguroDirectPayment.getSenderHash();
        clearInterval(loop)
      }
    },2000)
  }

  onSenderHashReady() {
    this.hashCode = PagSeguroDirectPayment.getSenderHash();
    return this.hashCode;
  }

  abrirCartao(){
    this.butaob = 'bg-light text-black';
    this.butaoc = 'bg-dark text-white';
    this.cartao = 1;
  }

  fecharCartao(){
    this.butaoc = 'bg-light text-black';
    this.butaob = 'bg-dark text-white';
    this.cartao = 0;
  }

  gerarEndereco(){
    this.cepSe.getEndereco(this.cep).subscribe((data)=>{
      this.rua = data['logradouro'];
      this.complemento = data['complemento'];
      this.bairro = data['bairro'];
      this.estado = data['uf'];
      this.cidade = data['localidade'];
    })
  }

  calcularFrete(){
    if (this.cep.length < 8){
      return
    }
    this.gerarEndereco()
    this.freteSe.calcularFrete(this.cep,this.sacola).then((data)=>{
      this.fretes = data
      this.frete = null;
      this.fretes.forEach(element => {
        if (!element.error) {
          if (this.frete) {
            if (this.frete.price > element.price) {
              this.frete = element
            }
          }else{
            this.frete = element;
          }
        }
      });
    })
  }

  remover(produto){
    this.sacola.forEach(element => {
      if (element.id == produto) {
        this.sacola.splice(this.sacola.indexOf(element),1)
      }
    });
    this.somarValorTotal()
    if (this.cep.length == 8) {
      this.calcularFrete()
    }
  }

  aumentarQuantidade(produto){
    this.sacola.forEach(element => {
      if (element.id == produto) {
        element.quantidade += 1
      }
    });
    this.zone.run(()=>{
      this.somarValorTotal()
    })
    if (this.cep.length == 8) {
      this.calcularFrete()
    }
  }

  diminuirQuantidade(produto){
    this.sacola.forEach(element => {
      if (element.id == produto) {
        if (element.quantidade>1){
          element.quantidade -= 1
        }
      }
    });
    this.somarValorTotal()
    if (this.cep.length == 8) {
      this.calcularFrete()
    }
  }

  abrirFinalizado(){
    this.finalizado = 1;
  }

  finalizar(){
    if (this.cartao == 0) {
      this.loading = true;
      this.pagse.finalizarBoleto(this.sacola,this.hashCode,
        new Endereco(this.rua,
                      this.numero,
                      this.bairro,
                      this.cidade,
                      this.estado,
                      this.cep,
                      this.complemento),
        new Cliente(this.nome,
                    this.email,
                    this.cpf,
                    this.ddd,
                    this.telefone,
                    this.nascimento
        )).subscribe((data)=>{
          this.loading = false;
          if(data == '1'){
            this.zone.run(()=>{
              this.parabens=true
            })
          }
        }
      );  
    }else{
      this.gerarToken();
    }
  }

  finalizarCartao(){
    var valor;
    var nascimento = this.nascimento.slice(0,2)+'/'+this.nascimento.slice(2,4)+'/'+this.nascimento.slice(4,8)
    this.parcelas.forEach(element => {
      if (element.quantity == this.parcela) {
        valor = element.installmentAmount
      }
    });
    this.pagse.finalizarCartao(this.sacola,this.hashCode,
      new Endereco(this.rua,
                    this.numero,
                    this.bairro,
                    this.cidade,
                    this.estado,
                    this.cep,
                    this.complemento),
        new Cliente(this.nome,
                    this.email,
                    this.cpf,
                    this.ddd,
                    this.telefone,
                    nascimento),
        new Cartao(this.tokenCard,
                  this.parcela,
                  valor,
                  2)).subscribe((data)=>{
                    this.loading = false;
                    if(data == '1'){
                      this.zone.run(()=>{
                        this.parabens=true
                      })
                    }
                  }
    );
  }

  somarValorTotal(){
    var valor = 0
    this.sacola.forEach(element => {
      valor += (element.quantidade * element.valor);
    });
    this.zone.run(()=>{
      this.valorTotal = valor
    })
  }

}

class Endereco {
  rua;
  numero;
  bairro;
  cidade;
  cep;
  complemento;
  estado;

  constructor(rua,numero,bairro,cidade,estado,cep,complemento) {
    this.rua = rua;
    this.numero = numero;
    this.bairro = bairro;
    this.cidade = cidade;
    this.estado = estado;
    this.cep = cep;
    this.complemento = complemento;
  }
}

class Cliente {
  nome;
  email;
  cpf;
  ddd;
  telefone;
  nascimento;

  constructor(nome,email,cpf,ddd,telefone,nascimento) {
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
    this.ddd = ddd;
    this.telefone = telefone;
    this.nascimento = nascimento;
  }
}

class Cartao {
  token;
  parcelas;
  valorParcelas;
  maxParcelas;

  constructor(token,parcelas,valorParcelas,maxParcelas) {
    this.token = token;
    this.parcelas = parcelas;
    this.valorParcelas = valorParcelas;
    this.maxParcelas = maxParcelas;
  }
}