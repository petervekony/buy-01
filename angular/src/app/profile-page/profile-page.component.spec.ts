import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePageComponent } from './profile-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../service/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilePageComponent, NavbarComponent],
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
