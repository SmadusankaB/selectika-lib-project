import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagItemCategoryComponent } from './tag-item-category.component';

describe('TagCategoryComponent', () => {
  let component: TagItemCategoryComponent;
  let fixture: ComponentFixture<TagItemCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TagItemCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagItemCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
