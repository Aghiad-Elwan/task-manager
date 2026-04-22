export interface TaskHistoryEntry {
  changedAt: Date;
  progress: number;
  status: 'pending' | 'in-progress' | 'completed';
  note: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  userId: number;
  createdAt: Date;
  history: TaskHistoryEntry[];
}
