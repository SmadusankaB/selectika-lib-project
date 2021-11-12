import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectikaLibComponent } from './selectika-lib.component';

describe('SelectikaLibComponent', () => {
  let component: SelectikaLibComponent;
  let fixture: ComponentFixture<SelectikaLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectikaLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectikaLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
