import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosComponent } from './usuarios-component';
import { UsuarioService } from '../Service/usuario-service';
import { HttpClientModule } from '@angular/common/http';

describe('UsuariosComponent', () => {
  let component: UsuariosComponent;
  let fixture: ComponentFixture<UsuariosComponent>;
  let usuarioService: UsuarioService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [UsuarioService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosComponent);
    component = fixture.componentInstance;
    usuarioService = TestBed.inject(UsuarioService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load usuarios on init', () => {
    spyOn(component, 'carregarUsuarios');
    component.ngOnInit();
    expect(component.carregarUsuarios).toHaveBeenCalled();
  });

  it('should add a new usuario', () => {
    spyOn(usuarioService, 'criarUsuario').and.callThrough();
    component.novoUsuario = { username: 'usuario_teste', password: 'senha_teste' };
    component.adicionarUsuario();
    expect(usuarioService.criarUsuario).toHaveBeenCalled();
  });

  it('should delete a usuario', () => {
    spyOn(usuarioService, 'excluirUsuario').and.callThrough();
    component.excluirUsuario('123');
    expect(usuarioService.excluirUsuario).toHaveBeenCalledWith('123');
  });
});