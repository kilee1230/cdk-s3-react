import { atom } from "jotai";
import { nanoid } from "nanoid";
import { Todo } from "./types";

// Todos Atoms
export const todosAtom = atom<Todo[]>([]);
todosAtom.debugLabel = "todosAtom";

// Create
export const addTodoAtom = atom(null, (get, set, body: string) => {
  const newTodo: Todo = { id: nanoid(), body };
  set(todosAtom, [...get(todosAtom), newTodo]);
});

// Delete
export const deleteTodoAtom = atom(null, (get, set, id: string) => {
  const todos = get(todosAtom);
  const filteredTodos = todos.filter((todo) => todo.id !== id);
  set(todosAtom, filteredTodos);
});
