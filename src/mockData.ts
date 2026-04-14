import { Incident, SystemHealth, DatabaseInstance, QueryPerformance, FileSystemItem } from './types';

export const mockIncidents: Incident[] = [
  {
    id: 'INC-2024-001',
    title: 'Oracle DB Latency: Vortex/Nebula Inventory',
    priority: 'Critical',
    status: 'In Progress',
    assignee: 'Sarah Chen',
    createdAt: '2024-04-13T08:30:00Z',
    system: 'Oracle 19c',
    description: 'The inventory queries for Vortex and Nebula are experiencing high latency. Affecting EDI processing.',
    logs: [
      { timestamp: '08:30:05', level: 'error', message: 'ORA-12170: TNS:Connect timeout occurred' },
      { timestamp: '08:31:12', level: 'warn', message: 'Retrying connection to ORCL_PROD (1/3)...' },
      { timestamp: '08:32:45', level: 'error', message: 'Connection pool exhausted for portal-api.' }
    ],
    timeline: [
      { id: '1', timestamp: '08:30:00', action: 'Incident Created', user: 'Oracle Enterprise Manager' },
      { id: '2', timestamp: '08:35:00', action: 'Assigned to Sarah Chen', user: 'Auto-Router' },
      { id: '3', timestamp: '08:40:00', action: 'Investigation Started', user: 'Sarah Chen', details: 'Checking TNS listener and active sessions.' }
    ]
  },
  {
    id: 'INC-2024-002',
    title: 'Image CDN Failure: Vortex Catalog',
    priority: 'High',
    status: 'Open',
    assignee: 'Unassigned',
    createdAt: '2024-04-13T09:15:00Z',
    system: 'CloudFront',
    description: 'Product images for Vortex Coffee are failing to load (404/502). Suspected cache invalidation issue.',
    logs: [
      { timestamp: '09:15:20', level: 'warn', message: 'Origin fetch failed for /seed/101/400/300' },
      { timestamp: '09:16:00', level: 'info', message: 'Purging edge cache for /assets/products/*' }
    ],
    timeline: [
      { id: '1', timestamp: '09:15:00', action: 'Incident Created', user: 'CloudWatch Alert' }
    ]
  },
  {
    id: 'INC-2024-003',
    title: 'Database Connection Pool Exhaustion',
    priority: 'Medium',
    status: 'Resolved',
    assignee: 'Maradona',
    createdAt: '2024-04-13T07:00:00Z',
    system: 'Azure SQL',
    description: 'Connection pool for the inventory-db reached 100% capacity. Resolved by increasing max connections.',
    logs: [
      { timestamp: '07:00:00', level: 'error', message: 'FATAL: remaining connection slots are reserved for non-replication superuser connections' }
    ],
    timeline: [
      { id: '1', timestamp: '07:00:00', action: 'Incident Created', user: 'Azure Monitor' },
      { id: '2', timestamp: '07:15:00', action: 'Config Updated', user: 'Marcus Rodriguez', details: 'Increased pool size to 500.' },
      { id: '3', timestamp: '07:20:00', action: 'Incident Resolved', user: 'Marcus Rodriguez' }
    ]
  },
  {
    id: 'INC-2024-004',
    title: 'SSL Certificate Expiry: checkout.itreal.life',
    priority: 'Critical',
    status: 'Open',
    assignee: 'Unassigned',
    createdAt: '2024-04-13T11:00:00Z',
    system: 'Cloudflare WAF',
    description: 'The SSL certificate for the checkout subdomain expired at 10:59 UTC. Customers are seeing "Your connection is not private" errors.',
    logs: [
      { timestamp: '11:00:01', level: 'error', message: 'SSL_ERROR_BAD_CERT_DOMAIN: checkout.itreal.life' },
      { timestamp: '11:00:05', level: 'error', message: 'Handshake failed: Certificate expired' }
    ],
    timeline: [
      { id: '1', timestamp: '11:00:00', action: 'Incident Created', user: 'UptimeRobot' }
    ]
  },
  {
    id: 'INC-2024-005',
    title: 'Redis OOM: Session Cache Cluster',
    priority: 'High',
    status: 'In Progress',
    assignee: 'Messi',
    createdAt: '2024-04-13T10:30:00Z',
    system: 'Redis Cluster',
    description: 'Redis node is out of memory and rejecting writes. Eviction policy is set to noeviction.',
    logs: [
      { timestamp: '10:30:10', level: 'error', message: 'OOM command not allowed when used memory > "maxmemory"' },
      { timestamp: '10:31:00', level: 'warn', message: 'Memory usage at 99.8%' }
    ],
    timeline: [
      { id: '1', timestamp: '10:30:00', action: 'Incident Created', user: 'Prometheus Alert' },
      { id: '2', timestamp: '10:35:00', action: 'Assigned to Messi', user: 'Auto-Router' }
    ]
  },
  {
    id: 'INC-2024-006',
    title: 'Disk Space Critical: /var/log on log-srv-01',
    priority: 'Medium',
    status: 'Open',
    assignee: 'Unassigned',
    createdAt: '2024-04-13T11:45:00Z',
    system: 'Logging Server',
    description: 'Disk usage on /var/log reached 98%. Risk of losing application logs.',
    logs: [
      { timestamp: '11:45:10', level: 'error', message: 'No space left on device: /var/log/syslog' }
    ],
    timeline: [
      { id: '1', timestamp: '11:45:00', action: 'Incident Created', user: 'Zabbix Agent' }
    ]
  },
  {
    id: 'INC-2024-007',
    title: 'Global DNS Resolution Failure',
    priority: 'Critical',
    status: 'In Progress',
    assignee: 'CR7',
    createdAt: '2024-04-13T12:00:00Z',
    system: 'Route 53',
    description: 'DNS queries for itreal.life are failing globally. Suspected BGP leak or provider outage.',
    logs: [
      { timestamp: '12:00:05', level: 'error', message: 'SERVFAIL for itreal.life' },
      { timestamp: '12:01:00', level: 'error', message: 'NXDOMAIN for api.itreal.life' }
    ],
    timeline: [
      { id: '1', timestamp: '12:00:00', action: 'Incident Created', user: 'ThousandEyes' },
      { id: '2', timestamp: '12:05:00', action: 'Assigned to CR7', user: 'Auto-Router' }
    ]
  },
  {
    id: 'INC-2024-008',
    title: 'Pod CrashLoopBackOff: auth-service',
    priority: 'High',
    status: 'Open',
    assignee: 'Unassigned',
    createdAt: '2024-04-13T12:15:00Z',
    system: 'Kubernetes',
    description: 'Auth-service pods are crashing repeatedly. Exit code 137 (OOMKilled).',
    logs: [
      { timestamp: '12:15:10', level: 'error', message: 'Back-off restarting failed container' },
      { timestamp: '12:16:00', level: 'error', message: 'Memory limit reached: 512Mi' }
    ],
    timeline: [
      { id: '1', timestamp: '12:15:00', action: 'Incident Created', user: 'Kube-State-Metrics' }
    ]
  }
];

