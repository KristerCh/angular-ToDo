import { DocumentReference } from '@angular/fire/firestore';
import { TodoService } from './../../services/todo.service';
import { Todo } from './../../models/todo';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TodoView } from 'src/app/models/todo-view';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnInit {
  todoForm: FormGroup;
  createMode: boolean = true;
  todo: TodoView;

  constructor(private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      done: false
    });
    if(!this.createMode){
      this.loadTodo(this.todo);
    }
  }

  loadTodo(todo){
    this.todoForm.patchValue(todo);
  }

  saveTodo(){
    if(this.todoForm.invalid){
      return
    }

    if(this.createMode){
      let todo: Todo = this.todoForm.value;
      todo.lastModifiedDate = new Date();
      todo.createDate = new Date();
      this.todoService.saveTodo(todo).then(response => this.handleSuccesfulSaveTodo(response,todo))
      .catch(err => console.error(err));
    }else{
      let todo: TodoView = this.todoForm.value;
      todo.id = this.todo.id;
      todo.lastModifiedDate = new Date();
      this.todoService.editTodo(todo).then(() => this.handleSuccesfulEditTodo(todo))
      .catch(err => console.error(err));
    }

  }

  handleSuccesfulSaveTodo(response: DocumentReference, todo: Todo){
    this.activeModal.dismiss({todo: todo, id: response.id, createMode: true});
  }

  handleSuccesfulEditTodo(todo: TodoView){
    this.activeModal.dismiss({todo: todo, id: todo.id, createMode: false});
  }

}
