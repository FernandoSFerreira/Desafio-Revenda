import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebApiService } from './web-api';
import { environment } from '../../environments/environment';

var apiUrl = `${environment.apiUrl}/api`;

var httpLink = {
  AuthLogin: apiUrl + "/Auth/login",
  getAllPedidos: apiUrl + "/Pedidos"
}

@Injectable({
  providedIn: 'root'
})

export class HttpProviderService {
  constructor(private webApiService: WebApiService) { }

  public authLogin(model: any): Observable<any> {
    return this.webApiService.post(httpLink.AuthLogin, model);
  }
  public getAllEmployee(): Observable<any> {
    return this.webApiService.get(httpLink.getAllPedidos);
  }
}