export const systemHealth: SystemHealth[] = [
  { name: 'Portal Frontend Cluster', status: 'healthy', latency: 45, uptime: 99.99 },
  { name: 'Oracle 19c Database', status: 'healthy', latency: 12, uptime: 99.95 },
  { name: 'Vortex EDI Gateway', status: 'degraded', latency: 850, uptime: 98.2 },
  { name: 'Nebula Mail Server', status: 'healthy', latency: 150, uptime: 99.8 },
  { name: 'Solar FTP Server', status: 'healthy', latency: 200, uptime: 99.7 },
  { name: 'Legacy Mainframe (SAP)', status: 'down', latency: 0, uptime: 95.4 }
];

export const mockDatabases: DatabaseInstance[] = [
  {
    id: 'db-001',
    name: 'Inventory-DB-Prod',
    type: 'PostgreSQL',
    status: 'healthy',
    connections: 142,
    maxConnections: 500,
    cpuUsage: 24,
    memoryUsage: 62,
    storageUsed: 450,
    storageTotal: 1000,
    region: 'us-east-1'
  },
  {
    id: 'db-002',
    name: 'User-Session-Cache',
    type: 'Redis',
    status: 'healthy',
    connections: 1240,
    maxConnections: 5000,
    cpuUsage: 12,
    memoryUsage: 85,
    storageUsed: 12,
    storageTotal: 32,
    region: 'eu-west-1'
  },
  {
    id: 'db-003',
    name: 'Customer-Analytics',
    type: 'MongoDB',
    status: 'degraded',
    connections: 85,
    maxConnections: 200,
    cpuUsage: 88,
    memoryUsage: 92,
    storageUsed: 1800,
    storageTotal: 2000,
    region: 'us-west-2'
  },
  {
    id: 'db-004',
    name: 'ORCL_PROD',
    type: 'Oracle',
    status: 'healthy',
    connections: 45,
    maxConnections: 200,
    cpuUsage: 18,
    memoryUsage: 45,
    storageUsed: 120,
    storageTotal: 500,
    region: 'eu-central-1'
  }
];

