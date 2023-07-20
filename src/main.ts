import { enableProdMode, ReflectiveInjector } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import {Injectable } from '@angular/core';
import { TlvReadJsonConfLibService } from '@tlv-infrastructure/tlv-read-json-conf-lib';
import { HttpClient } from '@angular/common/http';



  
  if (environment.production) {
    enableProdMode();
  }
  
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
  




