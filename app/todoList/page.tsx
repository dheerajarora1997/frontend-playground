"use client";
import { useState, useEffect } from "react";
import "./style.scss";

export default function TodoListPage() {
  const storageItem = localStorage.getItem("toDolist");
  const storageList = storageItem ? JSON.parse(storageItem) : null;
  const [list, setList] = useState<string[]>(storageList || []);
  const addNew = () => {
    const sample: string[] = [...list];
    sample.push(" ");
    setList(sample);
  };
  const addValue = (value: string, index: number) => {
    const sample: string[] = [...list];
    sample[index] = value;
    setList(sample);
  };
  const removeItem = (index: number) => {
    const sample = [...list];
    sample.splice(index, 1);
    setList(sample);
  };
  useEffect(() => {
    localStorage.setItem("toDolist", JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    const stored = localStorage.getItem("toDolist");
    if (stored) {
      setList(JSON.parse(stored));
    }
  }, []);
  return (
    <div className="todo-list">
      <h1>To Do List</h1>
      {list?.map((listItem, index) => {
        return (
          <div key={`unique-${index}`}>
            <input
              value={listItem}
              onChange={(e) => {
                addValue(e.target.value, index);
              }}
              //   disabled={list.length - 1 !== index}
            />
            <button
              onClick={() => {
                removeItem(index);
              }}
              disabled={list.length === 1}
            >
              X
            </button>
          </div>
        );
      })}
      <button
        onClick={() => {
          addNew();
        }}
        className="add-button"
      >
        + Plus
      </button>
    </div>
  );
}
