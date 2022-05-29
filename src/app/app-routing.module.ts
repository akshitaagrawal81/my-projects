import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DahboardComponent } from './dahboard/dahboard.component';

const routes: Routes = [
  { path: '', component: DahboardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
