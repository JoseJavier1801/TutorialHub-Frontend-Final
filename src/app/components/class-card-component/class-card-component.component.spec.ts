import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassCardComponentComponent } from './class-card-component.component';

describe('ClassCardComponentComponent', () => {
  let component: ClassCardComponentComponent;
  let fixture: ComponentFixture<ClassCardComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassCardComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassCardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
