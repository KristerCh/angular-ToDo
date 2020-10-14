import { TodoView } from './../models/todo-view';
import { Todo } from './../models/todo';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private db: AngularFirestore) { }

  private todoCollectionName = 'todos';

  getTodos(): Observable<firebase.firestore.QuerySnapshot> {
    return this.db.collection<Todo>(this.todoCollectionName, ref => ref.orderBy('lastModifiedDate')).get();
  }

  saveTodo(todo: Todo): Promise<DocumentReference> {
    return this.db.collection(this.todoCollectionName).add(todo);
  }

  editTodo(todo: TodoView): Promise<void> {
    return this.db.collection(this.todoCollectionName).doc(todo.id).update(todo);
  }

  editTodoPartial(id: string, obj: object): Promise<void> {
    return this.db.collection(this.todoCollectionName).doc(id).update(obj);
  }

  deleteTodo(idTodo: string): Promise<void>{
    return this.db.collection(this.todoCollectionName).doc(idTodo).delete();
  }
}
