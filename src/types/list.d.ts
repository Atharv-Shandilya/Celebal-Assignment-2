export interface IList {
  id: string;
  title: string;
  tasks: ITask[];
}

export interface ITask {
  id: string;
  task: string;
  isCompleted: boolean;
  priority: string;
}
