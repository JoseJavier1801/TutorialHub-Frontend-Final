import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassExpansionComponent } from './class-expansion.component';

describe('ClassExpansionComponent', () => {
  let component: ClassExpansionComponent;
  let fixture: ComponentFixture<ClassExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassExpansionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
