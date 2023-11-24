import { useEffect, useState } from "react";

type TileType = "head" | "snake" | "food" | "empty";

type TileProps = {
  type: TileType;
  x: number;
  y: number;
};

type Direction = "up" | "down" | "left" | "right";

const Tile: React.FC<TileProps> = (props) => {
  const { type, x, y } = props;
  let classList = "border w-[50px] h-[50px]";
  if (type === "head") classList += " bg-green-500";
  if (type === "snake") classList += " bg-black text-white";
  if (type === "food") classList += " bg-red-500";

  return (
    <div className={classList}>
      x={x} y={y}
    </div>
  );
};

export default function Snake() {
  const [time, setTime] = useState(0);
  const [snake, setSnake] = useState([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]);

  const [food, setFood] = useState({ x: 5, y: 5 });

  const [direction, setDirection] = useState<Direction>("right");

  const containerHandleClick = ({ key }: { key: string }) => {
    switch (key) {
      case "ArrowUp":
        if (direction !== "down") setDirection("up");
        break;
      case "ArrowDown":
        if (direction !== "up") setDirection("down");
        break;
      case "ArrowLeft":
        if (direction !== "right") setDirection("left");
        break;
      case "ArrowRight":
        if (direction !== "left") setDirection("right");
        break;
    }
  };

  const moveSnakeUp = () => {
    let newSnake = [];
    newSnake[0] = { x: snake[0].x, y: snake[0].y - 1 };
    for (let i = 1; i < snake.length; i++) {
      newSnake[i] = snake[i - 1];
    }
    setSnake(newSnake);
  };

  const moveSnakeDown = () => {
    let newSnake = [];
    newSnake[0] = { x: snake[0].x, y: snake[0].y + 1 };
    for (let i = 1; i < snake.length; i++) {
      newSnake[i] = snake[i - 1];
    }
    setSnake(newSnake);
  };

  const moveSnakeRight = () => {
    let newSnake = [];
    newSnake[0] = { x: snake[0].x + 1, y: snake[0].y };
    for (let i = 1; i < snake.length; i++) {
      newSnake[i] = snake[i - 1];
    }
    setSnake(newSnake);
  };

  const moveSnakeLeft = () => {
    let newSnake = [];
    newSnake[0] = { x: snake[0].x - 1, y: snake[0].y };
    for (let i = 1; i < snake.length; i++) {
      newSnake[i] = snake[i - 1];
    }
    setSnake(newSnake);
  };

  useEffect(() => {
    if (window) {
      setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    switch (direction) {
      case "up":
        moveSnakeUp();
        break;
      case "down":
        moveSnakeDown();
        break;
      case "left":
        moveSnakeLeft();
        break;
      case "right":
        moveSnakeRight();
        break;
    }
  }, [time]);

  const getTileInfo = (x: number, y: number) => {
    if (x === snake[0].x && y === snake[0].y) {
      return "head";
    }
    if (snake.some((s) => s.x === x && s.y === y)) {
      return "snake";
    }
    if (food.x === x && food.y === y) {
      return "food";
    }
    return "empty";
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[500px] h-[500px] flex flex-wrap">
        {Array.from({ length: 10 }, (_, y) => {
          return (
            <div key={y} className="flex">
              {Array.from({ length: 10 }, (_, x) => (
                <Tile type={getTileInfo(x, y)} x={x} y={y} key={`${x}-${y}`} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
