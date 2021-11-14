import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RetailerSelectComponent } from './retailer-select.component';

describe('RetailerSelectComponent', () => {
  let component: RetailerSelectComponent;
  let fixture: ComponentFixture<RetailerSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailerSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailerSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
