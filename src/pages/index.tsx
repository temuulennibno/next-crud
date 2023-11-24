import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";

type Todo = {
  id: number;
  title: string;
  checked: boolean;
};
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data, isLoading, error } = useSWR("http://localhost:3005/todos", fetcher);
  const [title, setTitle] = useState("");
  const { mutate } = useSWRConfig();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error {error}</div>;
  }

  const addTodo = async () => {
    await fetch("http://localhost:3005/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });
    mutate("http://localhost:3005/todos");
  };

  const deleteTodo = async (id: number) => {
    const isConfirmed = confirm("Are you sure");
    if (!isConfirmed) return;
    await fetch(`http://localhost:3005/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    mutate("http://localhost:3005/todos");
  };

  const editTodo = async (todo: Todo) => {
    const newValue = prompt("Zasah utgaa oruulna uu!", todo.title);
    await fetch(`http://localhost:3005/todos/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newValue, checked: todo.checked }),
    });
    mutate("http://localhost:3005/todos");
  };
  const checkTodo = async (todo: Todo) => {
    await fetch(`http://localhost:3005/todos/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: todo.title, checked: !todo.checked }),
    });
    mutate("http://localhost:3005/todos");
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
        >
          <input className="border" type="text" value={title} onChange={(e) => setTitle(e.target.value)} /> <button>Nemeh</button>
        </form>
      </div>
      <ul>
        {data?.map((todo: Todo) => (
          <li key={todo.id} className="flex items-center">
            <label>
              <input
                checked={todo.checked}
                type="checkbox"
                className="mr-2"
                onClick={() => {
                  checkTodo(todo);
                }}
              />
              {todo.title}
            </label>
            <button
              className="ml-4 border px-2 rounded-full"
              onClick={() => {
                editTodo(todo);
              }}
            >
              zasah
            </button>
            <button
              className="ml-4 border px-2 rounded-full"
              onClick={() => {
                deleteTodo(todo.id);
              }}
            >
              ustgah
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
