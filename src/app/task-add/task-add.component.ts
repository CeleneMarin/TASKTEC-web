import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from '../moels/task.model';
import { TaskService } from '../task-service.service';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.css']
})
export class TaskAddComponent {
  newTask: Task = { title: '', description: '', deadline: '', completed: false };
  errorMessage: string = '';

  constructor(private taskService: TaskService, private router: Router) { }

  addTask(): void {
    console.log('Adding task:', this.newTask, this.isValidTask());
    
    if (this.isValidTask()) {
      this.taskService.getTasks().subscribe(tasks => {
        const lastTaskId = Number(tasks[tasks.length - 1]?.id || 0);
        this.newTask.id = String(lastTaskId + 1);
        this.taskService.addTask(this.newTask).subscribe(
          () => {
            // Lógica para manejar la respuesta del servidor (p. ej., actualizar la lista de tareas)
            this.newTask = { title: '', description: '', deadline: '', completed: false };
            this.errorMessage = ''; // Reiniciar mensaje de error
            // Redirigir de vuelta a la lista de tareas
            this.router.navigate(['/tasks']);
          },
          error => {
            console.error('Error adding task:', error);
            this.errorMessage = 'Could not add task; please try again later.';
          }
        );
      });
    } else {
      alert(this.errorMessage);
    }
  }
  

  private isValidTask(): boolean {
    var arreglo = this.newTask.deadline.trim().split('-');
    const currentDate = new Date();
    var today = currentDate.toISOString().split('T')[0];
    var todayArreglo = today.split('-');
    var validDate = true;

    if(arreglo[0] < todayArreglo[0] ){
      this.errorMessage = 'The year is invalid';
      validDate = false;
    } else {
      if(arreglo[0] == todayArreglo[0]){
        if(arreglo[1] < todayArreglo[1]){
          this.errorMessage = 'The month is invalid';
          validDate = false;
        } else {
          if(arreglo[1] == todayArreglo[1]){
            if(arreglo[2] < todayArreglo[2]){
              this.errorMessage = 'The day is invalid';
              validDate = false;
            }
          }
        }
      }
    }

    if(arreglo[1] < todayArreglo[1]){
      this.errorMessage = 'The month is invalid';
      validDate = false;
    }

    if(arreglo[2] < todayArreglo[2]){
      this.errorMessage = 'The day is invalid';
      validDate = false;
    }
    
    return this.newTask.title.trim() !== '' && this.newTask.description.trim() !== '' && (this.newTask.deadline.trim() !== '' && validDate);
  }
}
