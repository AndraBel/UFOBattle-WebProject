import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { PlayComponent } from './play/play.component';
import { RecordsComponent } from './records/records.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MessagesComponent } from './messages/messages.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'play', component: PlayComponent },
  { path: 'records', component: RecordsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'messages', component: MessagesComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
