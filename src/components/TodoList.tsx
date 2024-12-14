import React from "react";
import {
  VStack,
  HStack,
  Text,
  IconButton,
  Badge,
  StackDivider,
  Spacer,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Todo } from "../atoms/types";

interface TodoListProps {
  todos: Todo[];
  deleteTodo: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, deleteTodo }) => {
  if (todos.length === 0)
    return (
      <Badge colorScheme="green" p="4" m="4" borderRadius="lg">
        No Todos, yay~
      </Badge>
    );

  const vStackProps = {
    p: "4",
    w: "100%",
    maxW: { base: "90vw", sm: "80vw", lg: "50vw", xl: "40vw" },
    borderColor: "gray.100",
    borderWidth: "2px",
    borderRadius: "lg",
    alignItems: "stretch",
    divider: <StackDivider />,
  };

  return (
    <VStack {...vStackProps}>
      {todos.map((todo) => (
        <HStack key={todo.id}>
          <Text>{todo.body}</Text>
          <Spacer />
          <IconButton
            aria-label="Delete todo"
            icon={<DeleteIcon />}
            onClick={() => deleteTodo(todo.id)}
          />
        </HStack>
      ))}
    </VStack>
  );
};

export default TodoList;
