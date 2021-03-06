import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'licky-lick-app-widget-list-article-summary',
  templateUrl: './lick-app-widget-list-article-summary.component.html',
  styles: []
})
export class LickAppWidgetListArticleSummaryComponent implements OnInit {

  @Input() headingText = "Feed";
  @Input() iconClass = "fa fa-comments-o";
  @Input() data: any[];
  @Input() activeUsers;
  @Input() defaultImage: string = "https://via.placeholder.com/64x64";
  currentPage: number = 1;
  @Input() pageSize: number = 20;
  @Input() totalRecords: number = 0;

  @Output() pageEvent = new EventEmitter();
  @Output() currentPageEvent = new EventEmitter();
  @Output() buttonClickEvent = new EventEmitter();
  loading: boolean = true;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {this.loading = false}, 750);
  }

  onPageEvent(item) : void {
    this.pageEvent.emit(item);
  }

  onButtonClick() : void {
    this.buttonClickEvent.emit();
  }

  public onPageChange(value): void {
    this.currentPage = value;
    this.currentPageEvent.emit(this.currentPage);
  }

}
