import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../pedido.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {

  pedido;
  busca = false;
  dados;

  constructor(public pedidose:PedidoService) { }

  ngOnInit(): void {
  }

  buscarPedido(){
    this.pedidose.buscarPedido(this.pedido).subscribe((data)=>{
      if (data != '0'){
        this.busca = true
        this.dados = data          
      }
    })
  }

}
