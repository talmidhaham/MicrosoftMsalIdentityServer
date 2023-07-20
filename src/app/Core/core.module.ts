import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InjectionToken, Injector, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, IPublicClientApplication, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { TlvReadJsonConfLibModule, TlvReadJsonConfLibService } from '@tlv-infrastructure/tlv-read-json-conf-lib';
import { AuthConfig } from './auth-config';



import { ISettings } from './ICommon';

  
export function SettingsFactory(_SettingService:TlvReadJsonConfLibService) {
  
  console.log('HELLO THERE');

  let config = _SettingService.JsonFile as ISettings; 
  //this.configPpr = configService.JsonFile as Iurl; 
  //this.configProd = configService.JsonFile as Iurl; 

 return config.AuthSettings;
}

export const APP_CONFIG = new InjectionToken<AuthConfig>('app.config');

const GRAPH_ENDPOINT = 'https://localhost:7214';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(inject:Injector): IPublicClientApplication {
  console.log('MSALInstanceFactory');
  return new PublicClientApplication({
    auth: {
      clientId: '',
      authority: 'https://tlvfpdev.b2clogin.com/tlvfpdev.onmicrosoft.com/B2C_1_OauthPoc',
      redirectUri: window.location.origin + '/',
     // authorityMetadata:'https://tlvfpdev.b2clogin.com/tlvfpdev.onmicrosoft.com/B2C_1_OauthPoc/v2.0/.well-known/openid-configuration',
      knownAuthorities:['tlvfpdev.b2clogin.com']
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(GRAPH_ENDPOINT, ['https://tlvfpdev.onmicrosoft.com/196fc7d1-dec8-44d1-a43f-adb39850d4dc/access_as_user']);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['openid profile https://tlvfpdev.onmicrosoft.com/196fc7d1-dec8-44d1-a43f-adb39850d4dc/access_as_user'],
    },
  };
}

@NgModule({
  imports: [
    HttpClientModule,
    MsalModule
  ],
  providers: [

  ],
})
export class CoreModule  {
  static forRoot(): ModuleWithProviders<CoreModule> {

    return {
      ngModule: CoreModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MsalInterceptor,
          multi: true,
        },
        {
          provide: MSAL_INSTANCE,
          useFactory: MSALInstanceFactory,deps:[Injector]
        },
        {
          provide: MSAL_GUARD_CONFIG,
          useFactory: MSALGuardConfigFactory,
        },
        {
          provide: MSAL_INTERCEPTOR_CONFIG,
          useFactory: MSALInterceptorConfigFactory,
        },
        MsalService,
        MsalGuard,
        MsalBroadcastService,
      ]
    };
  }

  // constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
  //   if (parentModule) {
  //     throw new Error('CoreModule is already loaded. Import it in the AppModule only');
  //   }


  // }







}
