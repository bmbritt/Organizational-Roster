import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProspectiveMembersComponent } from './prospective-members.widget';

describe('ProspectiveMembersComponent', () => {
  let component: ProspectiveMembersComponent;
  let fixture: ComponentFixture<ProspectiveMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProspectiveMembersComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProspectiveMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
