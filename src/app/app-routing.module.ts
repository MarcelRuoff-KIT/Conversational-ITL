import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnitedStatesComponent } from './unitedstates/unitedstates.component';

const routes: Routes = [
  //{ path: 'counties/:selectedState/:selectedMetric/:selectedDate/:userID/:treatment/:task', component: CountiesComponent },
  { path: 'unitedstates/:selectedMetric/:selectedDate/:userID/:treatment/:task', component: UnitedStatesComponent },
  { path: '', component: UnitedStatesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
