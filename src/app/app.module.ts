import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreComponent } from './store/store.component';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { SacolaComponent } from './sacola/sacola.component';
import { PedidoComponent } from './pedido/pedido.component';


@NgModule({
  declarations: [
    AppComponent,
    StoreComponent,
    SacolaComponent,
    PedidoComponent,
  ],
  imports: [
    NgxMaskModule.forRoot(),
    BrowserModule, 
    NgbModule,FormsModule,
    AppRoutingModule, HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
