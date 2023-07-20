import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApplicationRef, APP_INITIALIZER, DoBootstrap, InjectionToken, Injector, NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  IPublicClientApplication,
  PublicClientApplication,
  BrowserCacheLocation,
  LogLevel,
  InteractionType,
} from '@azure/msal-browser';
import {
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalInterceptorConfiguration,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalBroadcastService,
  MsalService,
  MsalGuard,
  MsalRedirectComponent,
  MsalModule,
  MsalInterceptor,
} from '@azure/msal-angular';
import { TlvReadJsonConfLibModule, TlvReadJsonConfLibService } from '@tlv-infrastructure/tlv-read-json-conf-lib';
import {  CoreModule } from './Core/core.module';
import { ISettings } from './Core/ICommon';
import { AuthConfig } from './Core/auth-config';
import { of } from 'rxjs';

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
      clientId: '4197e602-4d9a-4386-bbed-b3614e44eae1',
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



export  function initializeAppFactory() 
{
  console.log('initializeAppFactory');
  return  of();
}



@NgModule({
  declarations: [AppComponent, HomeComponent, ProfileComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    TlvReadJsonConfLibModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MsalModule
    //CoreModule.forRoot(),
    
  ],
  providers: [
    //{provide :APP_CONFIG, useFactory:SettingsFactory,deps:[TlvReadJsonConfLibService]},
    {
      provide: APP_INITIALIZER,
      useFactory:() => initializeAppFactory,
      multi: true
    },
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
  ],
  //bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule implements DoBootstrap {


  
  constructor(private injector: Injector,private serv:TlvReadJsonConfLibService) {

   



   

  }


  




  private async name(serv:TlvReadJsonConfLibService) {

    await serv.loadConfig();

    let appset = serv.JsonFile as ISettings

    let msac = this.injector.get(MSAL_INSTANCE);

    //msac = MSALInstanceFactory(injector);
    //console.log('MSAL_INSTANCE' + msac)
   //let ms = msac as any;
   //ms.config.auth.clientId = '4197e602-4d9a-4386-bbed-b3614e44eae1';
   console.log('ngDoBootstrap');
   (msac as any) = new PublicClientApplication({
    auth: {
      clientId: '4197e602-4d9a-4386-bbed-b3614e44eae1',
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
  });//.config.auth.clientId = '4197e602-4d9a-4386-bbed-b3614e44eae1';


  let msac2 = this.injector.get(MSAL_INSTANCE);
    //console.log('ngDoBootstrap' + appset.AuthSettings)



    const msalInstance = new PublicClientApplication({
      auth: {
        clientId: '4197e602-4d9a-4386-bbed-b3614e44eae1',
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
    }); // Create or update your MSAL instance

    // Create a static injector with the updated MSAL instance


  }

  ngDoBootstrap(appRef: ApplicationRef): void {

      //this.name(this.serv);


    appRef.bootstrap(AppComponent);
    appRef.bootstrap(MsalRedirectComponent);
  }




  
}
