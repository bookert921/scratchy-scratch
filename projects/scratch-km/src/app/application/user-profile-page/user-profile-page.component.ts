import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { LickAppPageComponent } from 'lick-app-page';
import { DataMediationService } from '../../shared/services/data-mediation.service';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.css']
})
export class UserProfilePageComponent extends LickAppPageComponent implements OnInit, OnDestroy {

  message;

  constructor(public dm: DataMediationService, protected renderer2: Renderer2, public router: Router) {
    super(router, renderer2);
  }

  ngOnInit() {
    super.ngOnInit();
    this.setBreadCrumb();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  private setBreadCrumb(): void {
    this.crumbs = [
      { name: "home", link: "/", active: false },
      { name: "profile", link: "/application/profile", active: true }
    ]
  }

  onPageEvent() {
    this.dm.loginService.sendEmailVerification();
    this.message = "Check your email.";
  }

  onSearch(value) : void {
    this.router.navigate(['application', 'topics'], {queryParams: { searchArgument: value}})
  }

  onBreadCrumb(link): void {
    this.router.navigate([link]);
  }

  get diagnostic() {
    return JSON.stringify(this.message, null, 2);
  }

}
