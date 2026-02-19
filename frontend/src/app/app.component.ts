import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  title = 'Gestão Financeira';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
}
