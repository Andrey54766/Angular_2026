import { Component, OnInit } from '@angular/core';
import { Task } from '../../core/models/task.model';
import { TaskStatus } from '../../core/models/status.enum';
// Імпортуємо наш сервіс
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-task-list',
  standalone: false,
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskListComponent implements OnInit {

  // Масив завдань, який ми будемо відображати
  myTasks: Task[] = []; 

  // Робимо Enum доступним для шаблону
  protected readonly TaskStatus = TaskStatus;

  // Початковий статус для фільтрації
  selectedStatus: TaskStatus | 'all' = 'all';

  // Змінна для збереження завдання, яке ми зараз редагуємо
  editingTask: Task | null = null;

  // Впроваджуємо сервіс через конструктор (DI)
  constructor(private taskService: TaskService) {
  }

  // Хук ініціалізації компонента
  ngOnInit(): void {
     this.loadTasks();
  }

  // Метод для завантаження даних із сервісу
  loadTasks(): void { 
    this.myTasks = this.taskService.getTasks();
  }

  // Метод для видалення завдання
  deleteTask(id: number): void {
    this.taskService.deleteTask(id);
    this.loadTasks(); // Оновлюємо список після видалення
  }

  // Метод для додавання або оновлення завдання
  addTask(task: Task): void {
    if (this.editingTask) {
      // Якщо ми в режимі редагування — викликаємо update
      this.taskService.updateTask(task);
      this.editingTask = null; // Скидаємо режим редагування
    } else {
      // Якщо це нове завдання — викликаємо add
      this.taskService.addTask(task);
    }
    this.loadTasks(); // Оновлюємо список
  }

  // Метод для входу в режим редагування (виправляємо вашу помилку TS2339)
  editTask(task: Task): void {
    this.editingTask = { ...task }; // Створюємо копію об'єкта
  }

  // Метод для обробки зміни фільтра
  onSelected(event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    this.selectedStatus = status as TaskStatus | 'all';
  }
}