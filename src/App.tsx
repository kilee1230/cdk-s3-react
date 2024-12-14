import { Heading, useColorMode, VStack } from "@chakra-ui/react";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";

import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { themeAtom } from "./atoms/theme";
import { addTodoAtom, deleteTodoAtom, todosAtom } from "./atoms/todo";

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [theme, setTheme] = useAtom(themeAtom);
  const [todos] = useAtom(todosAtom);

  const setAddTodo = useSetAtom(addTodoAtom);
  const deleteTodo = useSetAtom(deleteTodoAtom);

  useEffect(() => {
    setTheme(colorMode);
  }, [colorMode, setTheme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    toggleColorMode();
  };

  return (
    <VStack p={4}>
      <ThemeSwitcher toggleTheme={toggleTheme} theme={theme} />
      <Heading size="2xl">Jotai-Todos App</Heading>
      <AddTodo addTodo={setAddTodo} />
      <TodoList todos={todos} deleteTodo={deleteTodo} />
    </VStack>
  );
}

export default App;
