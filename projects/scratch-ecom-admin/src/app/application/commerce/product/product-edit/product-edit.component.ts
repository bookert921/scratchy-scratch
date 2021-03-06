import { Component, OnInit, OnDestroy, ViewChild, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Product, Catalog, Store, Dropdown, Upload, Section } from 'lick-data';
import { UploadService, DropdownService, TypeFindService, PRODUCTS } from 'licky-services';
import { LickAppPageComponent, LickAppBehavior } from 'lick-app-page';
import { DataMediationService } from '../../../../shared/services/data-mediation.service';
import { Subscription } from 'rxjs';
import { BreadCrumbService, PRODUCT } from '../../../../shared/services/bread-crumb.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { LickAppWidgetSectionEditComponent } from 'lick-app-widget-section-edit';
import { LickyLoggerService } from 'licky-services';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent extends LickAppPageComponent implements OnInit, OnDestroy, LickAppBehavior {

  product: Product = new Product();

  public Editor1 = ClassicEditor;

  public Editor2 = ClassicEditor;

  categories: Dropdown[];

  lengths: Dropdown[];

  weights: Dropdown[];

  timePeriods: Dropdown[];

  private _paramSubscription: Subscription;

  private _productSubscription: Subscription;

  private _storeSubscription: Subscription;

  store_id;

  store: Store;

  catalog_id;

  catalog: Catalog;

  @ViewChild('dataForm') private frm: NgForm;

  @ViewChild('t') ngbTabSet;

  selectedFiles: FileList;

  currentUpload: Upload;

  searchArgument;

  canDelete: boolean = true;

  @ViewChild(LickAppWidgetSectionEditComponent) sectionEdit: LickAppWidgetSectionEditComponent;

  constructor(public dm: DataMediationService,
    protected renderer2: Renderer2,
    public router: Router,
    public breadCrumbService: BreadCrumbService,
    public typeFindService: TypeFindService,
    private _dropdownService: DropdownService,
    private _uploadService: UploadService,
    private _route: ActivatedRoute) {
    super(router, renderer2);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initializeDropdowns();
    this._route.data
      .subscribe((data: { product: Product }) => {
        if (data.product) {
          this.product = data.product;
          this.store_id = this.product.store_id
          this.setStoreContext();
        }
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this._paramSubscription)
      this._paramSubscription.unsubscribe();
    if (this._storeSubscription)
      this._storeSubscription.unsubscribe();
    if (this._productSubscription)
      this._productSubscription.unsubscribe();
  }

  onSubmit(): void {
    this.modelCheck();
    (this.product.id ? this.onUpdate() : this.saveNewProduct());
  }

  onUpdate(): void {
    this.dm.db.updateData(PRODUCTS + "/" + this.store_id, this.product.id, this.product);
    const redirectPath = '/stores/' + this.store_id + '/catalogs/' + this.catalog_id + '/products/' + this.product.id;
    this.uploadSingle();
    this.redirect(redirectPath);
  }

  onDelete(): void {
    this.product.deleted = true;
    this.onUpdate();
    this.onBrandNew();
  }

  saveNewProduct(): void {
    this.dm.db.writeData(PRODUCTS + "/" + this.store_id, this.product).subscribe((key) => {
      this.product.id = key;
      const redirectPath = '/stores/' + this.store_id + '/catalogs/' + this.catalog_id + '/products/' + this.product.id;
      this.uploadSingle();
      this.redirect(redirectPath);
    });
  }

  private redirect(redirectPath): void {
    if (!this.currentUpload) {
      LickyLoggerService.log("1", redirectPath)
      this.router.navigate([redirectPath]);
    }
    else {
      let uploadCheck = setInterval(() => {
        if (this.currentUpload.progress >= 100) {
          clearInterval(uploadCheck);
          LickyLoggerService.log("2", redirectPath)
          this.router.navigate([redirectPath]);
        }
      }, 1000)
    }
  }


  private uploadSingle() {
    if (this.selectedFiles) {
      let file = this.selectedFiles.item(0)
      if (file) {
        this.currentUpload = new Upload(file);
        this.currentUpload.product_id = this.product.id;
        this._uploadService.pushFileToStorage(this.currentUpload, PRODUCTS + "/" + this.store_id, '/stores/' + this.store_id, this.product, this.dm.db);
      }
    }
  }

  deleteAttachment() {
    this.selectedFiles = null;
  }

  public detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  onBrandNew(): void {
    this.product = new Product();
  }


  setBreadCrumb(): void {
    this.breadCrumbService.setContext(PRODUCT);
    this.breadCrumbService.setBreadCrumb(this.store_id, this.catalog_id);
    this.crumbs = this.breadCrumbService.getBreadCrumb();
  }

  private setStoreContext(): void {
    if (this._route.snapshot.params['id']) {
      this.store_id = this._route.snapshot.params['id'];
      this.catalog_id = this._route.snapshot.params['id2'];
      this._paramSubscription = this._route.params.subscribe(
        (params: Params) => {
          this.store_id = this._route.snapshot.params['id'];
          this.catalog_id = this._route.snapshot.params['id2'];
        });
      this.setStore();
    }
  }

  private setStore(): void {
    this.dm.doStore(this.store_id);
    this.dm.store.subscribe((store) => {
      this.store = store;
      this.setCatalog();
    })
  }

  private setCatalog(): void {
    this.dm.doCatalog(this.store_id, this.catalog_id);
    this.dm.catalog.subscribe((catalog) => {
      this.catalog = catalog;
      if (catalog)
        this.setBreadCrumb();
    })
  }

  private initializeDropdowns(): void {
    this.categories = this._dropdownService.getCategories();
    this.timePeriods = this._dropdownService.getTimePeriods();
    if (this.dm.user.metric) {
      this.lengths = this._dropdownService.getMetricLengthMeasurments();
      this.weights = this._dropdownService.getMetricWeightMeasurments();
    } else {
      this.lengths = this._dropdownService.getUSLengthMeasurments();
      this.weights = this._dropdownService.getUSWeightMeasurments();
    }
  }

  onBreadCrumb(link): void {
    this.router.navigate([link]);
  }

  onSearch(value): void {
    this.router.navigate(['stores', this.store_id, 'catalogs', this.catalog_id, 'products'], { queryParams: { searchArgument: value } })
  }

  modelCheck() {
    this.sectionEdit.modelCheck();
  }

  get diagnostic() {
    return JSON.stringify(this.product, null, 2)
      + ", store_id=" + this.store_id
      + ", STORE=" + JSON.stringify(this.store, null, 2)
  }

}
