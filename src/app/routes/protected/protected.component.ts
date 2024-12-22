import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-protected',
  imports: [RouterModule],
  templateUrl: './protected.component.html',
  styleUrl: './protected.component.scss',
})
export class ProtectedComponent {}
