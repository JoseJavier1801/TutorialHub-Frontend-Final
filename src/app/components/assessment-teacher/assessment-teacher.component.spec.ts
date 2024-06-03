import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentTeacherComponent } from './assessment-teacher.component';

describe('AssessmentTeacherComponent', () => {
  let component: AssessmentTeacherComponent;
  let fixture: ComponentFixture<AssessmentTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentTeacherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessmentTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
