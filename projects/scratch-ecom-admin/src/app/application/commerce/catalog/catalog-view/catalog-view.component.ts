import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Catalog, Store } from 'lick-data';
import { LickAppPageComponent, LickAppBehavior } from 'lick-app-page';
import { CATALOGS } from 'licky-services';
import { DataMediationService } from '../../../../shared/services/data-mediation.service';
import { Subscription } from 'rxjs';
import { BreadCrumbService, CATALOG } from '../../../../shared/services/bread-crumb.service';
import { LickyLoggerService } from 'licky-services';

@Component({
  selector: 'app-catalog-view',
  templateUrl: './catalog-view.component.html',
  styleUrls: ['./catalog-view.component.css']
})
export class CatalogViewComponent extends LickAppPageComponent implements OnInit, OnDestroy, LickAppBehavior {

  catalog: Catalog;

  canEdit = true;

  canDelete = true;

  searchArgument;

  private _paramSubscription: Subscription;

  private _storeSubscription: Subscription;

  store_id;

  store: Store;

  constructor(public breadCrumbService: BreadCrumbService, public dm: DataMediationService, protected renderer2: Renderer2,
    public router: Router,
    private _route: ActivatedRoute) {
    super(router, renderer2);
  }

  ngOnInit() {
    super.ngOnInit();
    this._route.data
      .subscribe((data: { catalog: Catalog }) => {
        this.catalog = data.catalog;
        this.store_id = this.catalog.store_id
        this.setStore();
        this.searchArgument = this.catalog.name;
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this._paramSubscription)
      this._paramSubscription.unsubscribe();
    if (this._storeSubscription)
      this._storeSubscription.unsubscribe();
  }

  setBreadCrumb(): void {
    this.breadCrumbService.setContext(CATALOG);
    this.breadCrumbService.setBreadCrumb(this.store_id, this.catalog.id);
    this.crumbs = this.breadCrumbService.getBreadCrumb();
  }

  private setStore(): void {
    this.dm.doStore(this.store_id);
    this.dm.store.subscribe((store) => {
      this.store = store;
      this.setBreadCrumb();
    })
  }


  onBreadCrumb(link): void {
    this.router.navigate([link]);
  }

  onEdit() {
    this.router.navigate([ 'stores', this.store_id, 'catalogs', this.catalog.id, 'edit'], { queryParams: { allowEdit: '1' }, fragment: 'top' });
  }

  onDelete() {
    this.dm.db.setDeleted(CATALOGS + "/" + this.store_id, this.catalog.id, this.catalog);
    this.router.navigate([ 'stores', this.store_id, 'catalogs']);
  }

  onProducts() {
    this.router.navigate([ 'stores', this.store_id, 'catalogs', this.catalog.id, 'products']);
  }

  onSearch(value): void {
    LickyLoggerService.log("ONSEARCH", value);
    this.router.navigate([ 'stores', this.store_id, 'catalogs'], { queryParams: { searchArgument: value } })
  }

  get diagnostic() {
    return JSON.stringify(this.catalog, null, 2)
  }

}
