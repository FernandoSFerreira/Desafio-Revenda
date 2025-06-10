import { Routes } from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import { PedidosComponent } from './pedidos-component/pedidos-component';
import { ProdutosComponent } from './produtos-component/produtos-component';
import { RevendasComponent } from './revendas-component/revendas-component';
import { UsuariosComponent } from './usuarios-component/usuarios-component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'pedidos', 
    component: PedidosComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'produtos', 
    component: ProdutosComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'revendas', 
    component: RevendasComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'usuarios', 
    component: UsuariosComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];