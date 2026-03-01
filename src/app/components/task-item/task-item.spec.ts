import { ComponentFixture, TestBed } from '@angular/core/testing';

// 1. Виправляємо імпорт: додаємо Component до назви класу
import { TaskItemComponent } from './task-item'; 

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 2. Якщо компонент не standalone, залишаємо declarations. 
      // Якщо standalone — перенесіть TaskItemComponent в масив imports.
      declarations: [TaskItemComponent] 
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    
    // Додаємо тестові дані для @Input() task, щоб тест не падав
    component.task = {
      id: 1,
      title: 'Test',
      assignee: 'Test',
      dueDate: new Date(),
      status: 0 as any // або TaskStatus.TODO
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});