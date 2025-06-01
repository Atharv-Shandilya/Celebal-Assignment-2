import { FaCheck } from "react-icons/fa6";
import type { IList } from "../types/list";
import { RiDeleteBin6Line, RiPencilLine } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";

export default ({
  task,
  priority,
  isCompleted,
  setList,
  listIndex,
  index,
}: {
  task: string;
  priority: string;
  isCompleted: boolean;
  listIndex: number;
  index: number;
  setList: React.Dispatch<React.SetStateAction<IList[]>>;
}) => {
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [value, setValue] = useState(task);
  const [editActive, setEditActive] = useState(false);

  useEffect(() => {
    if (textRef && textRef.current) {
      textRef.current.style.height = "0px";
      textRef.current.style.height = textRef.current.scrollHeight + "px";
    }
  }, [editActive, value]);

  useEffect(() => {
    if (textRef && textRef.current) {
      textRef.current.focus();
      const length = textRef.current.value.length;
      textRef.current.setSelectionRange(length, length);
    }
  }, [editActive]);

  function updateTask() {
    setEditActive(false);
    if (value == "") {
      setValue(task);
      setList((prev) => {
        const newArray = [...prev];

        newArray[listIndex].tasks[index] = {
          ...newArray[listIndex].tasks[index],
          task: task,
        };

        return newArray;
      });
    } else {
      setList((prev) => {
        const newArray = [...prev];

        newArray[listIndex].tasks[index] = {
          ...newArray[listIndex].tasks[index],
          task: value,
        };

        return newArray;
      });
    }
  }
  return (
    <section className="bg-white rounded-lg  p-4 mb-4 shadow-sm text-primary leading-[1.25] group relative">
      {/* Context Menu */}
      {!editActive && (
        <div className="group-hover:flex justify-end  hidden bg-white p-2 absolute top-2 right-2 rounded-xl shadow-sm ">
          <RiPencilLine
            className="mr-2 cursor-pointer"
            onClick={() => {
              setEditActive(true);
            }}
          />
          <RiDeleteBin6Line
            className="cursor-pointer hover:text-red-600"
            onClick={() => {
              setList((prev) => {
                const newArray = [...prev];
                newArray[listIndex] = {
                  ...newArray[listIndex],
                  tasks: [
                    ...newArray[listIndex].tasks.slice(0, index),
                    ...newArray[listIndex].tasks.slice(index + 1),
                  ],
                };
                return newArray;
              });
            }}
          />
        </div>
      )}

      {/* Tasks */}
      {!editActive && <p className="font-medium">{task}</p>}
      {editActive && (
        <textarea
          className=" resize-none  outline-none overflow-hidden min-h-4"
          ref={textRef}
          onBlur={() => {
            setValue(value);
            setEditActive(false);
          }}
          value={value}
          onKeyDown={(e) => {
            if (e.key == "Escape") {
              updateTask();
            } else if (e.key == "Enter") {
              e.preventDefault();
              updateTask();
            }
          }}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      )}
      {/* Priority and Mark as complete button */}
      <div className="flex items-center mt-[20px]  justify-between ">
        <p
          className={`${
            priority == "High"
              ? "text-red-600 bg-red-100"
              : priority == "Medium"
              ? "text-orange-600 bg-orange-100"
              : "text-green-600 bg-green-100"
          } px-6 py-2 rounded-lg text-sm`}
        >
          {priority}
        </p>
        <div
          className={`w-[25px] h-[25px] border rounded-full flex items-center justify-center cursor-pointer ${
            isCompleted ? " bg-primary" : ""
          }`}
          onClick={() => {
            setList((prev) => {
              const newArray = [...prev];
              newArray[listIndex].tasks[index] = {
                ...newArray[listIndex].tasks[index],
                isCompleted: !isCompleted,
              };

              return newArray;
            });
          }}
        >
          <FaCheck className={`${isCompleted ? "text-white" : ""} `} />
        </div>
      </div>
    </section>
  );
};
