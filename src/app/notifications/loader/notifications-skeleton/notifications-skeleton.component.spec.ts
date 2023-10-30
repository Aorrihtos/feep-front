import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsSkeletonComponent } from './notifications-skeleton.component';

describe('NotificationsSkeletonComponent', () => {
  let component: NotificationsSkeletonComponent;
  let fixture: ComponentFixture<NotificationsSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsSkeletonComponent]
    });
    fixture = TestBed.createComponent(NotificationsSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
