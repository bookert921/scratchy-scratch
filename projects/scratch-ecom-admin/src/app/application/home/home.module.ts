import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LickMarketingHeader4Module } from 'lick-marketing-header4';
import { LickMarketingFeatures1Module } from 'lick-marketing-features1';
import { LickMarketingAboutProduct1Module } from 'lick-marketing-about-product1';
import { LickMarketingParallax1Module} from 'lick-marketing-parallax1';
import { LickMarketingFaq1Module} from 'lick-marketing-faq1';
import { LickMarketingHowTo1Module } from 'lick-marketing-how-to1';
import { LickMarketingTryIt1Module} from 'lick-marketing-try-it1';
import { LickMarketingMenuModule} from 'lick-marketing-menu';
import { LickMarketingContactUs1Module} from 'lick-marketing-contact-us1';
import { LickAppWidgetNotFoundModule} from 'lick-app-widget-not-found';
import { LickMarketingFooter2Module} from 'lick-marketing-footer2';
import { LickMarketingTeam1Module} from 'lick-marketing-team1';
import { LickMarketingSimplePageModule} from 'lick-marketing-simple-page';
import { LickMarketingSimpleHeaderModule } from 'lick-marketing-simple-header';
import { LickAppWidgetMaintenanceModule } from 'lick-app-widget-maintenance';
import { LickAppWidgetProfileModule} from 'lick-app-widget-profile';
import { HomeComponent } from './home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { AboutComponent } from './about/about.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { HelpOneComponent } from './help-one/help-one.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
    imports: [
        SharedModule,
        LickMarketingHeader4Module,
        LickMarketingFeatures1Module,
        LickMarketingAboutProduct1Module,
        LickMarketingParallax1Module,
        LickMarketingFaq1Module,
        LickMarketingHowTo1Module,
        LickMarketingContactUs1Module,
        LickMarketingTryIt1Module,
        LickMarketingMenuModule,
        LickAppWidgetNotFoundModule,
        LickAppWidgetMaintenanceModule,
        LickMarketingFooter2Module,
        LickMarketingTeam1Module,
        LickMarketingSimplePageModule,
        LickMarketingSimpleHeaderModule,
        LickAppWidgetProfileModule
    ],
    declarations: [
        HomeComponent,
        NotFoundComponent,
        PrivacyComponent,
        TermsComponent,
        AboutComponent,
        MaintenanceComponent,
        HelpOneComponent,
        ProfileComponent,
    ],
    exports: [
        HomeComponent
    ]
})
export class HomeModule { }