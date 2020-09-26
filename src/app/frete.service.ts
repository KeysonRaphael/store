import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import MelhorEnvio from 'menv-js';

@Injectable({
  providedIn: 'root'
})
export class FreteService {

  constructor(private http: HttpClient) { }

  calcularFrete(cep,produtosf){
    const menv = new MelhorEnvio('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAyYmE4YmEwNWM3NWI5MzcwZDk5ZjkxN2ExZGZlN2U3ZjFmMmE2ZjFlYmY0ODQ1NTE3YzM5YzlkMTJlNjdkMDI3ZjIwZmM3ZTQzOTQ3NDU4In0.eyJhdWQiOiIxIiwianRpIjoiMDJiYThiYTA1Yzc1YjkzNzBkOTlmOTE3YTFkZmU3ZTdmMWYyYTZmMWViZjQ4NDU1MTdjMzljOWQxMmU2N2QwMjdmMjBmYzdlNDM5NDc0NTgiLCJpYXQiOjE1OTg4MDc4ODksIm5iZiI6MTU5ODgwNzg4OSwiZXhwIjoxNjMwMzQzODg5LCJzdWIiOiJmMmIxN2I5ZC00MjA2LTRjYzgtOGE2Ny0zOGUyZTkyZDVjMTUiLCJzY29wZXMiOlsic2hpcHBpbmctY2FsY3VsYXRlIl19.OSrYCGXdepIQ63DGIkNHSmQhee6uoyWbehKsarHlHq7HdGnaH7LMmK9osd3RlnK_9BqvKEwTIZL7JDEEQtHVgZ1SGqdehvWNdwTvdw80maL4vkD40PQFaEJJ18bejzEt1ijgIwehk86TidQFb5GJ2g2R4sD3mh9bB6ABt1zCZnmobO2erfAE5bdWAQ6m6CPZi5Noda1_yubScFWJWWz2SC37k-criFfMLkA6FkUUt41jxuMkgeeaeafkSVcqJlOiHHChsNcP05X2X3-jJ4NCHxhQbrNnKR-pRcj_vYAjBrOyTEYqMH7mI1QFgPs11n_8m61dqYGo8PTkaV3vAN4_yBsrqmVM02O2VswP42LvsxPyoouefYue2riobZ-9K3p40YnF34J2Pmg5gbANZJ3x5QNotyn0-EalDZN-X8hrMbeptWeL9Cs7OnFgLgYZjLBz5xCSCEEqlRLWKFzsuZAywAbKSdwLg3h3LYkiES5Aatp7JLVxGz-tv2OjwAYdF2kCOLI8jn1SI-G_NDNPcOp-c2qxzMO3m4TaSDteAaCua1Qwfpb10jbwA8X_pHRIg0lUB95BDfsaVhNOWGxTX4vp-tUC5SL2-HcfxRydrixYThBXl0kjrycOe5LBYHQ4nmTzuEwofzHNYFjUs8CFxbcw2JvLtuz6K_kSiIpHI4qKEAk', 
    false);
    var produtos = new Array()
    produtosf.forEach(element => {
      for (let index = 0; index < element.quantidade; index++) {
        produtos.push({height:element.altura,length:element.comprimento,weight:element.peso,width:element.largura,})
      }
    });
    return menv.calculateShipment("53030-010",cep,produtos,'')
  }
}