export const mockQueries: QueryPerformance[] = [
  { query: 'SELECT * FROM users WHERE last_login > ?', avgDuration: 12, callsPerMin: 450, p95: 45 },
  { query: 'UPDATE inventory SET stock = stock - 1 WHERE id = ?', avgDuration: 8, callsPerMin: 1200, p95: 25 },
  { query: 'INSERT INTO audit_logs (event, user_id, ts) VALUES (?, ?, ?)', avgDuration: 15, callsPerMin: 3000, p95: 60 },
  { query: 'SELECT SUM(total) FROM orders WHERE status = "completed"', avgDuration: 450, callsPerMin: 15, p95: 1200 }
];

export const initialFileSystem: FileSystemItem = {
  name: '/',
  type: 'dir',
  children: {
    'etc': {
      name: 'etc',
      type: 'dir',
      children: {
        'hosts': { name: 'hosts', type: 'file', content: '127.0.0.1 localhost\n10.0.0.5 sap-gateway\n10.0.0.10 db-prod' },
        'resolv.conf': { name: 'resolv.conf', type: 'file', content: 'nameserver 8.8.8.8' }
      }
    },
    'var': {
      name: 'var',
      type: 'dir',
      children: {
        'log': {
          name: 'log',
          type: 'dir',
          children: {
            'syslog': { name: 'syslog', type: 'file', content: 'Apr 13 10:00:01 ops-node systemd[1]: Starting Periodic Command Scheduler...\nApr 13 10:05:12 ops-node kernel: [ 123.456] eth0: link up, 1000Mbps' },
            'nginx.log': { name: 'nginx.log', type: 'file', content: '127.0.0.1 - - [13/Apr/2024:10:00:01 +0000] "GET /health HTTP/1.1" 200 2' }
          }
        }
      }
    },
    'home': {
      name: 'home',
      type: 'dir',
      children: {
        'admin': {
          name: 'admin',
          type: 'dir',
          children: {
            'readme.txt': { name: 'readme.txt', type: 'file', content: 'Welcome to OpsCenter Terminal.\nUse "help" to see available commands.' }
          }
        }
      }
    }
  }
};

export const portalProducts = [
  { id: 1, name: 'Palmeira Imperial', category: 'arvores', price: 450.00, stock: 15, description: 'Palmeira majestosa para jardins amplos.' },
  { id: 2, name: 'Costela de Adão', category: 'plantas', price: 89.90, stock: 42, description: 'Planta de interior com folhas icônicas.' },
  { id: 3, name: 'Cortador de Grama Industrial', category: 'jardinagem', price: 2490.00, stock: 5, description: 'Equipamento de alta performance para grandes áreas.' },
  { id: 4, name: 'Ficus Lyrata', category: 'plantas', price: 120.00, stock: 28, description: 'Árvore de interior elegante e moderna.' },
  { id: 5, name: 'Oliveira Centenária', category: 'arvores', price: 1200.00, stock: 3, description: 'Árvore histórica e resistente.' },
  { id: 6, name: 'Sistema de Irrigação Automatizado', category: 'jardinagem', price: 850.00, stock: 12, description: 'Irrigação inteligente para jardins industriais.' },
  { id: 7, name: 'Sementes de Girassol Gigante', category: 'sementes', price: 15.00, stock: 150, description: 'Sementes de alta germinação para girassóis enormes.' },
  { id: 8, name: 'Mudas de Lavanda', category: 'sementes', price: 25.00, stock: 60, description: 'Mudas prontas para plantio com aroma relaxante.' },
  { id: 9, name: 'Jiboia Pendente', category: 'plantas', price: 45.00, stock: 35, description: 'Planta versátil e fácil de cuidar, ideal para prateleiras.' },
  { id: 10, name: 'Espada de São Jorge', category: 'plantas', price: 65.00, stock: 50, description: 'Planta purificadora de ar, extremamente resistente.' },
  { id: 11, name: 'Ipê Amarelo Adulto', category: 'arvores', price: 350.00, stock: 8, description: 'Árvore nativa com floração espetacular.' },
  { id: 12, name: 'Bonsai de Jabuticaba', category: 'arvores', price: 180.00, stock: 10, description: 'Miniatura frutífera para colecionadores.' },
  { id: 13, name: 'Trator de Jardim Compacto', category: 'jardinagem', price: 15900.00, stock: 2, description: 'Potência e agilidade para manutenção de grandes gramados.' },
  { id: 14, name: 'Soprador de Folhas Profissional', category: 'jardinagem', price: 580.00, stock: 15, description: 'Alta vazão de ar para limpeza rápida de áreas externas.' },
  { id: 15, name: 'Sementes de Tomate Cereja', category: 'sementes', price: 12.00, stock: 200, description: 'Variedade produtiva e doce para hortas caseiras.' },
  { id: 16, name: 'Bulbos de Tulipa Holandesa', category: 'sementes', price: 48.00, stock: 80, description: 'Bulbos selecionados para flores vibrantes.' },
  { id: 17, name: 'Antúrio Vermelho', category: 'plantas', price: 75.00, stock: 20, description: 'Flores exóticas e duradouras em tons de vermelho intenso.' },
  { id: 18, name: 'Cerejeira Japonesa (Sakura)', category: 'arvores', price: 420.00, stock: 5, description: 'Beleza poética com flores rosadas na primavera.' },
  { id: 19, name: 'Adubo Orgânico Industrial (25kg)', category: 'jardinagem', price: 145.00, stock: 100, description: 'Nutrição completa para solos de grande escala.' },
  { id: 20, name: 'Kit de Ferramentas Premium', category: 'jardinagem', price: 290.00, stock: 25, description: 'Conjunto ergonômico em aço inoxidável.' },
];

