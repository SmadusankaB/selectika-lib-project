import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagFeatureComponent } from './tag-feature.component';

describe('TagFeatueComponent', () => {
  let component: TagFeatureComponent;
  let fixture: ComponentFixture<TagFeatureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TagFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
