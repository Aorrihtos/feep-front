import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankMobileComponent } from './rank-mobile.component';

describe('RankMobileComponent', () => {
  let component: RankMobileComponent;
  let fixture: ComponentFixture<RankMobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RankMobileComponent]
    });
    fixture = TestBed.createComponent(RankMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
