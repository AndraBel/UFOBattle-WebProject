import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { UserService } from './shared/services/user.service';
import { TokenMgrService } from './shared/services/token-mgr.service';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { GameSettingsServiceService } from './shared/services/game-settings-service.service';
import { PlayMgrService } from './shared/services/play-mgr.service';
import { RecordsMgrService } from './shared/services/records-mgr.service';
import { RegisterMgrService } from './shared/services/register-mgr.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
    UserService,
    TokenMgrService,
    GameSettingsServiceService,
    PlayMgrService,
    RecordsMgrService,
    RegisterMgrService,
  ],
};
