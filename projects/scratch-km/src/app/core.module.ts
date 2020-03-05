import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LickyServicesModule } from 'licky-services';
import { DataMediationService } from './shared/services/data-mediation.service';

import { environment } from '../environments/environment';

export const firebaseConfig = environment.firebaseConfig;

@NgModule({
  imports: [
    CommonModule,
    LickyServicesModule.forRoot(firebaseConfig),
  ],
  providers: [
    DataMediationService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('Core already loaded');
    }
  }
  static forRoot() {
    return {
      ngModule: CoreModule
    }
  }
}