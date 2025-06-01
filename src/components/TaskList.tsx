import { useEffect, useRef, useState } from "react";
import { FaPlus, FaEllipsis } from "react-icons/fa6";
import {
  RiDeleteBin6Line,
  RiPencilLine,
  RiCloseCircleLine,
} from "react-icons/ri";
import type { IList } from "../types/list";
import TaskCard from "./TaskCard";

export default ({
  title,
  tasks,
  index,
  list,
  setList,
  show,
  setShowMenuIdx,
  setAddTaskToIdx,
}: {
  title: string;
  tasks: any[];
  index: number;
  list: IList[];
  setList: React.Dispatch<React.SetStateAction<IList[]>>;
  show: boolean;
  setShowMenuIdx: React.Dispatch<React.SetStateAction<number>>;
  setAddTaskToIdx: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [edit, setEdit] = useState(false);
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (titleRef.current && edit) {
      titleRef.current.focus();
    }
  }, [edit]);

  const renameOnEnterHandler = (e: any) => {
    if (e.key == "Enter") {
      // Deals with rename if, input is left empty
      if (title == "") {
        setList((prev) => {
          prev[index] = { ...prev[index], title: "New List" };
          return [...prev];
        });
      }
      setEdit(false);
    }
  };

  const renameHandler = (e: any) => {
    setList((prev) => {
      const newArray = [...prev];
      newArray[index] = { ...newArray[index], title: e.target.value };
      return [...newArray];
    });
  };

  const deleteHandler = () => {
    setShowMenuIdx(-1);
    setList((prev) => {
      const newArray = [...prev];
      newArray[index] = { ...newArray[index], tasks: [] };
      return [...newArray];
    });
  };

  return (
    <article className="bg-[#D3CEFF] w-[300px] shrink-0 rounded-lg p-4 max-h-full  flex flex-col">
      <header className="flex items-center text-[#1F0C82] justify-between mb-6">
        <div className="flex items-center font-bold">
          <p className=" bg-white rounded-full w-[30px] h-[30px] flex items-center justify-center mr-4 ">
            {tasks.length}
          </p>
          <div className="text-xl flex-1 mr-2">
            {edit && (
              <input
                className="outline-none w-full "
                value={title}
                ref={titleRef}
                onChange={renameHandler}
                onKeyUp={renameOnEnterHandler}
              />
            )}
            {!edit && <h2>{title}</h2>}
          </div>
        </div>

        <div className="relative">
          <FaEllipsis
            className=" cursor-pointer relative z-10"
            onClick={() => {
              setShowMenuIdx((prev) => {
                if (prev == index) return -1;
                return index;
              });
            }}
          />
          {show && (
            <ul
              className="bg-white absolute right-[10px] top-[25px] p-2 rounded w-[200px] shadow-sm cursor-pointer text-gray-500 font-medium [&>div.top_li]:mb-[2px]
          [&_li]:flex [&_li]:items-center [&_li>span]:mr-1 [&_li]:px-2 [&_li]:py-1 z-50  [&_li]:rounded-sm"
            >
              <div className=" [&>li]:hover:text-gray-700 [&>li]:hover:bg-gray-100 top border-b-[0.5px] pb-1 mb-2">
                <li
                  onClick={() => {
                    setShowMenuIdx(-1);
                    setEdit(true);
                  }}
                >
                  <span>
                    <RiPencilLine />
                  </span>
                  Rename
                </li>
                <li onClick={deleteHandler}>
                  <span>
                    <RiCloseCircleLine />
                  </span>
                  Remove All Tasks
                </li>
              </div>
              <li
                className="hover:text-red-600 hover:bg-red-100 bottom"
                onClick={() => {
                  setShowMenuIdx(-1);
                  setList((prev) => {
                    return [...prev.slice(0, index), ...prev.slice(index + 1)];
                  });
                }}
              >
                <span>
                  <RiDeleteBin6Line />
                </span>
                Delete
              </li>
            </ul>
          )}
        </div>
      </header>
      {/* Tasks */}
      <section className=" overflow-y-scroll  ">
        {list.length != 0 &&
          list[index].tasks.map((v, i) => {
            return (
              <TaskCard
                key={v.id}
                task={v.task}
                priority={v.priority}
                isCompleted={v.isCompleted}
                setList={setList}
                listIndex={index}
                index={i}
              />
            );
          })}
      </section>
      <section className="mt-4">
        <button
          className="px-6 py-2 text-center bg-[#E3DCFA] hover:bg-[#dcd3f9] text-[#1F0C82] border border-dashed flex  w-full justify-center items-center cursor-pointer rounded-xl"
          onClick={() => {
            setAddTaskToIdx(index);
          }}
        >
          <FaPlus className="mr-3" />
          Add task
        </button>
      </section>
    </article>
  );
};
