import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedLoaderComponent } from './feed-loader.component';

describe('FeedLoaderComponent', () => {
  let component: FeedLoaderComponent;
  let fixture: ComponentFixture<FeedLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedLoaderComponent]
    });
    fixture = TestBed.createComponent(FeedLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
