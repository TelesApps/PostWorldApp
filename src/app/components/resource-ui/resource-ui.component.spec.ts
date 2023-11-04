import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceUiComponent } from './resource-ui.component';

describe('ResourceUiComponent', () => {
  let component: ResourceUiComponent;
  let fixture: ComponentFixture<ResourceUiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceUiComponent]
    });
    fixture = TestBed.createComponent(ResourceUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
