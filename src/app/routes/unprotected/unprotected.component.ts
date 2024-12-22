import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-unprotected',
  imports: [RouterModule, NavBarComponent, FooterComponent],
  templateUrl: './unprotected.component.html',
  styleUrl: './unprotected.component.scss',
})
export class UnprotectedComponent {}
