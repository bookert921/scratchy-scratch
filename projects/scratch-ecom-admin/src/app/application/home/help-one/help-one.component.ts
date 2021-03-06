import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { DataMediationService } from '../../../shared/services/data-mediation.service';
import { BreadCrumbService } from '../../../shared/services/bread-crumb.service';
import { LickAppPageComponent, LickAppBehavior } from 'lick-app-page';

@Component({
  selector: 'app-help-one',
  templateUrl: './help-one.component.html',
  styleUrls: ['./help-one.component.css']
})
export class HelpOneComponent extends LickAppPageComponent implements OnInit, OnDestroy, LickAppBehavior {

  panelHeaderText = "Help";
  helpHeaderText = "Overview";
  descriptionText = "Here is where you administer the products you want to sell and examine how your store is doing, aka your Backend. You create stores, catalogs, and add products here, then go and view your creation in the public store.";
  faq = [
    {
      "heading": "Top Menu",
      "description": "At the very top of the screen, some icons provide quick access to information that may be of interest to you. You can always get to the 16AHEAD eCommerce home page by clicking the 16AHEAD image. For access to the latest world news, click the icon that looks like a hamburger.  Additional icons such as dashboards, messages, tasks, alerts, or a shopping cart may also appear at the top. (The symbols that appear depend on the features associated with your account.) Clicking one of these icons reveals additional information, such as the latest messages or tasks assigned to you, or alerts that 16AHEAD generates through analysis."
    },
    {
      "heading": "Configuration",
      "description": "You can configure 16AHead with various preferences by clicking the down arrow next to your name in the top right and then click Settings. Once on the settings screen, you may change the way items are displayed or your personal information."
    },
    {
      "heading": "Navigation",
      "description": "The breadcrumb is your primary navigation tool and is context-driven, meaning that based on the information displayed, the navigation options and their path in the hierarchy are displayed. On occasion, large buttons are embedded in the content as hints on what to do next."
    },
    {
      "heading": "Organizing Your Store",
      "description": "<p>Creating a store in 16AHEAD is hierarchical driven. The first thing you want to do is create a store. A store is simply a context for the items you sell, like a clothing store or jewelry store. There is no limit on the number of stores you can have, but the way 16AHEAD works: Products or Services are part of a Catalog, and Catalogs are part of a store.</p><br> <p>Thus, after you create a store, you need to create catalogs for your store. A catalog is just logical groupings of related products and services such as a Comedy catalog for a Movie store.</p><br><p>Once the catalog creation is complete, then add the products. Give the products a compelling description and image. Further actions can be taken with the product, such as creating special Offers for a particular product grouping products into a bundle to be sold as a set. You will see the Offers and Product Bundle as options in the breadcrumb as you navigate through your catalogs.</p>"
    },
    {
      "heading": "Draft",
      "description": "When adding stores, catalogs, products, etc., you will see a draft switch that allows you to toggle on and off. The draft switch will enable you to see what your product looks live in your public store, without the public seeing the information. For example, if you add a product and want to see how it will display in your store, set the draft switch to on, then go to your live store, login, and see how the product looks. If satisfied with the appearance of your product, set the switch to off. The switch is hierarchical, thus setting a switch to on in a catalog removes all products in that catalog from public view."
    },
    {
      "heading": "Delete",
      "description": "When toggling an item to delete, the information is not removed from the system. Data in a state of deletion is hidden from all users. Unlike draft, deleted data cannot be seen on the public-facing web store."
    },
  ]

  constructor(public dm: DataMediationService,
    public breadCrumbService: BreadCrumbService,
    protected renderer2: Renderer2,
    public router: Router) {
    super(router, renderer2);
  }

  ngOnInit(): void {
    this.setBreadCrumb();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  setBreadCrumb(): void {
    this.breadCrumbService.setBreadCrumb();
    this.crumbs = this.breadCrumbService.getBreadCrumb();
  }

  onBreadCrumb(link): void {
    this.router.navigate([link]);
  }

  onSearch(value): void {
    // TODO
  }

}
