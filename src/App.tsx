import { useEffect, useState } from "react";
import "./App.css";
import TaskList from "./components/TaskList";
import { v4 } from "uuid";
import { FaPlus } from "react-icons/fa6";
import type { IList } from "./types/list";
import CreateTaskModal from "./components/CreateTaskModal";
import { DropDown } from "./components/DropDown";

function App() {
  const [list, setList] = useState<IList[]>(() => {
    if (localStorage.getItem("List") == null) {
      return [];
    }
    return JSON.parse(localStorage.getItem("List") as string);
  });
  const [showMenuIdx, setShowMenuIdx] = useState(-1);
  const [addTaskToIdx, setAddTaskToIdx] = useState(-1);
  const [selected, setSelected] = useState("All");
  const [showDrop, setShowDrop] = useState(false);

  const filterCompletedTasksInLists = (lists: IList[]): IList[] => {
    return lists.map((list) => ({
      ...list,
      tasks: list.tasks.filter((task) => task.isCompleted),
    }));
  };

  const filterIncompleteTasksInLists = (lists: IList[]): IList[] => {
    return lists.map((list) => ({
      ...list,
      tasks: list.tasks.filter((task) => !task.isCompleted),
    }));
  };

  useEffect(() => {
    localStorage.setItem("List", JSON.stringify(list));
    console.log(JSON.parse(localStorage.getItem("List") as string));
  }, [list]);

  const addListHandler = () => {
    setList((prev) => [...prev, { id: v4(), title: `New List `, tasks: [] }]);
  };
  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 ">
        <img
          src="/blurry-gradient-haikei.svg"
          className="w-full opacity-25 h-full bg-cover"
        />
      </div>

      <main className="flex flex-col p-6 card fixed left-4 right-4 top-4 bottom-4 ">
        <header className="mb-8 flex justify-end">
          <DropDown
            selected={selected}
            setSelected={setSelected}
            options={["All", "Pending", "Done"]}
            showDrop={showDrop}
            setShowDrop={setShowDrop}
          />
        </header>
        <article className="flex gap-8 w-full items-start overflow-x-auto h-full overflow-y-hidden  ">
          {list.map((v: IList, i: number) => {
            return (
              <TaskList
                key={v.id}
                {...v}
                index={i}
                list={
                  selected == "All"
                    ? list
                    : selected == "Done"
                    ? filterCompletedTasksInLists(list)
                    : filterIncompleteTasksInLists(list)
                }
                setList={setList}
                show={i == showMenuIdx}
                setShowMenuIdx={setShowMenuIdx}
                setAddTaskToIdx={setAddTaskToIdx}
              />
            );
          })}

          <article className="w-[230px] shrink-0">
            <button
              onClick={addListHandler}
              className="px-6 py-2 text-center bg-[#badcfc] text-primary border border-dashed flex  w-full justify-center items-center cursor-pointer rounded-xl shrink-0"
            >
              <FaPlus className="mr-3" /> Add List
            </button>
          </article>
        </article>
        {(showMenuIdx != -1 || addTaskToIdx != -1) && (
          <div
            className="fixed top-0 right-0 bottom-0 left-0 "
            onClick={() => {
              setShowMenuIdx(-1);
              setAddTaskToIdx(-1);
            }}
          />
        )}
      </main>
      {addTaskToIdx != -1 && (
        <CreateTaskModal
          setList={setList}
          index={addTaskToIdx}
          setAddTaskToIdx={setAddTaskToIdx}
        />
      )}
    </>
  );
}

export default App;
