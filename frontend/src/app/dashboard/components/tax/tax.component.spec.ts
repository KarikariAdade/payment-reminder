import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxComponent } from './tax.component';

describe('TaxComponent', () => {
  let component: TaxComponent;
  let fixture: ComponentFixture<TaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
