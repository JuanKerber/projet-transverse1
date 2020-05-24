import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AccueilComponent } from './accueil/accueil.component';
import { MenuPComponent } from './menu-p/menu-p.component';
import { ChoixPComponent } from './choix-p/choix-p.component';
import { SettingsComponent } from './settings/settings.component';
import { GameComponent } from './game/game.component';
import { InscriptionComponent } from './inscription/inscription.component';

const appRoutes = [
  { path: 'settings/back', redirectTo: '', pathMatch: 'full' },
  { path: 'connexion/settings/back', redirectTo: '/connexion', pathMatch: 'full' },
  { path: 'connexion/validation/settings/back', redirectTo: '/connexion/validation', pathMatch: 'full' },
  { path: 'connexion/validation/partieRapide/settings/back', redirectTo: '/connexion/validation/partieRapide', pathMatch: 'full' },
  { path: 'connexion/validation/tournoi/settings/back', redirectTo: '/connexion/validation/tournoi', pathMatch: 'full' },
  { path: 'connexion/validation/partieRapide/back', redirectTo: '/connexion/validation', pathMatch: 'full' },
  { path: 'connexion/validation/tournoi/back', redirectTo: '/connexion/validation', pathMatch: 'full' },


  { path: 'connexion', component: LoginComponent },
  { path: 'settings', component: SettingsComponent },
  { path: ':/settings', component: SettingsComponent },
  { path: ':/:/settings', component: SettingsComponent },
  { path: ':/:/:/settings', component: SettingsComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'connexion/validation', component: MenuPComponent  },
  { path: 'connexion/validation/partieRapide', component: ChoixPComponent  },
  { path: 'connexion/validation/tournoi', component: ChoixPComponent  },
  { path: '', component: AccueilComponent },
  { path: 'connexion/validation/partieRapide/play', component: GameComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccueilComponent,
    MenuPComponent,
    ChoixPComponent,
    SettingsComponent,
    GameComponent,
    InscriptionComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
