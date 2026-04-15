export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type Status = 'Open' | 'In Progress' | 'Resolved';

export interface Incident {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  assignee: string;
  createdAt: string;
  description: string;
  system: string;
  role: 'Cloud Engineer' | 'DevOps' | 'Application Support Engineer';
  tutorialId?: string;
  logs: LogEntry[];
  timeline: TimelineEvent[];
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details?: string;
}

export interface SystemHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  uptime: number;
}

export interface DatabaseInstance {
  id: string;
  name: string;
  type: 'PostgreSQL' | 'MySQL' | 'Redis' | 'MongoDB' | 'SQL Server' | 'Oracle';
  status: 'healthy' | 'degraded' | 'down';
  connections: number;
  maxConnections: number;
  cpuUsage: number;
  memoryUsage: number;
  storageUsed: number;
  storageTotal: number;
  region: string;
}

export interface QueryPerformance {
  query: string;
  avgDuration: number;
  callsPerMin: number;
  p95: number;
}

export interface FileSystemItem {
  name: string;
  type: 'file' | 'dir';
  content?: string;
  children?: Record<string, FileSystemItem>;
}

export interface Tutorial {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  steps: { title: string; content: string }[];
}

export interface ToolScenario {
  title: string;
  description: string;
  metric: string;
  value: string;
}

export interface KnowledgeQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  role: 'Cloud Engineer' | 'Application Support Engineer';
}

export interface AssistantSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: string;
  backgroundType: 'solid' | 'gradient' | 'transparent';
  backgroundColor: string;
}
