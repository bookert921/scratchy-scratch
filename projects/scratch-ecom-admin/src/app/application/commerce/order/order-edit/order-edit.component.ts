import { Component, OnInit, OnDestroy, ViewChild, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Order, Store, Dropdown, Upload, Section } from 'lick-data';
import { UploadService, DropdownService, TypeFindService, ORDERS } from 'licky-services';
import { LickAppPageComponent, LickAppBehavior } from 'lick-app-page';
import { DataMediationService } from '../../../../shared/services/data-mediation.service';
import { Subscription } from 'rxjs';
import { BreadCrumbService, ORDER } from '../../../../shared/services/bread-crumb.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { LickAppWidgetSectionEditComponent } from 'lick-app-widget-section-edit';


@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent extends LickAppPageComponent implements OnInit, OnDestroy, LickAppBehavior {

  order: Order = new Order();

  public Editor = ClassicEditor;

  orderTypes: Dropdown[];

  status: Dropdown[];

  cartTotal: number = 0;

  cartTaxTotal: number = 0;

  private _paramSubscription: Subscription;

  private _orderSubscription: Subscription;

  private _storeSubscription: Subscription;

  store_id;

  store: Store;

  @ViewChild('dataForm') private frm: NgForm;

  @ViewChild('t') ngbTabSet;

  selectedFiles: FileList;

  currentUpload: Upload;

  searchArgument;

  @ViewChild(LickAppWidgetSectionEditComponent) sectionEdit: LickAppWidgetSectionEditComponent;

  canDelete: boolean = true;

  constructor(public dm: DataMediationService,
    protected renderer2: Renderer2,
    public router: Router,
    public typeFindService: TypeFindService,
    private _dropdownService: DropdownService,
    private _uploadService: UploadService,
    public breadCrumbService: BreadCrumbService, 
    private _route: ActivatedRoute) {
    super(router, renderer2);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initializeDropdowns();
    this._route.data
      .subscribe((data: { order: Order }) => {
        if (data.order) {
          this.order = data.order;
          this.store_id = this.order.store_id
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
    if (this._orderSubscription)
      this._orderSubscription.unsubscribe();
  }

  onSubmit(): void {
    this.modelCheck();
    (this.order.id ? this.onUpdate() : this.saveNewOrder());
  }

  onUpdate(): void {
    this.dm.db.updateData(ORDERS + "/" + this.store_id, this.order.id, this.order);
    const redirectPath = '/stores/' + this.store_id + '/orders/' + this.order.id;
    this.uploadSingle();
    this.redirect(redirectPath);
  }

  onDelete(): void {
    this.order.deleted = true;
    this.onUpdate();
    this.onBrandNew();
  }

  saveNewOrder(): void {
    this.dm.db.writeData(ORDERS + "/" + this.store_id, this.order).subscribe((key) => {
      this.order.id = key;
      const redirectPath = '/stores/' + this.store_id + '/orders/' + this.order.id;
      this.uploadSingle();
      this.redirect(redirectPath);
    });
  }

  private redirect(redirectPath): void {
    if (!this.currentUpload) {
      this.router.navigate([redirectPath]);
    }
    else {
      let uploadCheck = setInterval(() => {
        if (this.currentUpload.progress >= 100) {
          clearInterval(uploadCheck);
          this.router.navigate([redirectPath]);
        }
      }, 2000)
    }
  }


  private uploadSingle() {
    if (this.selectedFiles) {
      let file = this.selectedFiles.item(0)
      if (file) {
        this.currentUpload = new Upload(file);
        this.currentUpload.order_id = this.order.id;
        this._uploadService.pushFileToStorage(this.currentUpload, ORDERS  + "/" + this.store_id, '/stores/' + this.store_id, this.order, this.dm.db);
      }
    }
  }

  deleteAttachment() {
    this.selectedFiles = null;
  }

  private detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  onBrandNew(): void {
    this.order = new Order();
  }


  setBreadCrumb(): void {
    this.breadCrumbService.setContext(ORDER);
    this.breadCrumbService.setBreadCrumb(this.store_id);
    this.crumbs = this.breadCrumbService.getBreadCrumb();
  }

  private setStoreContext(): void {
    if (this._route.snapshot.params['id']) {
      this.store_id = this._route.snapshot.params['id'];
      this._paramSubscription = this._route.params.subscribe(
        (params: Params) => {
          this.store_id = this._route.snapshot.params['id'];
        });
      this.setStore();
    }
  }

  private setStore(): void {
    this.dm.doStore(this.store_id);
    this.dm.store.subscribe((store) => {
      this.store = store;
      this.setBreadCrumb();
    })
  }

  private initializeDropdowns(): void {
    this.orderTypes = this._dropdownService.getEmailTypes();
    this.status = this._dropdownService.getStatus();
  }

  onBreadCrumb(link): void {
    this.router.navigate([link]);
  }

  onSearch(value) : void {
    this.router.navigate([ 'stores', this.store_id, 'orders'], {queryParams: { searchArgument: value}})
  }

  modelCheck() {
    this.sectionEdit.modelCheck();
  }

  get diagnostic() {
    return JSON.stringify(this.order, null, 2)
      + ", store_id=" + this.store_id
      + ", STORE=" + JSON.stringify(this.store, null, 2)
  }

}
