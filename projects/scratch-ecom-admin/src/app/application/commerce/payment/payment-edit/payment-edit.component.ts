import { Component, OnInit, OnDestroy, ViewChild, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Payment, Store, Dropdown, Upload, Section, PaymentLine } from 'lick-data';
import { UploadService, DropdownService, TypeFindService, PAYMENTS } from 'licky-services';
import { LickAppPageComponent, LickAppBehavior } from 'lick-app-page';
import { DataMediationService } from '../../../../shared/services/data-mediation.service';
import { Subscription } from 'rxjs';
import { BreadCrumbService, PAYMENT } from '../../../../shared/services/bread-crumb.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { LickAppWidgetSectionEditComponent } from 'lick-app-widget-section-edit';
import { LickyLoggerService } from 'licky-services';

@Component({
  selector: 'app-payment-edit',
  templateUrl: './payment-edit.component.html',
  styleUrls: ['./payment-edit.component.css']
})
export class PaymentEditComponent extends LickAppPageComponent implements OnInit, OnDestroy, LickAppBehavior {

  payment: Payment = new Payment();

  paymentLine: PaymentLine = new PaymentLine();

  @ViewChild(LickAppWidgetSectionEditComponent) sectionEdit: LickAppWidgetSectionEditComponent;


  public Editor = ClassicEditor;

  paymentTypes: Dropdown[];

  orders: Dropdown[];

  ccTypes: Dropdown[];

  fopTypes: Dropdown[];

  status: Dropdown[];

  creditCard: boolean = false;

  bankAccount: boolean = false;

  paypal: boolean = false;

  cash: boolean = false;

  private _paramSubscription: Subscription;

  private _paymentSubscription: Subscription;

  private _storeSubscription: Subscription;

  store_id;

  store: Store;

  @ViewChild('dataForm') private frm: NgForm;

  @ViewChild('t') ngbTabSet;

  selectedFiles: FileList;

  currentUpload: Upload;

  searchArgument;

  section: Section = new Section();

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
      .subscribe((data: { payment: Payment }) => {
        if (data.payment) {
          this.payment = data.payment;
          this.store_id = this.payment.store_id
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
    if (this._paymentSubscription)
      this._paymentSubscription.unsubscribe();
  }

  onSubmit(): void {
    this.modelCheck();
    (this.payment.id ? this.onUpdate() : this.saveNewPayment());
  }

  onUpdate(): void {
    this.dm.db.updateData(PAYMENTS + "/" + this.store_id, this.payment.id, this.payment);
    const redirectPath = '/stores/' + this.store_id + '/payments/' + this.payment.id;
    this.uploadSingle();
    this.redirect(redirectPath);
  }

  onDelete(): void {
    this.payment.deleted = true;
    this.onUpdate();
    this.onBrandNew();
  }

  saveNewPayment(): void {
    this.dm.db.writeData(PAYMENTS + "/" + this.store_id, this.payment).subscribe((key) => {
      this.payment.id = key;
      const redirectPath = '/stores/' + this.store_id + '/payments/' + this.payment.id;
      this.uploadSingle();
      this.redirect(redirectPath);
    });
  }

  onFOP(): void {
    LickyLoggerService.log(null, this.payment.fopType);
    this.resetFopTypes();
    if (this.payment.fopType.toLowerCase() === "cash")
      this.cash = true;
    else if (this.payment.fopType.toLowerCase() === "charge")
      this.creditCard = true;
    else if (this.payment.fopType.toLowerCase() === "check")
      this.bankAccount = true;
    else if (this.payment.fopType.toLowerCase() === "paypal")
      this.paypal = true;
    else if (this.payment.fopType.toLowerCase() === "transfer")
      this.bankAccount = true;
  }

  resetFopTypes(): void {
    this.cash = false;
    this.bankAccount = false;
    this.creditCard = false;
    this.paypal = false;
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
        this.currentUpload.payment_id = this.payment.id;
        this._uploadService.pushFileToStorage(this.currentUpload, PAYMENTS + "/" + this.store_id, '/stores/' + this.store_id, this.payment, this.dm.db);
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
    this.payment = new Payment();
  }



  setBreadCrumb(): void {
    this.breadCrumbService.setContext(PAYMENT);
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
    this.doOrders();
    this.paymentTypes = this._dropdownService.getEmailTypes();
    this.ccTypes = this._dropdownService.getCreditCardTypes();
    this.fopTypes = this._dropdownService.getFOPTypes();
    this.status = this._dropdownService.getStatus();
  }

  onBreadCrumb(link): void {
    this.router.navigate([link]);
  }

  onSearch(value): void {
    this.router.navigate(['stores', this.store_id, 'payments'], { queryParams: { searchArgument: value } })
  }

  modelCheck() {
    this.sectionEdit.modelCheck();
  }

  private doOrders(): void {
    this.dm.doOrders(this.store_id);
    this.dm.orders.subscribe((orders) => {
      LickyLoggerService.log(null, orders);
      if (orders)
        this.orders = this._dropdownService.getDataToDropdown(orders);
    })
  }



  get diagnostic() {
    return JSON.stringify(this.payment, null, 2)
      + ", store_id=" + this.store_id
      + ", STORE=" + JSON.stringify(this.store, null, 2)
  }

}
