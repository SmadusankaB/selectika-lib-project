import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagUserCategoryComponent } from './tag-user-category.component';

describe('TagCategoryComponent', () => {
  let component: TagUserCategoryComponent;
  let fixture: ComponentFixture<TagUserCategoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TagUserCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagUserCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
