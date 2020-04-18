import { Component, OnInit, OnDestroy, ViewChild, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Payment, Store, Dropdown, Upload, Section, PaymentLine } from 'lick-data';
import { UploadService, DropdownService, TypeFindService, PAYMENTS } from 'licky-services';
import { LickAppPageComponent, LickAppBehavior } from 'lick-app-page';
import { DataMediationService } from '../../../../shared/services/data-mediation.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-payment-edit',
  templateUrl: './payment-edit.component.html',
  styleUrls: ['./payment-edit.component.css']
})
export class PaymentEditComponent extends LickAppPageComponent implements OnInit, OnDestroy, LickAppBehavior {

  payment: Payment = new Payment();

  paymentLine: PaymentLine = new PaymentLine();

  paymentTypes: Dropdown[];

  ccTypes: Dropdown[];

  fopTypes: Dropdown[];

  status: Dropdown[];

  creditCard: boolean = false;

  bankAccount: boolean = false;

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

  onFOP() : void {

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
      }, 1000)
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

  public detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  onBrandNew(): void {
    this.payment = new Payment();
  }



  setBreadCrumb(): void {
    this.crumbs = [
      { name: "dashboard", link: "/stores/dashboard", active: false },
      { name: "stores", link: "/stores", active: false },
      { name: this.store.name, link: "/stores/" + this.store.id, active: false },
      { name: "payments", link: "/stores/" + this.store_id + "/payments", active: false },
      { name: "new", link: "/stores/" + this.store_id + "/payments/new", active: true },
    ]
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
    this.paymentTypes = this._dropdownService.getEmailTypes();
    this.ccTypes = this._dropdownService.getCreditCardTypes();
    this.fopTypes = this._dropdownService.getFOPTypes();
    this.status = this._dropdownService.getStatus();
  }

  onBreadCrumb(link): void {
    this.router.navigate([link]);
  }

  onSearch(value) : void {
    this.router.navigate([ 'stores', this.store_id, 'payments'], {queryParams: { searchArgument: value}})
  }

  modelCheck() {
    if (this.section.name)
      this.newSection();
  }

  newSection(): void {
    this.payment.sections.push(this.section);
    this.section = new Section();
  }

  editSection(at: number): void {
    this.section = this.payment.sections[at];
    this.removeSection(at);
  }

  removeSection(at: number): void {
    this.payment.sections.splice(at, 1);
  }


  get diagnostic() {
    return JSON.stringify(this.payment, null, 2)
      + ", store_id=" + this.store_id
      + ", STORE=" + JSON.stringify(this.store, null, 2)
  }

}
