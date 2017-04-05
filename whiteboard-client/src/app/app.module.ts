import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import 'hammerjs';

import { RouterModule, PreloadAllModules } from '@angular/router';
import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';
import { AuthAppComponent } from './auth-app/auth-app.component';
import { RoomComponent } from './room/room.component';
import { CanvasComponent } from './directives/canvas/canvas.component';
import { SettingsComponent } from './directives/paintsettings/settings.component';

import { UserSettingService } from './providers/user.setting.service';
import { CanvasService } from './providers/canvas.service';
import { RoomlistComponent } from './roomlist/roomlist.component';
import { SocketService } from './providers/socket.service';

@NgModule({
  declarations: [
    AppComponent,
    AuthAppComponent,
    RoomComponent,
    CanvasComponent,
    SettingsComponent,
    RoomlistComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules })
  ],
  providers: [ UserSettingService, CanvasService, SocketService ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
