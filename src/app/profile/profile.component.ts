import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { InteractionRequiredAuthError, SilentRequest } from '@azure/msal-browser';

const GRAPH_ENDPOINT = 'https://localhost:7214/WeatherForecast';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile!: any;

  constructor(
    private http: HttpClient,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) { }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.http.get(GRAPH_ENDPOINT)
      .subscribe( profile => {
        this.profile = profile;

            var currentAccount = this.authService.instance.getActiveAccount();
            var silentRequest2 = {
                scopes: ["api://3b65ade9-e833-4248-a9c7-cfa866e9ebc6/read"],
                forceRefresh: true,
                account: currentAccount?currentAccount:undefined
            };

            var request = {
                scopes: ["Mail.Read"]
            };

            const tokenResponse =  this.authService.acquireTokenSilent(silentRequest2).subscribe(data =>
              {
                this.http.get(GRAPH_ENDPOINT)
                .subscribe(async profile => {
                  this.profile = profile;
                });

              });
      });
  }
}
