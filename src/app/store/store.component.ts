import { Component, OnInit, NgZone } from '@angular/core';
import {ProdutosService} from '../produtos.service';
import {PagseguroService} from '../pagseguro.service';
import {FreteService} from '../frete.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  produtos;
  loading = false;
  categorias;
  mobile = false;
  produto = '';
  descricao = '';
  descricaoc = '';
  closeResult: string;
  imagem = '';
  valor='';
  largura;
  altura;
  comprimento;
  peso;
  valorTotal = 0;
  quantidade:string;
  sacola = [];
  sacolaO = 0;
  cep = "";
  fretes;
  zoom = "";
  pedido = 0;

  constructor(private freteSe:FreteService,private produtoSe:ProdutosService, private zone:NgZone, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.zone.run(()=>{
      if (window.screen.width <= 720) { // 768px portrait
        this.mobile = true;
      }
      this.loading = true;
      this.produtoSe.buscarCategorias().subscribe((data)=>{
        this.categorias = data;
      })
      this.produtoSe.buscarProdutos().subscribe((data)=>{
        this.produtos = data["produtos"];
      })
      this.loading = false;
    })
  }

  zoomi(){
    if (this.zoom == "" || this.zoom == "diszoom") {
      this.zoom = "zoom"
    }else{
      this.zoom = "diszoom"
    }
  }

  buscarProdutosCategoria(categoria){
    this.zone.run(()=>{
      this.sacolaO = 0;
      this.pedido = 0;
      this.loading = true;
      this.produtoSe.buscarProdutosPorCategoria(categoria).subscribe((data)=>{
        this.produtos = data["produtos"];
        this.loading = false;
      })
    })
  }

  buscarProdutosNome(nome){
    this.zone.run(()=>{
      this.sacolaO = 0;
      this.pedido = 0;
      this.loading = true;
      this.produtoSe.buscarProdutosPorNome(nome).subscribe((data)=>{
        this.produtos = data["produtos"];
        this.loading = false;
      })
    })
  }

  dismissmodal(){
    this.modalService.dismissAll();
  }

  
  open(content,id,descricao,descricaoc,valor,imagem, largura, altura, comprimento, peso) {
    this.descricao = descricao
    this.descricaoc = descricaoc
    this.imagem = imagem    
    this.produto = id
    this.valor = valor
    this.largura = largura
    this.altura = altura
    this.comprimento = comprimento
    this.peso = peso
    this.modalService.open(content, {size: 'lg',ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  buscarProdutos(){
    this.zone.run(()=>{
      this.sacolaO = 0;
      this.pedido = 0;
      this.loading = true;
      this.produtoSe.buscarProdutos().subscribe((data)=>{
        this.produtos = data["produtos"];
        this.loading = false;
      })
    })
  }

  

  abrirSacola(){
    this.dismissmodal()
    this.sacolaO = 1;
    this.pedido = 0;
  }

  abrirPedido(){
    this.sacolaO = 0;
    this.pedido = 1;
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

  adicionarSacola(content, produto, descricao,valor, imagem, largura, altura, comprimento, peso){
    var adicionar = 1;
    this.sacola.forEach(element => {
      if (element.id == produto) {
        element.quantidade += 1;
        adicionar = 0;
      }
    });
    if (adicionar == 1){
      var produtol = new Produto(produto,descricao,imagem,valor,1, largura, altura, comprimento, peso)
      this.sacola.push(produtol)
    }
    this.modalService.dismissAll()
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.zone.run(()=>{
      this.somarValorTotal()
    })
  }

}
class Produto {
  id = ''
  descricao = ''
  imagem = ''
  valor = ''
  valor_total = 0
  quantidade = ''
  largura: any;
  altura: any;
  comprimento: any;
  peso: any;
  constructor(id,descricao,imagem,valor,quantidade, largura, altura, comprimento, peso) {
    this.id = id
    this.descricao = descricao
    this.imagem = imagem
    this.valor = valor
    this.quantidade = quantidade
    this.valor_total = valor*quantidade  
    this.largura = largura  
    this.altura = altura
    this.comprimento = comprimento  
    this.peso = peso  
  }
}