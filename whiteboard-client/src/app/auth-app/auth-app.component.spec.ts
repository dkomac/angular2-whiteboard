import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthAppComponent } from './auth-app.component';

describe('AuthAppComponent', () => {
  let component: AuthAppComponent;
  let fixture: ComponentFixture<AuthAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