export const portalClients = [
  { id: 1, nome: 'João Silva', morada: 'Rua das Flores, 123, Lisboa', nib: 'PT50 0001 0002 0003 0004 5', idade: 34, data_inicio: '2023-01-15', data_fim: null },
  { id: 2, nome: 'Maria Santos', morada: 'Av. da Liberdade, 45, Porto', nib: 'PT50 0005 0006 0007 0008 9', idade: 28, data_inicio: '2023-03-20', data_fim: null },
  { id: 3, nome: 'Carlos Oliveira', morada: 'Rua do Sol, 7, Coimbra', nib: 'PT50 0009 0010 0011 0012 1', idade: 45, data_inicio: '2022-11-10', data_fim: '2024-01-05' },
  { id: 4, nome: 'Ana Pereira', morada: 'Rua da Paz, 88, Braga', nib: 'PT50 0013 0014 0015 0016 3', idade: 52, data_inicio: '2023-06-01', data_fim: null },
  { id: 5, nome: 'Rui Costa', morada: 'Largo do Chafariz, 12, Faro', nib: 'PT50 0017 0018 0019 0020 5', idade: 39, data_inicio: '2024-02-15', data_fim: null },
];

export const portalCompanies = [
  { id: 1, nome: 'Vortex Coffee Systems', morada: 'Rua da Tecnologia, 40, Lisboa', nib: 'PT50 1001 1002 1003 1004 0', data_inicio: '2020-05-10', data_fim: null },
  { id: 2, nome: 'Nebula Brew Corp', morada: 'Av. do Futuro, 17, Porto', nib: 'PT50 1005 1006 1007 1008 2', data_inicio: '2021-09-22', data_fim: null },
  { id: 3, nome: 'Solar Beans Ltd', morada: 'Largo da Inovação, 100, Coimbra', nib: 'PT50 1009 1010 1011 1012 4', data_inicio: '2019-01-15', data_fim: null },
  { id: 4, nome: 'Titan Roasters', morada: 'Praceta do Progresso, 31, Braga', nib: 'PT50 1013 1014 1015 1016 6', data_inicio: '2022-04-01', data_fim: null },
  { id: 5, nome: 'Orion Extract', morada: 'Rua da Ciência, 123, Aveiro', nib: 'PT50 1017 1018 1019 1020 8', data_inicio: '2023-01-10', data_fim: null },
  { id: 6, nome: 'Nova Steam Integration', morada: 'Travessa da Indústria, 45, Évora', nib: 'PT50 1021 1022 1023 1024 0', data_inicio: '2023-06-15', data_fim: null },
];
