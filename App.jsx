import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Store,
  ShoppingCart,
  Package,
  BookOpen,
  BarChart3,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  Receipt,
  UserCheck,
  ShieldCheck,
  Search,
  Filter,
  Coffee,
  UtensilsCrossed,
  CupSoda,
  CakeSlice,
  QrCode,
  Banknote,
  CreditCard,
  Printer,
  RefreshCw,
  Edit3,
  X,
  TrendingUp,
  DollarSign,
  Layers,
  ClipboardList,
  Building2,
  MapPin,
  Percent,
  Users,
  Lock,
  LogOut,
  KeyRound,
  UserPlus,
  Globe,
  Copy,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Download,
  Bluetooth,
  Settings,
  Share2,
  Menu,
  ChevronLeft,
  ChevronRight,
  Cloud,
  CloudOff,
  Database
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// --- INITIAL DATA ---
const INITIAL_BRANCHES = [
  {
    id: 'br-1',
    name: 'Cabang Sidoarjo Pusat',
    cafeName: 'Kopi Senja Sidoarjo',
    receiptName: 'KOPI SENJA SIDOARJO',
    address: 'Jl. Gajah Mada No. 45, Sidoarjo',
    phone: '0812-3456-7890',
    tables: 12,
    manager: 'Budi Santoso'
  },
  {
    id: 'br-2',
    name: 'Cabang Surabaya Gubeng',
    cafeName: 'Ruang Seduh Gubeng',
    receiptName: 'RUANG SEDUH GUBENG',
    address: 'Jl. Raya Gubeng No. 88, Surabaya',
    phone: '0812-9876-5432',
    tables: 16,
    manager: 'Siti Aminah'
  },
  {
    id: 'br-3',
    name: 'Cabang Malang Suhat',
    cafeName: 'Kafe Teras Suhat',
    receiptName: 'KAFE TERAS SUHAT',
    address: 'Jl. Soekarno Hatta No. 19, Malang',
    phone: '0813-4567-8901',
    tables: 10,
    manager: 'Andi Wijaya'
  }
];

const INITIAL_USERS = [
  {
    id: 'usr-admin',
    username: 'admin',
    pin: '1234',
    name: 'Bpk. Hendra (Owner / Admin)',
    role: 'owner',
    branchId: 'ALL'
  },
  {
    id: 'usr-1',
    username: 'rina',
    pin: '1111',
    name: 'Rina (Kasir Sidoarjo)',
    role: 'cashier',
    branchId: 'br-1'
  },
  {
    id: 'usr-2',
    username: 'fajar',
    pin: '2222',
    name: 'Fajar (Kasir Gubeng)',
    role: 'cashier',
    branchId: 'br-2'
  },
  {
    id: 'usr-3',
    username: 'bagas',
    pin: '3333',
    name: 'Bagas (Kasir Malang)',
    role: 'cashier',
    branchId: 'br-3'
  }
];



const INITIAL_INGREDIENTS = [
  { id: 'ing-1', name: 'Biji Kopi Arabika Blend', unit: 'gr', minStock: 1000, costPerUnit: 250, category: 'Bahan Minuman' },
  { id: 'ing-2', name: 'Susu Fresh Milk', unit: 'ml', minStock: 5000, costPerUnit: 22, category: 'Bahan Minuman' },
  { id: 'ing-3', name: 'Gula Aren Cair', unit: 'ml', minStock: 1500, costPerUnit: 35, category: 'Bahan Minuman' },
  { id: 'ing-4', name: 'Bubuk Matcha Jepang', unit: 'gr', minStock: 500, costPerUnit: 450, category: 'Bahan Minuman' },
  { id: 'ing-5', name: 'Sirup Vanilla', unit: 'ml', minStock: 750, costPerUnit: 80, category: 'Bahan Minuman' },
  { id: 'ing-6', name: 'Cup Dingin 16oz + Lid', unit: 'pcs', minStock: 100, costPerUnit: 1200, category: 'Kemasan' },
  { id: 'ing-7', name: 'Paper Cup Panas 8oz', unit: 'pcs', minStock: 80, costPerUnit: 1100, category: 'Kemasan' },
  { id: 'ing-8', name: 'Croissant Butter Dough (Frozen)', unit: 'pcs', minStock: 25, costPerUnit: 8500, category: 'Bahan Makanan' },
  { id: 'ing-9', name: 'Kentang Shoestring', unit: 'gr', minStock: 3000, costPerUnit: 38, category: 'Bahan Makanan' },
  { id: 'ing-10', name: 'Roti Brioche', unit: 'slice', minStock: 30, costPerUnit: 2500, category: 'Bahan Makanan' },
  { id: 'ing-11', name: 'Smoked Beef & Cheese', unit: 'set', minStock: 20, costPerUnit: 7500, category: 'Bahan Makanan' }
];

// Stock per branch: { [branchId]: { [ingredientId]: number } }
const INITIAL_BRANCH_STOCKS = {
  'br-1': {
    'ing-1': 4500,
    'ing-2': 14000,
    'ing-3': 3200,
    'ing-4': 850,
    'ing-5': 1200,
    'ing-6': 240,
    'ing-7': 150,
    'ing-8': 40,
    'ing-9': 6500,
    'ing-10': 48,
    'ing-11': 35
  },
  'br-2': {
    'ing-1': 1800,
    'ing-2': 4200, // Low stock example
    'ing-3': 2100,
    'ing-4': 380,  // Low stock example
    'ing-5': 950,
    'ing-6': 180,
    'ing-7': 95,
    'ing-8': 18,   // Low stock example
    'ing-9': 5000,
    'ing-10': 36,
    'ing-11': 28
  },
  'br-3': {
    'ing-1': 3200,
    'ing-2': 9800,
    'ing-3': 1100, // Low stock example
    'ing-4': 620,
    'ing-5': 500,  // Low stock example
    'ing-6': 210,
    'ing-7': 110,
    'ing-8': 32,
    'ing-9': 4200,
    'ing-10': 24,   // Low stock example
    'ing-11': 19    // Low stock example
  }
};

const INITIAL_MENUS = [
  {
    id: 'mn-1',
    name: 'Es Kopi Susu Gula Aren',
    category: 'Kopi',
    price: 22000,
    hpp: 9200,
    icon: 'coffee'
  },
  {
    id: 'mn-2',
    name: 'Hot Cappuccino',
    category: 'Kopi',
    price: 24000,
    hpp: 8900,
    icon: 'coffee'
  },
  {
    id: 'mn-3',
    name: 'Iced Vanilla Latte',
    category: 'Kopi',
    price: 26000,
    hpp: 10100,
    icon: 'coffee'
  },
  {
    id: 'mn-4',
    name: 'Iced Matcha Latte',
    category: 'Non-Kopi',
    price: 27000,
    hpp: 11500,
    icon: 'soda'
  },
  {
    id: 'mn-5',
    name: 'Butter Croissant Warm',
    category: 'Pastry & Snack',
    price: 20000,
    hpp: 8500,
    icon: 'cake'
  },
  {
    id: 'mn-6',
    name: 'French Fries Basket',
    category: 'Pastry & Snack',
    price: 21000,
    hpp: 7600,
    icon: 'food'
  },
  {
    id: 'mn-7',
    name: 'Smoked Beef Brioche Toast',
    category: 'Makanan Berat',
    price: 32000,
    hpp: 12500,
    icon: 'food'
  }
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'TRX-2610-001',
    branchId: 'br-1',
    timestamp: '2026-10-24 08:15',
    cashier: 'Rina (Kasir Pagi)',
    orderType: 'Dine-In',
    tableNumber: 'Meja 03',
    customerName: 'Kak Dimas',
    paymentMethod: 'QRIS',
    items: [
      { menuId: 'mn-1', name: 'Es Kopi Susu Gula Aren', price: 22000, qty: 2 },
      { menuId: 'mn-5', name: 'Butter Croissant Warm', price: 20000, qty: 1 }
    ],
    subtotal: 64000,
    discountPercent: 0,
    discountAmount: 0,
    taxAmount: 6400,
    total: 70400,
    paidAmount: 70400,
    changeAmount: 0
  },
  {
    id: 'TRX-2610-002',
    branchId: 'br-2',
    timestamp: '2026-10-24 09:05',
    cashier: 'Fajar (Kasir Gubeng)',
    orderType: 'Takeaway',
    tableNumber: '-',
    customerName: 'Kak Nadia',
    paymentMethod: 'Tunai',
    items: [
      { menuId: 'mn-4', name: 'Iced Matcha Latte', price: 27000, qty: 2 },
      { menuId: 'mn-7', name: 'Smoked Beef Brioche Toast', price: 32000, qty: 1 }
    ],
    subtotal: 86000,
    discountPercent: 10,
    discountAmount: 8600,
    taxAmount: 7740,
    total: 85140,
    paidAmount: 100000,
    changeAmount: 14860
  },
  {
    id: 'TRX-2610-003',
    branchId: 'br-3',
    timestamp: '2026-10-24 09:40',
    cashier: 'Bagas (Kasir Suhat)',
    orderType: 'Dine-In',
    tableNumber: 'Meja 05',
    customerName: 'Kak Reza',
    paymentMethod: 'Debit',
    items: [
      { menuId: 'mn-3', name: 'Iced Vanilla Latte', price: 26000, qty: 1 },
      { menuId: 'mn-6', name: 'French Fries Basket', price: 21000, qty: 2 }
    ],
    subtotal: 68000,
    discountPercent: 0,
    discountAmount: 0,
    taxAmount: 6800,
    total: 74800,
    paidAmount: 74800,
    changeAmount: 0
  }
];

const INITIAL_STOCK_LOGS = [
  {
    id: 'LOG-001',
    timestamp: '2026-10-24 07:30',
    branchId: 'br-1',
    type: 'Restock Mandiri',
    ingredientId: 'ing-2',
    ingredientName: 'Susu Fresh Milk',
    qtyChange: 6000,
    unit: 'ml',
    totalCost: 132000,
    supplier: 'Distributor Diamond Sidoarjo',
    note: 'Belanja rutin pagi cabang Sidoarjo'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-10-24 08:15',
    branchId: 'br-1',
    type: 'Pemakaian Transaksi',
    ingredientId: 'ing-1',
    ingredientName: 'Biji Kopi Arabika Blend',
    qtyChange: -36,
    unit: 'gr',
    totalCost: 0,
    supplier: '-',
    note: 'Otomatis dari TRX-2610-001 (2x Es Kopi Susu)'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-10-24 08:50',
    branchId: 'br-3',
    type: 'Restock Mandiri',
    ingredientId: 'ing-1',
    ingredientName: 'Biji Kopi Arabika Blend',
    qtyChange: 1000,
    unit: 'gr',
    totalCost: 250000,
    supplier: 'Roastery Malang Lokal',
    note: 'Restock kopi arabika cabang Malang'
  }
];

// Helper format Rupiah
const formatRp = (num) => {
  return 'Rp ' + Math.round(Number(num) || 0).toLocaleString('id-ID');
};

const COLORS = ['#d97706', '#059669', '#2563eb', '#7c3aed', '#db2777'];

// ============================================================================
// REAL-TIME DUAL-ENGINE WEBSOCKET SYNC HELPERS (MQTT WSS + GZIP STREAM)
// ============================================================================
const MQTT_BROKERS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8884/mqtt',
  'wss://test.mosquitto.org:8081/mqtt'
];

const encodeMqttLength = (len) => {
  const bytes = [];
  let rem = len;
  do {
    let encodedByte = rem % 128;
    rem = Math.floor(rem / 128);
    if (rem > 0) encodedByte = encodedByte | 128;
    bytes.push(encodedByte);
  } while (rem > 0);
  return bytes;
};

const decodeMqttLength = (buf, startOffset) => {
  let multiplier = 1;
  let value = 0;
  let offset = startOffset;
  let encodedByte;
  do {
    if (offset >= buf.length) return null;
    encodedByte = buf[offset++];
    value += (encodedByte & 127) * multiplier;
    multiplier *= 128;
  } while ((encodedByte & 128) !== 0);
  return { length: value, nextOffset: offset };
};

const buildMqttConnectPacket = (clientId) => {
  const cid = new TextEncoder().encode(clientId);
  const varHeader = [0x00, 0x04, 0x4d, 0x51, 0x54, 0x54, 0x04, 0x02, 0x00, 0x3c]; // MQTT 3.1.1, CleanSession, KeepAlive 60s
  const payload = [cid.length >> 8, cid.length & 0xff, ...cid];
  const remLen = varHeader.length + payload.length;
  return new Uint8Array([0x10, ...encodeMqttLength(remLen), ...varHeader, ...payload]);
};

const buildMqttSubscribePacket = (topic, packetId = 1) => {
  const top = new TextEncoder().encode(topic);
  const varHeader = [packetId >> 8, packetId & 0xff];
  const payload = [top.length >> 8, top.length & 0xff, ...top, 0x00];
  const remLen = varHeader.length + payload.length;
  return new Uint8Array([0x82, ...encodeMqttLength(remLen), ...varHeader, ...payload]);
};

const buildMqttPublishPacket = (topic, messageStr, retain = true) => {
  const top = new TextEncoder().encode(topic);
  const msg = new TextEncoder().encode(messageStr);
  const varHeader = [top.length >> 8, top.length & 0xff, ...top];
  const remLen = varHeader.length + msg.length;
  const lenBytes = encodeMqttLength(remLen);
  const out = new Uint8Array(1 + lenBytes.length + remLen);
  out[0] = retain ? 0x31 : 0x30; // QoS 0, Retain = 1 so newly connected devices get latest state in <50ms
  out.set(lenBytes, 1);
  out.set(varHeader, 1 + lenBytes.length);
  out.set(msg, 1 + lenBytes.length + varHeader.length);
  return out;
};

const compressSyncPayload = async (obj) => {
  const jsonStr = JSON.stringify(obj);
  try {
    if (typeof CompressionStream !== 'undefined') {
      const stream = new Blob([jsonStr]).stream().pipeThrough(new CompressionStream('gzip'));
      const buf = await new Response(stream).arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return 'GZ:' + btoa(binary);
    }
  } catch (e) {}
  return jsonStr;
};

const decompressSyncPayload = async (rawStr) => {
  if (!rawStr || typeof rawStr !== 'string') return null;
  const trimmed = rawStr.trim();
  if (trimmed.startsWith('GZ:')) {
    try {
      const b64 = trimmed.slice(3);
      const binary = atob(b64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      if (typeof DecompressionStream !== 'undefined') {
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
        const text = await new Response(stream).text();
        return JSON.parse(text);
      }
    } catch (e) {
      return null;
    }
  }
  if (trimmed.startsWith('{')) {
    try {
      return JSON.parse(trimmed);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Helper to load the most recent saved state synchronously before first render
const loadInitialWorkspaceState = () => {
  let activeWs = 'RAMUJAYA-PUSAT';
  let activeDb = '';
  let activeSecret = '';
  let deviceId = 'dev_' + Math.random().toString(36).slice(2, 10);

  try {
    const savedDevId = localStorage.getItem('ramujaya_device_id_v1');
    if (savedDevId) {
      deviceId = savedDevId;
    } else {
      localStorage.setItem('ramujaya_device_id_v1', deviceId);
    }
  } catch (e) {}

  try {
    const savedCfg = localStorage.getItem('ramujaya_cloud_config_v2');
    if (savedCfg) {
      const cfg = JSON.parse(savedCfg);
      if (cfg.workspaceId) activeWs = cfg.workspaceId.trim().toUpperCase();
      if (cfg.cloudEndpoint) activeDb = cfg.cloudEndpoint;
      if (cfg.cloudSecret) activeSecret = cfg.cloudSecret;
    }
  } catch (e) {}

  try {
    const params = new URLSearchParams(window.location.search);
    const tokoParam = params.get('toko');
    const dbParam = params.get('db');
    const syncParam = params.get('sync');

    if (tokoParam) {
      const cleanToko = tokoParam.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
      if (cleanToko) activeWs = cleanToko;
    }
    if (dbParam) {
      activeDb = decodeURIComponent(dbParam).trim();
    }
    if (syncParam) {
      const jsonStr = decodeURIComponent(escape(atob(syncParam)));
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        if (parsed.workspaceId) activeWs = String(parsed.workspaceId).trim().toUpperCase();
        const nowTs = Math.max(Date.now(), Number(parsed.updatedAt) || 0);
        const syncedSnap = { ...parsed, workspaceId: activeWs, updatedAt: nowTs };
        try {
          localStorage.setItem(`ramujaya_ws_v4_${activeWs}`, JSON.stringify(syncedSnap));
          localStorage.setItem('ramujaya_unified_portal_v3', JSON.stringify(syncedSnap));
          localStorage.setItem(
            'ramujaya_cloud_config_v2',
            JSON.stringify({ workspaceId: activeWs, cloudEndpoint: activeDb, cloudSecret: activeSecret })
          );
        } catch (e) {}
        return {
          workspaceId: activeWs,
          cloudEndpoint: activeDb,
          cloudSecret: activeSecret,
          deviceId,
          snapshot: syncedSnap,
          fromSyncLink: true
        };
      }
    }
  } catch (e) {}

  // Inspect all candidate localStorage keys and pick the most recently updated snapshot
  let bestSnapshot = null;
  let bestTs = -1;
  try {
    const candidateKeys = [
      `ramujaya_ws_v4_${activeWs}`,
      'ramujaya_unified_portal_v3',
      'ramujaya_ws_v4_RAMUJAYA-PUSAT'
    ];
    for (const key of candidateKeys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const ts = Number(parsed.updatedAt) || 1;
          if (ts > bestTs) {
            bestTs = ts;
            bestSnapshot = parsed;
          }
        }
      }
    }
  } catch (e) {}

  return {
    workspaceId: activeWs,
    cloudEndpoint: activeDb,
    cloudSecret: activeSecret,
    deviceId,
    snapshot: bestSnapshot,
    fromSyncLink: false
  };
};

export default function App() {
  // Load initial state synchronously on Frame #1 so deleted/edited data NEVER reverts on refresh!
  const initData = useMemo(() => loadInitialWorkspaceState(), []);
  const initSnap = initData.snapshot;

  // --- MULTI-TENANT WORKSPACE & REAL-TIME CLOUD SYNC STATE ---
  const [workspaceId, setWorkspaceId] = useState(() => initData.workspaceId);
  const [draftWorkspaceId, setDraftWorkspaceId] = useState(() => initData.workspaceId);
  const [cloudEndpoint, setCloudEndpoint] = useState(() => initData.cloudEndpoint);
  const [cloudSecret, setCloudSecret] = useState(() => initData.cloudSecret);
  const [cloudStatus, setCloudStatus] = useState('connected'); // 'local' | 'syncing' | 'connected' | 'error'
  const [lastSyncTime, setLastSyncTime] = useState(() => new Date().toTimeString().slice(0, 8));
  const [cloudModal, setCloudModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAdvancedCloud, setShowAdvancedCloud] = useState(false);
  const [magicSyncText, setMagicSyncText] = useState('');
  const [lastResetAt, setLastResetAt] = useState(() => Number(initSnap?.lastResetAt) || 0);
  const [localMutationTick, setLocalMutationTick] = useState(0);

  // Refs for zero-flicker, echo-free real-time WebSocket synchronization
  const deviceIdRef = useRef(initData.deviceId);
  const mqttWsRef = useRef(null);
  const mqttConnectedRef = useRef(false);
  const ntfyWsRef = useRef(null);
  const lastAppliedTimestampRef = useRef(Number(initSnap?.updatedAt) || 0);
  const lastResetAtRef = useRef(Number(initSnap?.lastResetAt) || 0);
  const isApplyingRemoteRef = useRef(false);

  // Always record local user mutations immediately & bump local timestamp
  const markLocalMutation = useCallback(() => {
    const nextTs = Math.max(Date.now(), lastAppliedTimestampRef.current + 1);
    lastAppliedTimestampRef.current = nextTs;
    setLocalMutationTick((t) => t + 1);
  }, []);

  // Helper to restore login session across browser refresh or Android app restart
  const getSavedAuthSession = () => {
    try {
      const raw = localStorage.getItem('ramujaya_auth_session_v1');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.currentUser && parsed.currentUser.username) {
        return parsed;
      }
    } catch (e) {}
    return null;
  };

  const initialSession = useMemo(() => getSavedAuthSession(), []);

  // --- AUTH & USER STATE ---
  const [users, setUsers] = useState(() =>
    Array.isArray(initSnap?.users) && initSnap.users.length > 0 ? initSnap.users : INITIAL_USERS
  );
  const [currentUser, setCurrentUser] = useState(() => initialSession?.currentUser || null); // persisted across refresh
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [portalUrl] = useState('https://pos.ramujaya.id');
  const [showPinMap, setShowPinMap] = useState({});
  const [newUserModal, setNewUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    username: '',
    pin: '',
    role: 'cashier',
    branchId: 'br-1'
  });

  // --- STATE (Initialized synchronously from localStorage so deleted items stay deleted!) ---
  const [role, setRole] = useState(
    () => initialSession?.currentUser?.role || initialSession?.role || 'owner'
  ); // 'owner' | 'cashier'
  const [activeTab, setActiveTab] = useState(() => {
    const savedRole = initialSession?.currentUser?.role || initialSession?.role || 'owner';
    if (savedRole === 'cashier') return 'pos';
    return initialSession?.activeTab || 'pos';
  }); // 'pos' | 'inventory' | 'recipes' | 'reports' | 'branches'
  const [selectedBranchId, setSelectedBranchId] = useState(
    () => initialSession?.selectedBranchId || (initSnap?.branches?.[0]?.id ?? 'br-1')
  );

  const [branches, setBranches] = useState(() =>
    Array.isArray(initSnap?.branches) && initSnap.branches.length > 0
      ? initSnap.branches
      : INITIAL_BRANCHES
  );
  const [ingredients, setIngredients] = useState(() =>
    Array.isArray(initSnap?.ingredients) ? initSnap.ingredients : INITIAL_INGREDIENTS
  );
  const [branchStocks, setBranchStocks] = useState(() =>
    initSnap?.branchStocks && typeof initSnap.branchStocks === 'object'
      ? initSnap.branchStocks
      : INITIAL_BRANCH_STOCKS
  );
  const [menus, setMenus] = useState(() =>
    Array.isArray(initSnap?.menus) ? initSnap.menus : INITIAL_MENUS
  );
  const [transactions, setTransactions] = useState(() =>
    Array.isArray(initSnap?.transactions) ? initSnap.transactions : INITIAL_TRANSACTIONS
  );
  const [stockLogs, setStockLogs] = useState(() =>
    Array.isArray(initSnap?.stockLogs) ? initSnap.stockLogs : INITIAL_STOCK_LOGS
  );

  // Toast Notification
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // --- POS STATE ---
  const [posCategory, setPosCategory] = useState('Semua');
  const [posSearch, setPosSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('Dine-In'); // 'Dine-In' | 'Takeaway'
  const [tableNumber, setTableNumber] = useState('Meja 01');
  const [customerName, setCustomerName] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [enableTax, setEnableTax] = useState(true); // PB1 10%
  const [paymentMethod, setPaymentMethod] = useState('QRIS'); // 'Tunai' | 'QRIS' | 'Debit'
  const [cashReceived, setCashReceived] = useState('');
  const [activeReceipt, setActiveReceipt] = useState(null);

  // --- INVENTORY STATE ---
  const [invSearch, setInvSearch] = useState('');
  const [invFilter, setInvFilter] = useState('all'); // 'all' | 'low'
  const [restockModal, setRestockModal] = useState(false);
  const [restockForm, setRestockForm] = useState({
    ingredientId: 'ing-1',
    qty: '',
    totalCost: '',
    supplier: '',
    note: ''
  });

  const [transferModal, setTransferModal] = useState(false);
  const [transferForm, setTransferForm] = useState({
    fromBranchId: 'br-1',
    toBranchId: 'br-2',
    ingredientId: 'ing-1',
    qty: '',
    note: ''
  });

  const [opnameModal, setOpnameModal] = useState(null); // ingredient object
  const [opnameActualQty, setOpnameActualQty] = useState('');
  const [opnameNote, setOpnameNote] = useState('');

  const [newIngModal, setNewIngModal] = useState(false);
  const [newIngForm, setNewIngForm] = useState({
    name: '',
    unit: 'gr',
    minStock: 500,
    costPerUnit: 100,
    category: 'Bahan Minuman',
    initialStock: 1000
  });

  // --- SIDEBAR & PWA INSTALL STATE (DESKTOP & ANDROID) ---
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop collapse state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installModal, setInstallModal] = useState(false);
  const [isInstalledPWA, setIsInstalledPWA] = useState(false);

  // --- BLUETOOTH THERMAL PRINTER STATE ---
  const [btDevice, setBtDevice] = useState(null);
  const [btCharacteristic, setBtCharacteristic] = useState(null);
  const [btConnecting, setBtConnecting] = useState(false);
  const [btPrinting, setBtPrinting] = useState(false);
  const [paperSize, setPaperSize] = useState('58mm'); // '58mm' (32 chars) | '80mm' (48 chars)
  const [autoPrintReceipt, setAutoPrintReceipt] = useState(false);
  const [printerModal, setPrinterModal] = useState(false);

  // --- RECIPE & MENU STATE (MANUAL HPP & HARGA JUAL) ---
  const [selectedMenuForRecipe, setSelectedMenuForRecipe] = useState('mn-1');
  const [newMenuModal, setNewMenuModal] = useState(false);
  const [newMenuForm, setNewMenuForm] = useState({
    name: '',
    category: 'Kopi',
    hpp: 10000,
    price: 25000,
    icon: 'coffee'
  });

  // --- REPORT FILTER STATE ---
  const [reportBranchFilter, setReportBranchFilter] = useState('ALL');

  // --- NEW & EDIT BRANCH STATE ---
  const [newBranchModal, setNewBranchModal] = useState(false);
  const [newBranchForm, setNewBranchForm] = useState({
    name: '',
    cafeName: '',
    receiptName: '',
    address: '',
    phone: '',
    tables: 10,
    manager: ''
  });
  const [editBranchModal, setEditBranchModal] = useState(null); // branch object being edited
  const [deleteBranchModal, setDeleteBranchModal] = useState(null); // branch object to delete
  const [resetReportModal, setResetReportModal] = useState(null); // { scope: 'ALL'|branchId, target: 'all'|'trx'|'logs' }

  // Current active branch object
  const currentBranch = useMemo(
    () => branches.find((b) => b.id === selectedBranchId) || branches[0],
    [branches, selectedBranchId]
  );

  // Setup PWA Manifest, Meta Tags & Service Worker for Desktop & Android Installation
  useEffect(() => {
    try {
      if (!document.querySelector('meta[name="theme-color"]')) {
        const metaTheme = document.createElement('meta');
        metaTheme.name = 'theme-color';
        metaTheme.content = '#1c1917';
        document.head.appendChild(metaTheme);
      }
      if (!document.querySelector('meta[name="mobile-web-app-capable"]')) {
        const metaMobile = document.createElement('meta');
        metaMobile.name = 'mobile-web-app-capable';
        metaMobile.content = 'yes';
        document.head.appendChild(metaMobile);
      }

      // Register real Service Worker (/sw.js) when hosted on Vercel/HTTPS so Android installs as a true APK/WebAPK without Chrome badge!
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      }

      // Generate real 192x192 & 512x512 PNG icons via HTML5 Canvas if no static /manifest.json is linked
      const makePngIcon = (size) => {
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.roundRect(0, 0, size, size, size * 0.22);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(size * 0.36)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('RJ', size / 2, size / 2);
        return c.toDataURL('image/png');
      };

      const existingManifest = document.querySelector('link[rel="manifest"]');
      if (!existingManifest) {
        const icon192 = makePngIcon(192);
        const icon512 = makePngIcon(512);
        const manifestObj = {
          id: '/',
          name: 'Ramu Jaya POS — Kasir & Stok Multi-Cabang',
          short_name: 'Ramu Jaya POS',
          description: 'Aplikasi Kasir Penjualan & Stok Kafe Multi-Cabang Ramu Jaya',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#1c1917',
          theme_color: '#1c1917',
          orientation: 'any',
          icons: [
            { src: icon192, sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
            { src: icon512, sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
          ]
        };
        const manifestBlob = new Blob([JSON.stringify(manifestObj)], { type: 'application/manifest+json' });
        const linkEl = document.createElement('link');
        linkEl.rel = 'manifest';
        linkEl.href = URL.createObjectURL(manifestBlob);
        document.head.appendChild(linkEl);
      }

      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalledPWA(true);
      }
    } catch (e) {
      // Ignore DOM errors in sandboxed frames
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // --- BLUETOOTH THERMAL PRINTER (ESC/POS) HANDLERS ---
  const connectBluetoothPrinter = async () => {
    if (!navigator.bluetooth) {
      showToast(
        'Browser ini tidak mendukung Web Bluetooth langsung. Gunakan Chrome di Android/Desktop atau tombol Cetak RawBT/Browser!',
        'error'
      );
      setPrinterModal(true);
      return null;
    }

    try {
      setBtConnecting(true);
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          '000018f0-0000-1000-8000-00805f9b34fb',
          'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
          '49535343-fe7d-4ae5-8fa9-9fafd205e455',
          '0000ff00-0000-1000-8000-00805f9b34fb',
          '0000ffe0-0000-1000-8000-00805f9b34fb'
        ]
      });

      const server = await device.gatt.connect();
      const services = await server.getPrimaryServices();
      let writableChar = null;

      for (const service of services) {
        const characteristics = await service.getCharacteristics();
        for (const char of characteristics) {
          if (char.properties.write || char.properties.writeWithoutResponse) {
            writableChar = char;
            break;
          }
        }
        if (writableChar) break;
      }

      if (!writableChar) {
        throw new Error('Karakteristik tulis (write) tidak ditemukan pada printer ini.');
      }

      device.addEventListener('gattserverdisconnected', () => {
        setBtDevice(null);
        setBtCharacteristic(null);
        showToast('Koneksi Printer Bluetooth terputus.', 'error');
      });

      setBtDevice(device);
      setBtCharacteristic(writableChar);
      setBtConnecting(false);
      showToast(`Terhubung ke Printer Bluetooth: ${device.name || 'Thermal Printer'}`);
      return writableChar;
    } catch (err) {
      setBtConnecting(false);
      if (err && err.name !== 'NotFoundError') {
        showToast(`Gagal menghubungkan Bluetooth: ${err.message || 'Pastikan printer menyala'}`, 'error');
      }
      return null;
    }
  };

  const disconnectBluetoothPrinter = () => {
    try {
      if (btDevice && btDevice.gatt && btDevice.gatt.connected) {
        btDevice.gatt.disconnect();
      }
    } catch (e) {
      // ignore
    }
    setBtDevice(null);
    setBtCharacteristic(null);
    showToast('Printer Bluetooth telah diputuskan.');
  };

  // Format line helper for 58mm (32 chars) or 80mm (48 chars)
  const formatThermalRow = (left, right, width) => {
    const cleanLeft = String(left || '');
    const cleanRight = String(right || '');
    const space = width - cleanLeft.length - cleanRight.length;
    if (space >= 1) {
      return cleanLeft + ' '.repeat(space) + cleanRight + '\n';
    }
    const maxLeft = Math.max(1, width - cleanRight.length - 1);
    return cleanLeft.slice(0, maxLeft) + ' ' + cleanRight + '\n';
  };

  // Build plain ESC/POS text & byte array for a receipt
  const buildEscPosReceipt = (receiptObj) => {
    const width = paperSize === '80mm' ? 48 : 32;
    const divider = '-'.repeat(width) + '\n';
    const branchObj = branches.find((b) => b.id === receiptObj.branchId) || currentBranch;

    const ESC = '\x1B';
    const GS = '\x1D';
    const INIT = ESC + '@';
    const ALIGN_LEFT = ESC + 'a\x00';
    const ALIGN_CENTER = ESC + 'a\x01';
    const BOLD_ON = ESC + 'E\x01';
    const BOLD_OFF = ESC + 'E\x00';

    const headerTitle = (
      branchObj?.receiptName ||
      branchObj?.cafeName ||
      branchObj?.name ||
      'RAMU JAYA POS'
    ).toUpperCase();

    let str = INIT;
    str += ALIGN_CENTER + BOLD_ON + headerTitle + '\n' + BOLD_OFF;
    str += (branchObj?.cafeName ? `${branchObj.cafeName} (${branchObj.name})` : branchObj?.name || '') + '\n';
    str += (branchObj?.address || '') + '\n';
    if (branchObj?.phone && branchObj.phone !== '-') {
      str += 'Telp: ' + branchObj.phone + '\n';
    }
    str += divider;

    str += ALIGN_LEFT;
    str += formatThermalRow('No Struk:', receiptObj.id, width);
    str += formatThermalRow('Waktu:', receiptObj.timestamp, width);
    str += formatThermalRow('Kasir:', receiptObj.cashier || '-', width);
    str += formatThermalRow('Pelanggan:', receiptObj.customerName, width);
    str += formatThermalRow(
      'Layanan:',
      `${receiptObj.orderType}${receiptObj.tableNumber !== '-' ? ' (' + receiptObj.tableNumber + ')' : ''}`,
      width
    );
    str += divider;

    receiptObj.items.forEach((item) => {
      str += BOLD_ON + item.name.slice(0, width) + BOLD_OFF + '\n';
      str += formatThermalRow(
        `  ${item.qty} x ${formatRp(item.price)}`,
        formatRp(item.qty * item.price),
        width
      );
    });

    str += divider;
    str += formatThermalRow('Subtotal', formatRp(receiptObj.subtotal), width);
    if (receiptObj.discountAmount > 0) {
      str += formatThermalRow(
        `Diskon (${receiptObj.discountPercent}%)`,
        '- ' + formatRp(receiptObj.discountAmount),
        width
      );
    }
    str += formatThermalRow('PB1 (10%)', formatRp(receiptObj.taxAmount), width);
    str += BOLD_ON + formatThermalRow('TOTAL', formatRp(receiptObj.total), width) + BOLD_OFF;
    str += formatThermalRow(`Bayar (${receiptObj.paymentMethod})`, formatRp(receiptObj.paidAmount), width);
    if (receiptObj.changeAmount > 0) {
      str += formatThermalRow('Kembalian', formatRp(receiptObj.changeAmount), width);
    }
    str += divider;
    str += ALIGN_CENTER + 'Terima kasih atas kunjungan Anda\n';
    str += `di ${branchObj?.cafeName || branchObj?.receiptName || branchObj?.name || 'Kafe Kami'}!\n`;
    str += 'Powered by Ramu Jaya POS\n\n\n\n';
    str += GS + 'V\x41\x03'; // Cut paper command if supported

    return str;
  };

  // Send ESC/POS bytes in chunks over Web Bluetooth GATT
  const sendBytesToCharacteristic = async (characteristic, rawStr) => {
    const bytes = new Uint8Array(rawStr.length);
    for (let i = 0; i < rawStr.length; i++) {
      bytes[i] = rawStr.charCodeAt(i) & 0xff;
    }
    const chunkSize = 100; // Safe BLE MTU packet size for 58mm/80mm thermal printers
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      const slice = bytes.slice(offset, offset + chunkSize);
      if (characteristic.properties.writeWithoutResponse) {
        await characteristic.writeValueWithoutResponse(slice);
      } else {
        await characteristic.writeValue(slice);
      }
      await new Promise((r) => setTimeout(r, 25));
    }
  };

  const handlePrintBluetoothReceipt = async (receiptObj) => {
    if (!receiptObj) return;
    setBtPrinting(true);
    try {
      let charToUse = btCharacteristic;
      if (!charToUse || !btDevice?.gatt?.connected) {
        charToUse = await connectBluetoothPrinter();
      }
      if (!charToUse) {
        setBtPrinting(false);
        return;
      }
      const escPosData = buildEscPosReceipt(receiptObj);
      await sendBytesToCharacteristic(charToUse, escPosData);
      showToast(`Struk ${receiptObj.id} berhasil dicetak ke Printer Bluetooth Thermal!`);
    } catch (err) {
      showToast(`Gagal mencetak via Bluetooth: ${err.message || 'Cek koneksi printer'}`, 'error');
    } finally {
      setBtPrinting(false);
    }
  };

  const handleTestBluetoothPrint = async () => {
    const sampleReceipt = {
      id: 'TEST-PRINT-01',
      branchId: selectedBranchId,
      timestamp: '2026-10-24 ' + new Date().toTimeString().slice(0, 5),
      cashier: currentUser?.name || 'Admin Ramu Jaya',
      customerName: 'Tes Koneksi Printer',
      orderType: 'Dine-In',
      tableNumber: 'Meja 01',
      paymentMethod: 'Tunai',
      items: [{ name: 'Es Kopi Susu Gula Aren', qty: 1, price: 22000 }],
      subtotal: 22000,
      discountPercent: 0,
      discountAmount: 0,
      taxAmount: 2200,
      total: 24200,
      paidAmount: 24200,
      changeAmount: 0
    };
    await handlePrintBluetoothReceipt(sampleReceipt);
  };

  // Fallback 1: Trigger RawBT Android Thermal Print Service via Intent URL
  const handlePrintRawBTAndroid = (receiptObj) => {
    if (!receiptObj) return;
    try {
      const escPosData = buildEscPosReceipt(receiptObj);
      const base64Payload = btoa(escPosData);
      const rawBtUrl = `intent:base64,${base64Payload}#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;`;
      window.location.href = rawBtUrl;
      showToast('Mengirim struk ke aplikasi RawBT Thermal Printer Android...');
    } catch (e) {
      showToast('Gagal membuka RawBT, gunakan Cetak Bluetooth Langsung.', 'error');
    }
  };

  // Fallback 2: Standard System / Browser Thermal Receipt Print (58mm/80mm CSS layout)
  const handleSystemThermalPrint = (receiptObj) => {
    if (!receiptObj) return;
    const branchObj = branches.find((b) => b.id === receiptObj.branchId) || currentBranch;
    const widthMm = paperSize === '80mm' ? '80mm' : '58mm';
    const printWin = window.open('', '_blank', 'width=380,height=640');
    if (!printWin) {
      window.print();
      return;
    }
    const itemsHtml = receiptObj.items
      .map(
        (i) => `
        <div style="margin-bottom:4px;">
          <div style="font-weight:bold;">${i.name}</div>
          <div style="display:flex;justify-content:space-between;">
            <span>${i.qty} x ${formatRp(i.price)}</span>
            <span>${formatRp(i.qty * i.price)}</span>
          </div>
        </div>`
      )
      .join('');

    printWin.document.write(`
      <html>
        <head>
          <title>Struk ${receiptObj.id} - Ramu Jaya Cafe</title>
          <style>
            @page { size: ${widthMm} auto; margin: 0; }
            body {
              font-family: 'Courier New', monospace;
              width: ${widthMm};
              margin: 0 auto;
              padding: 4mm;
              font-size: 11px;
              color: #000;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-top: 1px dashed #000; margin: 6px 0; }
            .row { display: flex; justify-content: space-between; margin: 2px 0; }
          </style>
        </head>
        <body>
          <div class="center bold" style="font-size:14px;">${(branchObj?.receiptName || branchObj?.cafeName || branchObj?.name || 'RAMU JAYA POS').toUpperCase()}</div>
          <div class="center">${branchObj?.cafeName ? branchObj.cafeName + ' — ' + branchObj.name : branchObj?.name || ''}</div>
          <div class="center" style="font-size:10px;">${branchObj?.address || ''}</div>
          <div class="line"></div>
          <div class="row"><span>No Struk:</span><span class="bold">${receiptObj.id}</span></div>
          <div class="row"><span>Waktu:</span><span>${receiptObj.timestamp}</span></div>
          <div class="row"><span>Kasir:</span><span>${receiptObj.cashier || '-'}</span></div>
          <div class="row"><span>Pelanggan:</span><span>${receiptObj.customerName}</span></div>
          <div class="row"><span>Layanan:</span><span>${receiptObj.orderType} ${receiptObj.tableNumber !== '-' ? '(' + receiptObj.tableNumber + ')' : ''}</span></div>
          <div class="line"></div>
          ${itemsHtml}
          <div class="line"></div>
          <div class="row"><span>Subtotal</span><span>${formatRp(receiptObj.subtotal)}</span></div>
          ${receiptObj.discountAmount > 0 ? `<div class="row"><span>Diskon (${receiptObj.discountPercent}%)</span><span>- ${formatRp(receiptObj.discountAmount)}</span></div>` : ''}
          <div class="row"><span>PB1 (10%)</span><span>${formatRp(receiptObj.taxAmount)}</span></div>
          <div class="row bold" style="font-size:13px;margin-top:4px;"><span>TOTAL</span><span>${formatRp(receiptObj.total)}</span></div>
          <div class="row"><span>Bayar (${receiptObj.paymentMethod})</span><span>${formatRp(receiptObj.paidAmount)}</span></div>
          ${receiptObj.changeAmount > 0 ? `<div class="row bold"><span>Kembalian</span><span>${formatRp(receiptObj.changeAmount)}</span></div>` : ''}
          <div class="line"></div>
          <div class="center" style="margin-top:8px;">Terima kasih atas kunjungan Anda<br/>di ${branchObj?.cafeName || branchObj?.receiptName || branchObj?.name || 'Kafe Kami'}!<br/><span style="font-size:9px;">Powered by Ramu Jaya POS</span></div>
          <script>
            window.onload = function() { window.print(); setTimeout(function(){ window.close(); }, 500); };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstalledPWA(true);
        showToast('Aplikasi Ramu Jaya POS berhasil di-install ke perangkat Anda!');
      }
    } else {
      setInstallModal(true);
    }
  };

  // Keep draftWorkspaceId synced when modal opens or workspaceId changes programmatically
  useEffect(() => {
    setDraftWorkspaceId(workspaceId);
  }, [workspaceId, cloudModal]);

  // Clean URL query params on mount if opened via ?sync= invite link
  useEffect(() => {
    if (initData.fromSyncLink) {
      showToast(`Berhasil terhubung & memuat seluruh data toko (${workspaceId})!`);
      try {
        const cleanUrl =
          window.location.pathname + (workspaceId ? `?toko=${encodeURIComponent(workspaceId)}` : '');
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (e) {}
    }
  }, []);

  // Authoritative Timestamp-Guarded Snapshot Applier
  // Strictly rejects any older cloud message (incomingTs <= lastAppliedTimestampRef.current)
  // so deleted or edited data NEVER comes back on refresh!
  const applyWorkspaceSnapshot = useCallback((parsed, forceReplace = false) => {
    if (!parsed || typeof parsed !== 'object') return false;

    const incomingTs = Number(parsed.updatedAt) || 0;
    const incomingReset = Number(parsed.lastResetAt) || 0;

    if (!forceReplace) {
      // Ignore our own echoes
      if (parsed.senderId && parsed.senderId === deviceIdRef.current) {
        return false;
      }
      // STRICT TIMESTAMP GUARD: Never allow an older or equal cloud snapshot to overwrite newer local data!
      if (!incomingTs || incomingTs <= lastAppliedTimestampRef.current) {
        return false;
      }
    }

    isApplyingRemoteRef.current = true;
    if (incomingTs > lastAppliedTimestampRef.current || forceReplace) {
      lastAppliedTimestampRef.current = incomingTs || Date.now();
    }

    if (incomingReset > lastResetAtRef.current || forceReplace) {
      lastResetAtRef.current = incomingReset;
      setLastResetAt(incomingReset);
    }

    if (Array.isArray(parsed.branches) && parsed.branches.length > 0) {
      setBranches(parsed.branches);
    }
    if (Array.isArray(parsed.ingredients)) {
      setIngredients(parsed.ingredients);
    }
    if (parsed.branchStocks && typeof parsed.branchStocks === 'object') {
      setBranchStocks(parsed.branchStocks);
    }
    if (Array.isArray(parsed.menus)) {
      setMenus(parsed.menus);
    }
    if (Array.isArray(parsed.users) && parsed.users.length > 0) {
      setUsers(parsed.users);
    }
    if (Array.isArray(parsed.transactions)) {
      setTransactions(parsed.transactions);
    }
    if (Array.isArray(parsed.stockLogs)) {
      setStockLogs(parsed.stockLogs);
    }

    setLastSyncTime(new Date().toTimeString().slice(0, 8));
    setTimeout(() => {
      isApplyingRemoteRef.current = false;
    }, 60);
    return true;
  }, []);

  // Same-device BroadcastChannel & Storage listener across tabs/windows (0ms latency)
  useEffect(() => {
    const storageKey = `ramujaya_ws_v4_${workspaceId}`;
    const handleStorageEvent = (e) => {
      if (e.key === storageKey && e.newValue) {
        try {
          applyWorkspaceSnapshot(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    let bc = null;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel(`rjpos_channel_${workspaceId}`);
        bc.onmessage = (ev) => {
          if (ev.data && ev.data.branches) {
            applyWorkspaceSnapshot(ev.data);
          }
        };
      }
    } catch (e) {}

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      if (bc) bc.close();
    };
  }, [workspaceId, applyWorkspaceSnapshot]);

  // Build current snapshot object
  const buildCurrentSnapshot = useCallback(
    (overrideWs = null, customResetAt = null, customTs = null) => {
      const targetWs = (overrideWs || workspaceId || 'RAMUJAYA-PUSAT')
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9_-]/g, '');
      const ts = customTs || Math.max(Date.now(), lastAppliedTimestampRef.current);
      lastAppliedTimestampRef.current = ts;
      return {
        updatedAt: ts,
        lastResetAt: customResetAt !== null ? customResetAt : lastResetAtRef.current,
        senderId: deviceIdRef.current,
        workspaceId: targetWs,
        branches,
        ingredients,
        branchStocks,
        menus,
        transactions,
        stockLogs,
        users
      };
    },
    [workspaceId, branches, ingredients, branchStocks, menus, transactions, stockLogs, users]
  );

  // IMMEDIATELY & SYNCHRONOUSLY save to localStorage on EVERY state change!
  // Guarantees 0ms local persistence so refreshing 1ms after deleting/editing NEVER loses changes!
  useEffect(() => {
    const targetWs = (workspaceId || 'RAMUJAYA-PUSAT')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, '');
    const ts =
      localMutationTick > 0
        ? Math.max(Date.now(), lastAppliedTimestampRef.current)
        : lastAppliedTimestampRef.current || Date.now();
    lastAppliedTimestampRef.current = ts;

    const snapshot = {
      updatedAt: ts,
      lastResetAt: lastResetAtRef.current,
      senderId: deviceIdRef.current,
      workspaceId: targetWs,
      branches,
      ingredients,
      branchStocks,
      menus,
      transactions,
      stockLogs,
      users
    };

    try {
      localStorage.setItem(`ramujaya_ws_v4_${targetWs}`, JSON.stringify(snapshot));
      localStorage.setItem('ramujaya_unified_portal_v3', JSON.stringify(snapshot));
      if (localMutationTick > 0 && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel(`rjpos_channel_${targetWs}`);
        bc.postMessage(snapshot);
        bc.close();
      }
    } catch (e) {}
  }, [
    branches,
    ingredients,
    branchStocks,
    menus,
    transactions,
    stockLogs,
    users,
    lastResetAt,
    workspaceId,
    localMutationTick
  ]);

  // Instant Real-Time Broadcast to Dual WebSockets (MQTT Retain + ntfy Port-443 Stream)
  const pushToCloud = useCallback(
    async (snapshotOverride = null, silent = true) => {
      const payload = snapshotOverride || buildCurrentSnapshot();
      const targetWs = (payload.workspaceId || workspaceId || 'RAMUJAYA-PUSAT')
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9_-]/g, '');
      const cleanTopic = targetWs.toLowerCase();
      const mqttTopic = `ramujaya/pos/v5/${cleanTopic}`;

      // 1. Save to localStorage & BroadcastChannel immediately (0ms)
      try {
        localStorage.setItem(`ramujaya_ws_v4_${targetWs}`, JSON.stringify(payload));
        localStorage.setItem('ramujaya_unified_portal_v3', JSON.stringify(payload));
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel(`rjpos_channel_${targetWs}`);
          bc.postMessage(payload);
          bc.close();
        }
      } catch (e) {}

      // 2. Compress payload (~2 KB) for ultra-fast sub-100ms transmission
      const compressedStr = await compressSyncPayload(payload);

      // 3. Publish via Engine 1: Open MQTT WebSocket with RETAIN = TRUE (<50ms latency!)
      let sentViaMqtt = false;
      try {
        if (
          mqttWsRef.current &&
          mqttWsRef.current.readyState === WebSocket.OPEN &&
          mqttConnectedRef.current
        ) {
          const pubPacket = buildMqttPublishPacket(mqttTopic, compressedStr, true);
          mqttWsRef.current.send(pubPacket);
          sentViaMqtt = true;
        }
      } catch (e) {}

      // 4. Publish via Engine 2: ntfy.sh inline POST (Port 443 fallback, <100ms WebSocket push!)
      let sentViaNtfy = false;
      try {
        if (compressedStr.length <= 3900) {
          const res = await fetch(`https://ntfy.sh/rjpos_v5_${cleanTopic}`, {
            method: 'POST',
            body: compressedStr
          });
          if (res.ok) sentViaNtfy = true;
        } else {
          const res = await fetch(`https://ntfy.sh/rjpos_v5_${cleanTopic}`, {
            method: 'PUT',
            headers: { Filename: 'sync.txt' },
            body: compressedStr
          });
          if (res.ok) sentViaNtfy = true;
        }
      } catch (e) {}

      // 5. Optional Custom Firebase / REST Endpoint if configured in Advanced Settings
      if (cloudEndpoint && (cloudEndpoint.includes('firebase') || cloudEndpoint.includes('http'))) {
        try {
          if (
            cloudEndpoint.includes('firebaseio.com') ||
            cloudEndpoint.includes('firebasedatabase.app')
          ) {
            const base = cloudEndpoint.trim().replace(/\/+$/, '');
            const authParam = cloudSecret.trim()
              ? `?auth=${encodeURIComponent(cloudSecret.trim())}`
              : '';
            const fbUrl = base + `/ramujaya_workspaces/${targetWs}.json` + authParam;
            await fetch(fbUrl, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
          }
        } catch (e) {}
      }

      if (sentViaMqtt || sentViaNtfy) {
        setCloudStatus('connected');
        setLastSyncTime(new Date().toTimeString().slice(0, 8));
        if (!silent) {
          showToast(`Data toko (${targetWs}) berhasil disinkronkan secara real-time!`);
        }
      } else if (!silent) {
        showToast(
          'Tersimpan di perangkat! Akan otomatis tersinkron saat koneksi internet aktif.',
          'success'
        );
      }
    },
    [buildCurrentSnapshot, workspaceId, cloudEndpoint, cloudSecret]
  );

  // Trigger instant cloud push whenever a local user mutation happens
  useEffect(() => {
    if (localMutationTick === 0) return;
    const snapshot = buildCurrentSnapshot();
    const timer = setTimeout(() => {
      pushToCloud(snapshot, true);
    }, 80);
    return () => clearTimeout(timer);
  }, [localMutationTick]);

  // Persistent Dual-WebSocket Connection Manager (Engine 1: MQTT WSS + Engine 2: ntfy Port-443 WSS)
  useEffect(() => {
    const cleanWs = (workspaceId || 'RAMUJAYA-PUSAT')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, '');
    const cleanTopic = cleanWs.toLowerCase();
    const mqttTopic = `ramujaya/pos/v5/${cleanTopic}`;

    let isUnmounted = false;
    let brokerIdx = 0;
    let mqttSocket = null;
    let mqttPingTimer = null;
    let mqttReconnectTimer = null;

    let ntfySocket = null;
    let ntfyReconnectTimer = null;

    // --- ENGINE 1: PURE-JS MQTT OVER WEBSOCKETS (Sub-50ms + Retained State in Broker RAM) ---
    const connectMqttBroker = () => {
      if (isUnmounted) return;
      const brokerUrl = MQTT_BROKERS[brokerIdx % MQTT_BROKERS.length];
      try {
        mqttSocket = new WebSocket(brokerUrl, 'mqtt');
        mqttSocket.binaryType = 'arraybuffer';
        mqttWsRef.current = mqttSocket;
        mqttConnectedRef.current = false;

        mqttSocket.onopen = () => {
          if (isUnmounted) return;
          const clientId = `rjpos_${deviceIdRef.current}_${Math.floor(Math.random() * 9999)}`;
          mqttSocket.send(buildMqttConnectPacket(clientId));
        };

        mqttSocket.onmessage = async (event) => {
          if (isUnmounted || !(event.data instanceof ArrayBuffer)) return;
          const buf = new Uint8Array(event.data);
          let pos = 0;

          while (pos < buf.length) {
            const headerByte = buf[pos];
            const packetType = headerByte & 0xf0;
            const dec = decodeMqttLength(buf, pos + 1);
            if (!dec) break;
            const frameStart = dec.nextOffset;
            const frameEnd = frameStart + dec.length;
            if (frameEnd > buf.length) break;

            if (packetType === 0x20) {
              // CONNACK received -> Subscribe to store topic immediately!
              mqttConnectedRef.current = true;
              setCloudStatus('connected');
              mqttSocket.send(buildMqttSubscribePacket(mqttTopic, 1));

              if (mqttPingTimer) clearInterval(mqttPingTimer);
              mqttPingTimer = setInterval(() => {
                if (mqttSocket && mqttSocket.readyState === WebSocket.OPEN) {
                  mqttSocket.send(new Uint8Array([0xc0, 0x00])); // MQTT PINGREQ heartbeat
                }
              }, 20000);
            } else if (packetType === 0x30) {
              // PUBLISH frame received
              const qos = (headerByte >> 1) & 0x03;
              let offset = frameStart;
              const topicLen = (buf[offset] << 8) | buf[offset + 1];
              offset += 2 + topicLen;
              if (qos > 0) offset += 2;
              const rawPayloadStr = new TextDecoder().decode(buf.subarray(offset, frameEnd));
              const parsed = await decompressSyncPayload(rawPayloadStr);
              if (parsed && Array.isArray(parsed.branches)) {
                const incomingTs = Number(parsed.updatedAt) || 0;
                if (incomingTs > lastAppliedTimestampRef.current) {
                  // Incoming cloud state is NEWER than our local state -> apply & save!
                  const didApply = applyWorkspaceSnapshot(parsed);
                  if (didApply) {
                    try {
                      localStorage.setItem(`ramujaya_ws_v4_${cleanWs}`, JSON.stringify(parsed));
                      localStorage.setItem('ramujaya_unified_portal_v3', JSON.stringify(parsed));
                    } catch (e) {}
                  }
                } else if (incomingTs < lastAppliedTimestampRef.current) {
                  // Our local state (e.g. recent deletions/edits) is NEWER than the broker's retained state!
                  // Re-publish our newer local state so the broker catches up and never serves stale data!
                  try {
                    const latestLocalRaw = localStorage.getItem(`ramujaya_ws_v4_${cleanWs}`);
                    if (latestLocalRaw && mqttSocket.readyState === WebSocket.OPEN) {
                      const comp = await compressSyncPayload(JSON.parse(latestLocalRaw));
                      mqttSocket.send(buildMqttPublishPacket(mqttTopic, comp, true));
                    }
                  } catch (e) {}
                }
                setCloudStatus('connected');
              }
            }
            pos = frameEnd;
          }
        };

        mqttSocket.onerror = () => {};

        mqttSocket.onclose = () => {
          mqttConnectedRef.current = false;
          if (mqttPingTimer) clearInterval(mqttPingTimer);
          if (!isUnmounted) {
            brokerIdx = (brokerIdx + 1) % MQTT_BROKERS.length;
            mqttReconnectTimer = setTimeout(connectMqttBroker, 2000);
          }
        };
      } catch (e) {
        if (!isUnmounted) {
          brokerIdx = (brokerIdx + 1) % MQTT_BROKERS.length;
          mqttReconnectTimer = setTimeout(connectMqttBroker, 2500);
        }
      }
    };

    // --- ENGINE 2: PORT-443 LIVE WEBSOCKET STREAM (wss://ntfy.sh/.../ws) ---
    const connectNtfyWebSocket = () => {
      if (isUnmounted) return;
      try {
        ntfySocket = new WebSocket(`wss://ntfy.sh/rjpos_v5_${cleanTopic}/ws`);
        ntfyWsRef.current = ntfySocket;

        ntfySocket.onopen = () => {
          if (isUnmounted) return;
          setCloudStatus('connected');
        };

        ntfySocket.onmessage = async (event) => {
          if (isUnmounted) return;
          try {
            const item = JSON.parse(event.data);
            if (item.event !== 'message') return;

            let parsed = null;
            if (item.attachment && item.attachment.url) {
              const res = await fetch(item.attachment.url);
              const txt = await res.text();
              parsed = await decompressSyncPayload(txt);
            } else if (item.message) {
              parsed = await decompressSyncPayload(item.message);
            }

            if (parsed && Array.isArray(parsed.branches)) {
              const incomingTs = Number(parsed.updatedAt) || 0;
              if (incomingTs > lastAppliedTimestampRef.current) {
                const didApply = applyWorkspaceSnapshot(parsed);
                if (didApply) {
                  try {
                    localStorage.setItem(`ramujaya_ws_v4_${cleanWs}`, JSON.stringify(parsed));
                    localStorage.setItem('ramujaya_unified_portal_v3', JSON.stringify(parsed));
                  } catch (e) {}
                }
              }
              setCloudStatus('connected');
            }
          } catch (e) {}
        };

        ntfySocket.onerror = () => {};

        ntfySocket.onclose = () => {
          if (!isUnmounted) {
            ntfyReconnectTimer = setTimeout(connectNtfyWebSocket, 3000);
          }
        };
      } catch (e) {
        if (!isUnmounted) {
          ntfyReconnectTimer = setTimeout(connectNtfyWebSocket, 3500);
        }
      }
    };

    connectMqttBroker();
    connectNtfyWebSocket();

    return () => {
      isUnmounted = true;
      if (mqttPingTimer) clearInterval(mqttPingTimer);
      if (mqttReconnectTimer) clearTimeout(mqttReconnectTimer);
      if (ntfyReconnectTimer) clearTimeout(ntfyReconnectTimer);
      if (mqttSocket) {
        try {
          mqttSocket.close();
        } catch (e) {}
      }
      if (ntfySocket) {
        try {
          ntfySocket.close();
        } catch (e) {}
      }
    };
  }, [workspaceId, applyWorkspaceSnapshot]);

  // Buat Kode Cloud Baru Otomatis (1-Klik di HP Admin)
  const handleCreateAutoCloudCode = async () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newCloudCode = `RJ-${randomNum}`;
    setDraftWorkspaceId(newCloudCode);
    setWorkspaceId(newCloudCode);
    setCloudStatus('connected');

    const snapshot = buildCurrentSnapshot(newCloudCode, null, Date.now());
    try {
      localStorage.setItem(
        'ramujaya_cloud_config_v2',
        JSON.stringify({
          workspaceId: newCloudCode,
          cloudEndpoint,
          cloudSecret
        })
      );
      localStorage.setItem(`ramujaya_ws_v4_${newCloudCode}`, JSON.stringify(snapshot));
      localStorage.setItem('ramujaya_unified_portal_v3', JSON.stringify(snapshot));
    } catch (e) {}

    setTimeout(() => {
      pushToCloud(snapshot, false);
    }, 250);
    showToast(`Kode Toko Baru (${newCloudCode}) aktif! Ketik kode ini di HP Kasir.`);
  };

  // Simpan & Hubungkan ke Kode Toko (Saat tombol "Hubungkan" ditekan)
  const handleSaveCloudConfig = async (e) => {
    e.preventDefault();
    const cleanWs =
      (draftWorkspaceId || workspaceId).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '') ||
      'RAMUJAYA-PUSAT';

    // Jika berganti ke kode toko baru di HP Kasir, reset timestamp lokal agar mau menerima data dari Admin
    if (cleanWs !== workspaceId && role === 'cashier') {
      lastAppliedTimestampRef.current = 0;
    }

    setDraftWorkspaceId(cleanWs);
    setWorkspaceId(cleanWs);
    setCloudStatus('connected');

    try {
      localStorage.setItem(
        'ramujaya_cloud_config_v2',
        JSON.stringify({
          workspaceId: cleanWs,
          cloudEndpoint: cloudEndpoint.trim(),
          cloudSecret: cloudSecret.trim()
        })
      );
    } catch (err) {}

    // Jika yang menekan tombol Hubungkan adalah Admin/Owner, unggah data Admin sebagai master
    if (role === 'owner' || currentUser?.role === 'owner') {
      const snapshot = buildCurrentSnapshot(cleanWs, null, Date.now());
      setTimeout(() => {
        pushToCloud(snapshot, true);
      }, 350);
    }

    setCloudModal(false);
    showToast(`Terhubung secara Real-Time ke Kode Toko "${cleanWs}"!`);
  };

  // Tombol Paksa Kirim Data HP Ini ke Cloud (Khusus Admin untuk memastikan seluruh HP Kasir menerima data terbaru)
  const handleForcePushMasterData = async () => {
    const cleanWs =
      (draftWorkspaceId || workspaceId).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '') ||
      'RAMUJAYA-PUSAT';
    if (cleanWs !== workspaceId) {
      setWorkspaceId(cleanWs);
    }
    const snapshot = buildCurrentSnapshot(cleanWs, null, Date.now());
    await pushToCloud(snapshot, false);
  };

  // Helper membuat link lengkap dengan embedded snapshot agar Kasir 100% langsung terhubung
  const generateFullInviteUrl = () => {
    const cleanWs = (draftWorkspaceId || workspaceId).trim().toUpperCase() || 'RAMUJAYA-PUSAT';
    const baseHref = window.location.origin + window.location.pathname;
    const dbQuery = cloudEndpoint.trim() ? `&db=${encodeURIComponent(cloudEndpoint.trim())}` : '';
    let syncQuery = '';
    try {
      const payload = buildCurrentSnapshot(cleanWs);
      const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      syncQuery = `&sync=${encodeURIComponent(b64)}`;
    } catch (e) {}
    return `${baseHref}?toko=${encodeURIComponent(cleanWs)}${dbQuery}${syncQuery}`;
  };

  // 1-Click WhatsApp Direct Share (Buka Chat WA dan kirim link)
  const handleSendWhatsAppInvite = () => {
    const fullUrl = generateFullInviteUrl();
    const cleanWs = (draftWorkspaceId || workspaceId).trim().toUpperCase() || 'RAMUJAYA-PUSAT';
    const waText = `Halo Kasir, ini Link Akses Aplikasi Ramu Jaya POS Toko "${cleanWs}":\n\n${fullUrl}\n\nKlik link di atas di Google Chrome HP Anda untuk langsung sinkron & mulai melayani pesanan!`;
    const waLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(waLink, '_blank');
    showToast('Membuka WhatsApp untuk mengirim link ke Kasir...');
  };

  // Salin Link Undangan ke Clipboard
  const handleCopyInviteLink = () => {
    const fullInviteUrl = generateFullInviteUrl();
    const cleanWs = (draftWorkspaceId || workspaceId).trim().toUpperCase() || 'RAMUJAYA-PUSAT';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullInviteUrl);
      } else {
        const el = document.createElement('textarea');
        el.value = fullInviteUrl;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
    } catch (e) {}
    showToast(`Link Sinkron Toko (${cleanWs}) berhasil disalin! Kirim via WA ke HP Kasir.`);
  };

  // Salin Kode Toko saja
  const handleCopyStoreCode = () => {
    const codeToCopy = (draftWorkspaceId || workspaceId).trim().toUpperCase();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(codeToCopy);
      }
    } catch (e) {}
    showToast(`Kode Toko (${codeToCopy}) disalin! Ketik kode ini di HP Kasir.`);
  };

  // Generate compact Base64 Sync Code to paste via WhatsApp
  const handleCopyWhatsAppSyncCode = () => {
    try {
      const payload = buildCurrentSnapshot();
      const codeStr = 'RJSYNC:' + btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(codeStr);
      } else {
        const el = document.createElement('textarea');
        el.value = codeStr;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      showToast('Kode Data WhatsApp berhasil disalin! Tempel di HP lain untuk sinkron instan.');
    } catch (err) {
      showToast('Gagal membuat kode sinkron.', 'error');
    }
  };

  const handleApplyWhatsAppSyncCode = () => {
    if (!magicSyncText.trim()) {
      showToast('Tempelkan kode RJSYNC terlebih dahulu!', 'error');
      return;
    }
    try {
      const raw = magicSyncText.trim().replace(/^RJSYNC:/, '');
      const jsonStr = decodeURIComponent(escape(atob(raw)));
      const parsed = JSON.parse(jsonStr);
      parsed.updatedAt = Math.max(Date.now(), Number(parsed.updatedAt) || 0);
      applyWorkspaceSnapshot(parsed, true);
      if (parsed.workspaceId) {
        setWorkspaceId(parsed.workspaceId);
        setDraftWorkspaceId(parsed.workspaceId);
      }
      setMagicSyncText('');
      setCloudModal(false);
      showToast('Seluruh data berhasil disinkronkan dari Kode WhatsApp!');
    } catch (err) {
      showToast('Kode sinkron tidak valid atau tidak lengkap!', 'error');
    }
  };

  // Export & Import JSON Backup for manual transfer between devices or onboarding a new cafe
  const handleExportBackupJson = () => {
    const payload = buildCurrentSnapshot();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${workspaceId.toLowerCase()}.json`;
    a.click();
    showToast(`File cadangan (${a.download}) berhasil diunduh!`);
  };

  const handleImportBackupJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        parsed.updatedAt = Math.max(Date.now(), Number(parsed.updatedAt) || 0);
        applyWorkspaceSnapshot(parsed, true);
        if (parsed.workspaceId) {
          setWorkspaceId(parsed.workspaceId);
          setDraftWorkspaceId(parsed.workspaceId);
        }
        showToast('Data berhasil dipulihkan & disinkronkan dari file cadangan!');
      } catch (err) {
        showToast('Format file backup tidak valid!', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleCopyPortalUrl = () => {
    const fullUrl = `${portalUrl}/login`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullUrl);
      } else {
        const el = document.createElement('textarea');
        el.value = fullUrl;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
    } catch (e) {}
    showToast(`Alamat situs tunggal (${fullUrl}) berhasil disalin!`);
  };

  // Modal Sinkronisasi Real-Time WebSocket (Anti Putus-Nyambung & Sub-100ms)
  const renderCloudSyncModal = () => {
    if (!cloudModal) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 text-stone-800">
        <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[92vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Sinkronisasi Real-Time HP Admin &amp; HP Kasir
                </h3>
                <p className="text-xs text-stone-500">
                  Koneksi WebSocket langsung (&lt;0,1 detik) • Anti Putus-Nyambung
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCloudModal(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Koneksi Stabil */}
          <div className="p-3 rounded-xl border bg-emerald-50 border-emerald-300 text-emerald-900 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                ⚡ Live WebSocket Aktif: <strong>{workspaceId}</strong>
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-mono">
              Update: {lastSyncTime}
            </span>
          </div>

          {/* PETUNJUK UTAMA: KONEKSI DENGAN KODE TOKO */}
          <form onSubmit={handleSaveCloudConfig} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-400 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="font-extrabold text-amber-950 text-xs block">
                    1. Kode Toko Real-Time (Sama di HP Admin &amp; HP Kasir):
                  </span>
                  <span className="text-[11px] text-stone-600">
                    Ketik kode toko lalu tekan <strong>Hubungkan</strong>
                  </span>
                </div>
                {(role === 'owner' || currentUser?.role === 'owner') && (
                  <button
                    type="button"
                    onClick={handleCreateAutoCloudCode}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-sm transition flex items-center gap-1 shrink-0"
                  >
                    <RefreshCw className="w-3 h-3" /> Buat Kode Baru
                  </button>
                )}
              </div>

              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={draftWorkspaceId}
                    onChange={(e) => setDraftWorkspaceId(e.target.value.toUpperCase())}
                    placeholder="Contoh: KAFE1 atau RJ-4821"
                    className="flex-1 px-3 py-2.5 bg-white border-2 border-amber-300 rounded-xl font-mono font-extrabold text-sm text-stone-900 text-center uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleCopyStoreCode}
                    className="px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs shrink-0"
                    title="Salin Kode Toko"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs shrink-0 shadow-sm"
                  >
                    Hubungkan
                  </button>
                </div>
              </div>

              {(role === 'owner' || currentUser?.role === 'owner') && (
                <button
                  type="button"
                  onClick={handleForcePushMasterData}
                  className="w-full py-2 rounded-xl bg-amber-600/15 hover:bg-amber-600/25 text-amber-950 border border-amber-400 font-bold text-[11px] flex items-center justify-center gap-1.5 transition"
                >
                  <Cloud className="w-3.5 h-3.5 text-amber-700" />
                  Kirim / Paksa Sinkron Data HP Admin Ini ke Semua HP Kasir Sekarang
                </button>
              )}
            </div>

            {/* OPSI 2: 1 KLIK VIA WHATSAPP / QR CODE */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border-2 border-emerald-400 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-emerald-950 text-xs">
                  2. Cara Instan: Kirim Link ke WhatsApp Kasir
                </span>
              </div>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                Kasir cukup mengetuk link yang dikirim di WhatsApp untuk otomatis masuk ke Kode Toko yang sama beserta seluruh menu &amp; stok terbaru.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSendWhatsAppInvite}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Share2 className="w-4 h-4" /> Buka WA &amp; Kirim ke Kasir
                </button>
                <button
                  type="button"
                  onClick={handleCopyInviteLink}
                  className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" /> Salin Link Undangan
                </button>
              </div>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="text-[11px] text-emerald-800 font-bold hover:underline inline-flex items-center gap-1"
                >
                  📱 Tampilkan QR Code (Untuk di-scan kamera HP Kasir)
                </button>
              </div>
            </div>

            {/* CARA CADANGAN: SALIN & TEMPEL KODE TEKS VIA WA */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-stone-800">
                    Cara Cadangan: Salin &amp; Tempel Kode Teks
                  </p>
                  <p className="text-[10px] text-stone-500">
                    Bisa digunakan jika sedang tanpa koneksi server
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyWhatsAppSyncCode}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-[11px] flex items-center gap-1 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" /> Salin Data
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={magicSyncText}
                  onChange={(e) => setMagicSyncText(e.target.value)}
                  placeholder="Tempel kode RJSYNC:... di sini"
                  className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl font-mono text-[11px]"
                />
                <button
                  type="button"
                  onClick={handleApplyWhatsAppSyncCode}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shrink-0"
                >
                  Terapkan
                </button>
              </div>
            </div>

            {/* OPSI LANJUTAN: FIREBASE & BACKUP FILE */}
            <div className="pt-1 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowAdvancedCloud(!showAdvancedCloud)}
                className="text-[11px] text-stone-400 hover:text-stone-600 font-semibold flex items-center gap-1"
              >
                <Settings className="w-3 h-3" />
                {showAdvancedCloud
                  ? 'Sembunyikan Pengaturan Lanjutan'
                  : 'Pengaturan Lanjutan (Firebase Kustom / Backup File JSON)'}
              </button>

              {showAdvancedCloud && (
                <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      URL Endpoint Firebase Realtime Database (Opsional)
                    </label>
                    <input
                      type="url"
                      value={cloudEndpoint}
                      onChange={(e) => setCloudEndpoint(e.target.value)}
                      placeholder="https://nama-project.firebaseio.com"
                      className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg font-mono text-[11px]"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-stone-500">Backup File JSON:</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={handleExportBackupJson}
                        className="px-2.5 py-1 rounded bg-white border border-stone-300 text-stone-700 font-bold text-[11px]"
                      >
                        Download File
                      </button>
                      <label className="px-2.5 py-1 rounded bg-stone-800 text-white font-bold text-[11px] cursor-pointer">
                        Upload File
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportBackupJson}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Modal QR Code Pairing Instan untuk HP Kasir
  const renderQrCodeModal = () => {
    if (!showQrModal) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 text-stone-800">
        <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-4 text-center">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h3 className="font-bold text-base text-stone-900">
              Scan QR Code untuk Sinkron
            </h3>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-stone-600">
              Buka kamera HP Kasir dan arahkan ke QR Code ini:
            </p>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                  generateFullInviteUrl()
                )}`}
                alt="QR Code Pairing Kasir"
                className="w-48 h-48 mx-auto rounded-lg"
              />
            </div>
            <p className="text-[11px] font-mono text-stone-500">
              Toko: <strong>{workspaceId}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowQrModal(false)}
            className="w-full py-2 rounded-xl bg-stone-900 text-white text-xs font-bold"
          >
            Tutup QR Code
          </button>
        </div>
      </div>
    );
  };

  // Enforce strict role access: karyawan (cashier) is ONLY allowed on 'pos' (transaksi penjualan saja)
  useEffect(() => {
    if (role === 'cashier' && activeTab !== 'pos') {
      setActiveTab('pos');
    }
    if (role === 'cashier') {
      setReportBranchFilter(selectedBranchId);
    }
  }, [role, activeTab, selectedBranchId]);

  // Automatically persist active login position (user, role, branch, activeTab) on refresh / app exit
  useEffect(() => {
    try {
      if (currentUser) {
        const effectiveRole = currentUser.role || role;
        const effectiveTab = effectiveRole === 'cashier' ? 'pos' : activeTab;
        localStorage.setItem(
          'ramujaya_auth_session_v1',
          JSON.stringify({
            currentUser,
            role: effectiveRole,
            selectedBranchId,
            activeTab: effectiveTab
          })
        );
      }
    } catch (e) {}
  }, [currentUser, role, selectedBranchId, activeTab]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const found = users.find(
      (u) =>
        u.username.toLowerCase() === loginUsername.trim().toLowerCase() &&
        u.pin === loginPin.trim()
    );
    if (!found) {
      setLoginError('Username atau PIN salah! Silakan cek kembali.');
      return;
    }
    const targetBranch =
      found.role === 'cashier' && found.branchId !== 'ALL' ? found.branchId : selectedBranchId;
    setLoginError('');
    setCurrentUser(found);
    setRole(found.role);
    setActiveTab('pos');
    setCart([]);
    if (found.role === 'cashier' && found.branchId !== 'ALL') {
      setSelectedBranchId(found.branchId);
    }
    try {
      localStorage.setItem(
        'ramujaya_auth_session_v1',
        JSON.stringify({
          currentUser: found,
          role: found.role,
          selectedBranchId: targetBranch,
          activeTab: 'pos'
        })
      );
    } catch (err) {}
    showToast(`Selamat bertugas, ${found.name}!`);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('ramujaya_auth_session_v1');
    } catch (err) {}
    setCurrentUser(null);
    setLoginUsername('');
    setLoginPin('');
    setLoginError('');
    setCart([]);
    setActiveTab('pos');
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.username.trim() || !newUserForm.pin.trim()) {
      showToast('Semua kolom akun wajib diisi!', 'error');
      return;
    }
    if (
      users.some(
        (u) => u.username.toLowerCase() === newUserForm.username.trim().toLowerCase()
      )
    ) {
      showToast('Username sudah digunakan, pilih username lain!', 'error');
      return;
    }
    const createdUser = {
      id: `usr-${Date.now()}`,
      name: newUserForm.name.trim(),
      username: newUserForm.username.trim().toLowerCase(),
      pin: newUserForm.pin.trim(),
      role: newUserForm.role,
      branchId: newUserForm.role === 'owner' ? 'ALL' : newUserForm.branchId
    };
    setUsers([...users, createdUser]);
    markLocalMutation();
    setNewUserModal(false);
    setNewUserForm({
      name: '',
      username: '',
      pin: '',
      role: 'cashier',
      branchId: selectedBranchId
    });
    showToast(`Akun ${createdUser.name} berhasil ditambahkan!`);
  };

  const handleDeleteUser = (userId) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    if (target.id === currentUser?.id) {
      showToast('Tidak dapat menghapus akun yang sedang digunakan!', 'error');
      return;
    }
    setUsers(users.filter((u) => u.id !== userId));
    markLocalMutation();
    showToast(`Akun ${target.name} telah dihapus.`);
  };

  const canAddMenuToCart = () => {
    return { allowed: true };
  };

  // --- POS HANDLERS ---
  const handleAddToCart = (menu) => {
    const existing = cart.find((c) => c.menu.id === menu.id);
    const nextQty = existing ? existing.qty + 1 : 1;
    const check = canAddMenuToCart(menu, nextQty);
    if (!check.allowed) {
      showToast(check.reason, 'error');
      return;
    }
    if (existing) {
      setCart(cart.map((c) => (c.menu.id === menu.id ? { ...c, qty: nextQty } : c)));
    } else {
      setCart([...cart, { menu, qty: 1 }]);
    }
  };

  const handleUpdateCartQty = (menuId, delta) => {
    const item = cart.find((c) => c.menu.id === menuId);
    if (!item) return;
    const nextQty = item.qty + delta;
    if (nextQty <= 0) {
      setCart(cart.filter((c) => c.menu.id !== menuId));
      return;
    }
    if (delta > 0) {
      const check = canAddMenuToCart(item.menu, nextQty);
      if (!check.allowed) {
        showToast(check.reason, 'error');
        return;
      }
    }
    setCart(cart.map((c) => (c.menu.id === menuId ? { ...c, qty: nextQty } : c)));
  };

  const cartSummary = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + item.menu.price * item.qty, 0);
    const discountAmount = Math.round((subtotal * (Number(discountPercent) || 0)) / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = enableTax ? Math.round(afterDiscount * 0.1) : 0;
    const total = afterDiscount + taxAmount;
    const paid = paymentMethod === 'Tunai' ? Number(cashReceived) || 0 : total;
    const change = paymentMethod === 'Tunai' ? Math.max(0, paid - total) : 0;
    return { subtotal, discountAmount, taxAmount, total, paid, change };
  }, [cart, discountPercent, enableTax, paymentMethod, cashReceived]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Keranjang pesanan masih kosong!', 'error');
      return;
    }
    if (paymentMethod === 'Tunai' && (Number(cashReceived) || 0) < cartSummary.total) {
      showToast('Nominal uang tunai kurang dari total tagihan!', 'error');
      return;
    }

    const trxId = `TRX-2610-${String(transactions.length + 1).padStart(3, '0')}`;
    const nowStr = '2026-10-24 ' + new Date().toTimeString().slice(0, 5);

    const newTrx = {
      id: trxId,
      branchId: selectedBranchId,
      timestamp: nowStr,
      cashier: currentUser ? currentUser.name : role === 'owner' ? 'Admin / Owner' : `Kasir ${currentBranch.name}`,
      orderType,
      tableNumber: orderType === 'Dine-In' ? tableNumber : '-',
      customerName: customerName.trim() || 'Pelanggan Umum',
      paymentMethod,
      items: cart.map((c) => ({
        menuId: c.menu.id,
        name: c.menu.name,
        price: c.menu.price,
        hpp: Number(c.menu.hpp) || 0,
        qty: c.qty
      })),
      subtotal: cartSummary.subtotal,
      discountPercent: Number(discountPercent) || 0,
      discountAmount: cartSummary.discountAmount,
      taxAmount: cartSummary.taxAmount,
      total: cartSummary.total,
      paidAmount: cartSummary.paid,
      changeAmount: cartSummary.change
    };

    setTransactions([newTrx, ...transactions]);
    markLocalMutation();
    setActiveReceipt(newTrx);
    if (autoPrintReceipt && btCharacteristic && btDevice?.gatt?.connected) {
      handlePrintBluetoothReceipt(newTrx);
    }

    // Reset POS
    setCart([]);
    setCustomerName('');
    setDiscountPercent(0);
    setCashReceived('');
    showToast(`Transaksi ${trxId} berhasil disimpan!`);
  };

  // --- INVENTORY HANDLERS ---
  const handleRestockSubmit = (e) => {
    e.preventDefault();
    const qtyNum = Number(restockForm.qty);
    const costNum = Number(restockForm.totalCost);
    if (!qtyNum || qtyNum <= 0) {
      showToast('Masukkan jumlah belanja bahan yang valid!', 'error');
      return;
    }

    const ing = ingredients.find((i) => i.id === restockForm.ingredientId);
    const currentBranchStock = branchStocks[selectedBranchId] || {};
    const newQty = (currentBranchStock[restockForm.ingredientId] || 0) + qtyNum;

    setBranchStocks({
      ...branchStocks,
      [selectedBranchId]: {
        ...currentBranchStock,
        [restockForm.ingredientId]: newQty
      }
    });

    // Update average cost per unit if costNum provided
    if (costNum > 0 && ing) {
      const newUnitCost = Math.round(costNum / qtyNum);
      setIngredients(
        ingredients.map((item) =>
          item.id === ing.id ? { ...item, costPerUnit: newUnitCost } : item
        )
      );
    }

    const nowStr = '2026-10-24 ' + new Date().toTimeString().slice(0, 5);
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: nowStr,
      branchId: selectedBranchId,
      type: 'Restock Mandiri',
      ingredientId: restockForm.ingredientId,
      ingredientName: ing ? ing.name : '',
      qtyChange: qtyNum,
      unit: ing ? ing.unit : '',
      totalCost: costNum || 0,
      supplier: restockForm.supplier.trim() || 'Pembelian Langsung Cabang',
      note: restockForm.note.trim() || `Belanja mandiri ${currentBranch.name}`
    };

    setStockLogs([newLog, ...stockLogs]);
    markLocalMutation();
    setRestockModal(false);
    setRestockForm({
      ingredientId: ingredients[0]?.id || 'ing-1',
      qty: '',
      totalCost: '',
      supplier: '',
      note: ''
    });
    showToast(`Stok ${ing?.name} berhasil ditambahkan ke ${currentBranch.name}!`);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    const { fromBranchId, toBranchId, ingredientId, qty, note } = transferForm;
    const qtyNum = Number(qty);
    if (fromBranchId === toBranchId) {
      showToast('Cabang asal dan cabang tujuan tidak boleh sama!', 'error');
      return;
    }
    if (!qtyNum || qtyNum <= 0) {
      showToast('Jumlah transfer harus lebih dari 0!', 'error');
      return;
    }

    const sourceStock = branchStocks[fromBranchId]?.[ingredientId] || 0;
    if (qtyNum > sourceStock) {
      showToast('Stok di cabang asal tidak mencukupi untuk ditransfer!', 'error');
      return;
    }

    const ing = ingredients.find((i) => i.id === ingredientId);
    const fromBranch = branches.find((b) => b.id === fromBranchId);
    const toBranch = branches.find((b) => b.id === toBranchId);

    setBranchStocks({
      ...branchStocks,
      [fromBranchId]: {
        ...(branchStocks[fromBranchId] || {}),
        [ingredientId]: sourceStock - qtyNum
      },
      [toBranchId]: {
        ...(branchStocks[toBranchId] || {}),
        [ingredientId]: (branchStocks[toBranchId]?.[ingredientId] || 0) + qtyNum
      }
    });

    const nowStr = '2026-10-24 ' + new Date().toTimeString().slice(0, 5);
    const outLog = {
      id: `LOG-${Date.now()}-OUT`,
      timestamp: nowStr,
      branchId: fromBranchId,
      type: 'Mutasi Keluar',
      ingredientId,
      ingredientName: ing?.name || '',
      qtyChange: -qtyNum,
      unit: ing?.unit || '',
      totalCost: 0,
      supplier: `Ke ${toBranch?.name}`,
      note: note.trim() || `Transfer stok ke ${toBranch?.name}`
    };
    const inLog = {
      id: `LOG-${Date.now()}-IN`,
      timestamp: nowStr,
      branchId: toBranchId,
      type: 'Mutasi Masuk',
      ingredientId,
      ingredientName: ing?.name || '',
      qtyChange: qtyNum,
      unit: ing?.unit || '',
      totalCost: 0,
      supplier: `Dari ${fromBranch?.name}`,
      note: note.trim() || `Terima transfer dari ${fromBranch?.name}`
    };

    setStockLogs([inLog, outLog, ...stockLogs]);
    markLocalMutation();
    setTransferModal(false);
    setTransferForm({
      fromBranchId: selectedBranchId,
      toBranchId: branches.find((b) => b.id !== selectedBranchId)?.id || 'br-2',
      ingredientId: 'ing-1',
      qty: '',
      note: ''
    });
    showToast(`Berhasil transfer ${qtyNum} ${ing?.unit} ${ing?.name} dari ${fromBranch?.name} ke ${toBranch?.name}!`);
  };

  const handleOpnameSubmit = (e) => {
    e.preventDefault();
    if (!opnameModal) return;
    const actual = Number(opnameActualQty);
    if (isNaN(actual) || actual < 0) {
      showToast('Masukkan angka stok fisik yang valid!', 'error');
      return;
    }
    const systemQty = branchStocks[selectedBranchId]?.[opnameModal.id] || 0;
    const diff = actual - systemQty;

    setBranchStocks({
      ...branchStocks,
      [selectedBranchId]: {
        ...(branchStocks[selectedBranchId] || {}),
        [opnameModal.id]: actual
      }
    });

    const nowStr = '2026-10-24 ' + new Date().toTimeString().slice(0, 5);
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: nowStr,
      branchId: selectedBranchId,
      type: 'Stok Opname',
      ingredientId: opnameModal.id,
      ingredientName: opnameModal.name,
      qtyChange: diff,
      unit: opnameModal.unit,
      totalCost: 0,
      supplier: '-',
      note: opnameNote.trim() || `Penyesuaian fisik (Sistem: ${systemQty} -> Fisik: ${actual})`
    };

    setStockLogs([newLog, ...stockLogs]);
    markLocalMutation();
    setOpnameModal(null);
    setOpnameActualQty('');
    setOpnameNote('');
    showToast(`Stok fisik ${opnameModal.name} di ${currentBranch.name} telah disesuaikan!`);
  };

  const handleCreateIngredient = (e) => {
    e.preventDefault();
    if (!newIngForm.name.trim()) {
      showToast('Nama bahan baku wajib diisi!', 'error');
      return;
    }
    const newId = `ing-${Date.now()}`;
    const newIng = {
      id: newId,
      name: newIngForm.name.trim(),
      unit: newIngForm.unit,
      minStock: Number(newIngForm.minStock) || 100,
      costPerUnit: Number(newIngForm.costPerUnit) || 0,
      category: newIngForm.category
    };

    setIngredients([...ingredients, newIng]);

    // Initialize stock across branches (initialStock for current branch, 0 for others)
    const updatedStocks = { ...branchStocks };
    branches.forEach((b) => {
      updatedStocks[b.id] = {
        ...(updatedStocks[b.id] || {}),
        [newId]: b.id === selectedBranchId ? Number(newIngForm.initialStock) || 0 : 0
      };
    });
    setBranchStocks(updatedStocks);
    markLocalMutation();
    setNewIngModal(false);
    setNewIngForm({
      name: '',
      unit: 'gr',
      minStock: 500,
      costPerUnit: 100,
      category: 'Bahan Minuman',
      initialStock: 1000
    });
    showToast(`Bahan baku "${newIng.name}" berhasil ditambahkan!`);
  };

  // Hapus master bahan baku / stok 1 per 1
  const handleDeleteIngredient = (ingId) => {
    const target = ingredients.find((i) => i.id === ingId);
    if (!target) return;
    setIngredients(ingredients.filter((i) => i.id !== ingId));
    // Bersihkan stok bahan ini di seluruh cabang
    const nextStocks = { ...branchStocks };
    Object.keys(nextStocks).forEach((bId) => {
      if (nextStocks[bId]) {
        const branchStock = { ...nextStocks[bId] };
        delete branchStock[ingId];
        nextStocks[bId] = branchStock;
      }
    });
    setBranchStocks(nextStocks);
    markLocalMutation();
    showToast(`Bahan baku "${target.name}" berhasil dihapus.`);
  };

  // --- MENU & MANUAL HPP HANDLERS ---
  const activeMenuRecipeObj = useMemo(
    () => menus.find((m) => m.id === selectedMenuForRecipe) || menus[0],
    [menus, selectedMenuForRecipe]
  );

  const calculateMenuHPP = (menu) => {
    return Number(menu?.hpp) || 0;
  };

  const handleUpdateMenuField = (menuId, field, value) => {
    markLocalMutation();
    setMenus(
      menus.map((m) => {
        if (m.id !== menuId) return m;
        if (field === 'price' || field === 'hpp') {
          return { ...m, [field]: Math.max(0, Number(value) || 0) };
        }
        return { ...m, [field]: value };
      })
    );
  };

  const handleDeleteMenu = (menuId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const target = menus.find((m) => m.id === menuId);
    if (!target) return;
    const remaining = menus.filter((m) => m.id !== menuId);
    setMenus(remaining);
    markLocalMutation();
    setCart((prevCart) => prevCart.filter((c) => c.menu.id !== menuId));
    if (selectedMenuForRecipe === menuId) {
      setSelectedMenuForRecipe(remaining[0]?.id || '');
    }
    showToast(`Menu "${target.name}" berhasil dihapus.`);
  };

  const handleCreateNewMenu = (e) => {
    e.preventDefault();
    if (!newMenuForm.name.trim()) {
      showToast('Nama menu wajib diisi!', 'error');
      return;
    }
    const newId = `mn-${Date.now()}`;
    const created = {
      id: newId,
      name: newMenuForm.name.trim(),
      category: newMenuForm.category,
      hpp: Math.max(0, Number(newMenuForm.hpp) || 0),
      price: Math.max(0, Number(newMenuForm.price) || 0),
      icon: newMenuForm.icon
    };
    setMenus([...menus, created]);
    markLocalMutation();
    setSelectedMenuForRecipe(newId);
    setNewMenuModal(false);
    setNewMenuForm({
      name: '',
      category: 'Kopi',
      hpp: 10000,
      price: 25000,
      icon: 'coffee'
    });
    showToast(`Menu baru "${created.name}" dengan HPP & Harga Jual manual berhasil disimpan!`);
  };

  // --- NEW & EDIT BRANCH HANDLERS ---
  const handleCreateBranch = (e) => {
    e.preventDefault();
    if (!newBranchForm.name.trim()) {
      showToast('Nama cabang wajib diisi!', 'error');
      return;
    }
    const newId = `br-${Date.now()}`;
    const cName = newBranchForm.cafeName.trim() || newBranchForm.name.trim();
    const rName = (newBranchForm.receiptName.trim() || cName).toUpperCase();
    const createdBranch = {
      id: newId,
      name: newBranchForm.name.trim(),
      cafeName: cName,
      receiptName: rName,
      address: newBranchForm.address.trim() || 'Alamat belum diatur',
      phone: newBranchForm.phone.trim() || '-',
      tables: Number(newBranchForm.tables) || 10,
      manager: newBranchForm.manager.trim() || 'Kepala Cabang'
    };

    // Initialize default stock for the new branch
    const initStock = {};
    ingredients.forEach((ing) => {
      initStock[ing.id] = ing.minStock * 2;
    });

    setBranches([...branches, createdBranch]);
    markLocalMutation();
    setBranchStocks({
      ...branchStocks,
      [newId]: initStock
    });
    setSelectedBranchId(newId);
    setNewBranchModal(false);
    setNewBranchForm({
      name: '',
      cafeName: '',
      receiptName: '',
      address: '',
      phone: '',
      tables: 10,
      manager: ''
    });
    showToast(`Cabang baru "${createdBranch.cafeName}" berhasil dibuka!`);
  };

  const handleEditBranchSubmit = (e) => {
    e.preventDefault();
    if (!editBranchModal || !editBranchModal.name.trim()) {
      showToast('Nama cabang wajib diisi!', 'error');
      return;
    }
    const updated = {
      ...editBranchModal,
      name: editBranchModal.name.trim(),
      cafeName: editBranchModal.cafeName?.trim() || editBranchModal.name.trim(),
      receiptName: (
        editBranchModal.receiptName?.trim() ||
        editBranchModal.cafeName?.trim() ||
        editBranchModal.name.trim()
      ).toUpperCase(),
      address: editBranchModal.address?.trim() || '-',
      phone: editBranchModal.phone?.trim() || '-',
      tables: Number(editBranchModal.tables) || 10,
      manager: editBranchModal.manager?.trim() || '-'
    };
    setBranches(branches.map((b) => (b.id === updated.id ? updated : b)));
    markLocalMutation();
    setEditBranchModal(null);
    showToast(`Identitas kafe & nama struk untuk "${updated.name}" berhasil diperbarui!`);
  };

  const handleConfirmDeleteBranch = () => {
    if (!deleteBranchModal) return;
    if (branches.length <= 1) {
      showToast('Tidak dapat menghapus cabang terakhir! Minimal harus ada 1 cabang aktif.', 'error');
      setDeleteBranchModal(null);
      return;
    }
    const targetId = deleteBranchModal.id;
    const targetName = deleteBranchModal.cafeName || deleteBranchModal.name;
    const remainingBranches = branches.filter((b) => b.id !== targetId);

    setBranches(remainingBranches);
    if (selectedBranchId === targetId) {
      setSelectedBranchId(remainingBranches[0].id);
    }
    if (reportBranchFilter === targetId) {
      setReportBranchFilter('ALL');
    }

    // Clean up stock, transactions, logs, and cashier accounts tied to the closed branch
    const nextStocks = { ...branchStocks };
    delete nextStocks[targetId];
    setBranchStocks(nextStocks);
    setTransactions(transactions.filter((t) => t.branchId !== targetId));
    setStockLogs(stockLogs.filter((l) => l.branchId !== targetId));
    setUsers(users.filter((u) => u.role === 'owner' || u.branchId !== targetId));

    markLocalMutation();
    setDeleteBranchModal(null);
    showToast(`Cabang "${targetName}" beserta data terkait berhasil dihapus.`);
  };

  const handleConfirmResetReports = () => {
    if (!resetReportModal) return;
    const { scope, target } = resetReportModal;
    const branchLabel =
      scope === 'ALL'
        ? 'Semua Cabang'
        : branches.find((b) => b.id === scope)?.name || 'Cabang';

    if (target === 'all' || target === 'trx') {
      if (scope === 'ALL') {
        setTransactions([]);
      } else {
        setTransactions(transactions.filter((t) => t.branchId !== scope));
      }
    }

    if (target === 'all' || target === 'logs') {
      if (scope === 'ALL') {
        setStockLogs([]);
      } else {
        setStockLogs(stockLogs.filter((l) => l.branchId !== scope));
      }
    }

    const nowReset = Date.now();
    lastResetAtRef.current = nowReset;
    setLastResetAt(nowReset);
    markLocalMutation();
    setResetReportModal(null);
    showToast(`Riwayat laporan & mutasi (${branchLabel}) berhasil di-reset!`);
  };

  // Download Laporan Transaksi, Laba Bersih & Mutasi Stok ke File Excel (.xls)
  const handleDownloadExcelReport = () => {
    try {
      const branchLabel =
        reportBranchFilter === 'ALL'
          ? 'Semua Cabang (Konsolidasi)'
          : branches.find((b) => b.id === reportBranchFilter)?.name || reportBranchFilter;
      const slug =
        reportBranchFilter === 'ALL'
          ? 'semua-cabang'
          : (branches.find((b) => b.id === reportBranchFilter)?.name || 'cabang')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-');
      const nowDate = new Date().toISOString().slice(0, 10);

      const escapeHtml = (val) =>
        String(val ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');

      const trxRowsHtml =
        filteredTransactions.length === 0
          ? '<tr><td colspan="13" style="text-align:center;">Belum ada data transaksi penjualan</td></tr>'
          : filteredTransactions
              .map((t, idx) => {
                const bObj = branches.find((b) => b.id === t.branchId);
                const bName = bObj ? `${bObj.cafeName || bObj.name} (${bObj.name})` : t.branchId;
                const trxHpp = getTransactionHPP(t);
                const total = Number(t.total) || 0;
                const tax = Number(t.taxAmount) || 0;
                const sub = Number(t.subtotal) || 0;
                const disc = Number(t.discountAmount) || 0;
                const labaBersih = total - tax - trxHpp;
                const itemSummary = (t.items || [])
                  .map((i) => `${i.qty}x ${i.name}`)
                  .join(', ');
                return `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${escapeHtml(t.id)}</td>
                    <td>${escapeHtml(t.timestamp)}</td>
                    <td>${escapeHtml(bName)}</td>
                    <td>${escapeHtml(t.cashier || '-')}</td>
                    <td>${escapeHtml(t.customerName || 'Pelanggan Umum')}</td>
                    <td>${escapeHtml(t.orderType || '-')}${t.tableNumber && t.tableNumber !== '-' ? ' (' + escapeHtml(t.tableNumber) + ')' : ''}</td>
                    <td>${escapeHtml(itemSummary)}</td>
                    <td>${escapeHtml(t.paymentMethod || '-')}</td>
                    <td style="text-align:right;">${sub}</td>
                    <td style="text-align:right;">${disc}</td>
                    <td style="text-align:right;">${tax}</td>
                    <td style="text-align:right;font-weight:bold;">${total}</td>
                    <td style="text-align:right;">${trxHpp}</td>
                    <td style="text-align:right;font-weight:bold;color:#047857;">${labaBersih}</td>
                  </tr>`;
              })
              .join('');

      const logRowsHtml =
        filteredStockLogs.length === 0
          ? '<tr><td colspan="9" style="text-align:center;">Belum ada riwayat mutasi stok</td></tr>'
          : filteredStockLogs
              .map((l, idx) => {
                const bObj = branches.find((b) => b.id === l.branchId);
                const bName = bObj ? `${bObj.cafeName || bObj.name} (${bObj.name})` : l.branchId;
                const qtyChange = Number(l.qtyChange) || 0;
                const cost = Number(l.totalCost) || 0;
                return `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${escapeHtml(l.id)}</td>
                    <td>${escapeHtml(l.timestamp)}</td>
                    <td>${escapeHtml(bName)}</td>
                    <td>${escapeHtml(l.type)}</td>
                    <td>${escapeHtml(l.ingredientName)}</td>
                    <td style="text-align:right;font-weight:bold;">${qtyChange > 0 ? '+' + qtyChange : qtyChange} ${escapeHtml(l.unit || '')}</td>
                    <td style="text-align:right;">${cost}</td>
                    <td>${escapeHtml(l.supplier || '-')} — ${escapeHtml(l.note || '-')}</td>
                  </tr>`;
              })
              .join('');

      const excelHtml = `﻿<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; font-size: 11pt; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 8px; }
          th { background-color: #1c1917; color: #ffffff; font-weight: bold; text-align: left; }
          .section-title { font-size: 13pt; font-weight: bold; margin: 14px 0 6px 0; color: #1c1917; }
          .summary-label { font-weight: bold; background-color: #f5f5f4; width: 260px; }
          .profit-row { background-color: #ecfdf5; font-weight: bold; color: #047857; }
        </style>
      </head>
      <body>
        <h2>LAPORAN TRANSAKSI, LABA BERSIH &amp; MUTASI STOK — RAMU JAYA POS</h2>
        <p><strong>Cakupan Cabang:</strong> ${escapeHtml(branchLabel)} | <strong>Tanggal Unduh:</strong> ${nowDate}</p>

        <div class="section-title">1. RINGKASAN KEUANGAN &amp; LABA BERSIH</div>
        <table>
          <tr><td class="summary-label">Total Transaksi Penjualan</td><td>${filteredTransactions.length} Struk</td></tr>
          <tr><td class="summary-label">Total Omzet Kotor (Termasuk PB1)</td><td>Rp ${reportMetrics.totalOmzet.toLocaleString('id-ID')}</td></tr>
          <tr><td class="summary-label">Total Pajak PB1 (10%)</td><td>Rp ${reportMetrics.totalTax.toLocaleString('id-ID')}</td></tr>
          <tr><td class="summary-label">Penjualan Bersih (Diluar Pajak)</td><td>Rp ${reportMetrics.netRevenueExTax.toLocaleString('id-ID')}</td></tr>
          <tr><td class="summary-label">Total Modal Pokok (HPP Menu Terjual)</td><td>Rp ${reportMetrics.totalHPP.toLocaleString('id-ID')}</td></tr>
          <tr class="profit-row"><td class="summary-label">LABA BERSIH PENJUALAN (Omzet Bersih - HPP)</td><td>Rp ${reportMetrics.labaBersihPenjualan.toLocaleString('id-ID')}</td></tr>
          <tr><td class="summary-label">Total Pengeluaran Belanja Restock Stok</td><td>Rp ${reportMetrics.totalRestockSpend.toLocaleString('id-ID')}</td></tr>
          <tr class="profit-row"><td class="summary-label">SISA KAS BERSIH (Omzet - HPP - Belanja Restock)</td><td>Rp ${reportMetrics.kasBersihSetelahRestock.toLocaleString('id-ID')}</td></tr>
        </table>

        <div class="section-title">2. RIWAYAT TRANSAKSI PENJUALAN &amp; LABA BERSIH PER STRUK</div>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>No. Struk</th>
              <th>Waktu</th>
              <th>Cabang</th>
              <th>Kasir</th>
              <th>Pelanggan</th>
              <th>Layanan / Meja</th>
              <th>Rincian Menu Terjual</th>
              <th>Metode Bayar</th>
              <th>Subtotal (Rp)</th>
              <th>Diskon (Rp)</th>
              <th>Pajak PB1 (Rp)</th>
              <th>Total Omzet (Rp)</th>
              <th>Modal HPP (Rp)</th>
              <th>Laba Bersih (Rp)</th>
            </tr>
          </thead>
          <tbody>
            ${trxRowsHtml}
          </tbody>
        </table>

        <div class="section-title">3. RIWAYAT LOG MUTASI &amp; BELANJA STOK BAHAN BAKU</div>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>ID Log</th>
              <th>Waktu</th>
              <th>Cabang</th>
              <th>Jenis Mutasi</th>
              <th>Nama Bahan Baku</th>
              <th>Perubahan Stok</th>
              <th>Biaya Belanja (Rp)</th>
              <th>Supplier / Keterangan</th>
            </tr>
          </thead>
          <tbody>
            ${logRowsHtml}
          </tbody>
        </table>
      </body>
      </html>`;

      const blob = new Blob([excelHtml], {
        type: 'application/vnd.ms-excel;charset=utf-8'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Laporan-Mutasi-RamuJaya-${slug}-${nowDate}.xls`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      showToast(`Laporan Excel (${a.download}) berhasil diunduh!`);
    } catch (err) {
      showToast('Gagal mengunduh file Excel.', 'error');
    }
  };

  // Helper calculate total HPP for a transaction
  const getTransactionHPP = (trx) => {
    if (!trx?.items) return 0;
    return trx.items.reduce((sum, item) => {
      const itemHpp =
        item.hpp !== undefined
          ? Number(item.hpp)
          : Number(menus.find((m) => m.id === item.menuId || m.name === item.name)?.hpp) || 0;
      return sum + itemHpp * (Number(item.qty) || 0);
    }, 0);
  };

  // --- ANALYTICS & REPORTS ---
  const filteredTransactions = useMemo(() => {
    if (reportBranchFilter === 'ALL') return transactions;
    return transactions.filter((t) => t.branchId === reportBranchFilter);
  }, [transactions, reportBranchFilter]);

  const filteredStockLogs = useMemo(() => {
    if (reportBranchFilter === 'ALL') return stockLogs;
    return stockLogs.filter((l) => l.branchId === reportBranchFilter);
  }, [stockLogs, reportBranchFilter]);

  const reportMetrics = useMemo(() => {
    const totalOmzet = filteredTransactions.reduce((acc, t) => acc + t.total, 0);
    const totalTax = filteredTransactions.reduce((acc, t) => acc + t.taxAmount, 0);
    const netRevenueExTax = totalOmzet - totalTax;
    const totalHPP = filteredTransactions.reduce((acc, t) => acc + getTransactionHPP(t), 0);
    const totalRestockSpend = filteredStockLogs
      .filter((l) => l.type === 'Restock Mandiri')
      .reduce((acc, l) => acc + (l.totalCost || 0), 0);
    const labaBersihPenjualan = netRevenueExTax - totalHPP;
    const kasBersihSetelahRestock = totalOmzet - totalHPP - totalRestockSpend;
    return {
      totalOmzet,
      totalTax,
      netRevenueExTax,
      totalHPP,
      totalRestockSpend,
      labaBersihPenjualan,
      kasBersihSetelahRestock
    };
  }, [filteredTransactions, filteredStockLogs, menus]);

  const branchComparisonData = useMemo(() => {
    return branches.map((b) => {
      const branchTrx = transactions.filter((t) => t.branchId === b.id);
      const omzet = branchTrx.reduce((sum, t) => sum + t.total, 0);
      const tax = branchTrx.reduce((sum, t) => sum + t.taxAmount, 0);
      const hpp = branchTrx.reduce((sum, t) => sum + getTransactionHPP(t), 0);
      const labaBersih = omzet - tax - hpp;
      const restockSpend = stockLogs
        .filter((l) => l.branchId === b.id && l.type === 'Restock Mandiri')
        .reduce((sum, l) => sum + (l.totalCost || 0), 0);
      return {
        name: (b.cafeName || b.name).replace('Cabang ', ''),
        Omzet: omzet,
        LabaBersih: labaBersih,
        BelanjaStok: restockSpend,
        Transaksi: branchTrx.length
      };
    });
  }, [branches, transactions, stockLogs, menus]);

  const paymentMethodPieData = useMemo(() => {
    const counts = { QRIS: 0, Tunai: 0, Debit: 0 };
    filteredTransactions.forEach((t) => {
      counts[t.paymentMethod] = (counts[t.paymentMethod] || 0) + t.total;
    });
    return Object.entries(counts)
      .filter(([, val]) => val > 0)
      .map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  // Low stock count for current branch
  const lowStockCountCurrentBranch = useMemo(() => {
    const stocks = branchStocks[selectedBranchId] || {};
    return ingredients.filter((ing) => (stocks[ing.id] || 0) <= ing.minStock).length;
  }, [branchStocks, selectedBranchId, ingredients]);

  // Helper render menu icon
  const renderMenuIcon = (iconName) => {
    switch (iconName) {
      case 'coffee':
        return <Coffee className="w-5 h-5 text-amber-700" />;
      case 'soda':
        return <CupSoda className="w-5 h-5 text-emerald-600" />;
      case 'cake':
        return <CakeSlice className="w-5 h-5 text-orange-600" />;
      default:
        return <UtensilsCrossed className="w-5 h-5 text-rose-600" />;
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-stone-800 rounded-3xl shadow-2xl border border-stone-700 overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Unified Single-Site & Cloud Sync Status Bar */}
          <div className="bg-stone-900/90 border border-stone-700 rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {cloudStatus === 'connected' ? (
                <Cloud className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Database className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-stone-200 block truncate">
                  ID Kafe / Workspace: <strong className="text-amber-300 font-mono">{workspaceId}</strong>
                </span>
                <span className="text-[10px] text-stone-400 block truncate">
                  {cloudStatus === 'connected'
                    ? `Cloud Realtime Aktif (Sync: ${lastSyncTime})`
                    : 'Klik Sinkron Cloud agar HP Admin & Kasir Terhubung'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCloudModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold shrink-0 flex items-center gap-1 transition"
            >
              <Cloud className="w-3.5 h-3.5" /> Sinkron Cloud
            </button>
          </div>

          {/* Brand Header */}
          <div className="text-center space-y-2 border-b border-stone-700/80 pb-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center mx-auto shadow-lg">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight pt-1">
              Ramu Jaya POS
            </h1>
            <p className="text-xs text-stone-400">
              Portal Web Terpadu — Admin & Seluruh Karyawan Cabang Login di Alamat Ini
            </p>
          </div>

          {/* Login Form */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-stone-200 uppercase tracking-wider">
                Otentikasi Pengguna
              </h2>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Masukkan username Anda"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-900 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">
                  PIN / Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  autoComplete="off"
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-900 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Masuk ke Aplikasi
              </button>
            </form>
          </div>

          {/* Install App Button on Login Screen */}
          <div className="pt-4 border-t border-stone-700/80 space-y-3">
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-950 text-amber-300 border border-stone-700 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4 text-amber-400" />
              {isInstalledPWA
                ? 'Aplikasi Ter-install di Perangkat'
                : 'Install Aplikasi di Desktop / Android'}
            </button>
            <div className="text-center space-y-1">
              <p className="text-[11px] text-stone-400 flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Akses Terenkripsi & Terproteksi Per Cabang
              </p>
              <p className="text-[10px] text-stone-500">
                Lupa PIN atau butuh akun baru? Hubungi Admin / Owner Ramu Jaya.
              </p>
            </div>
          </div>
        </div>

        {/* PWA Install Guide Modal when on Login Screen */}
        {installModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-stone-800 rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-700 space-y-4 text-stone-100">
              <div className="flex items-center justify-between border-b border-stone-700 pb-3">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-base text-white">
                    Install Aplikasi Ramu Jaya POS
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setInstallModal(false)}
                  className="text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-700 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                    <Smartphone className="w-4 h-4" /> Cara Install di HP / Tablet Android:
                  </div>
                  <ol className="list-decimal list-inside text-stone-300 space-y-1 leading-relaxed">
                    <li>Buka situs ini di browser <strong>Google Chrome</strong> Android.</li>
                    <li>Ketuk ikon menu titik tiga <strong>(⋮)</strong> di pojok kanan atas browser.</li>
                    <li>Pilih <strong>"Install aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.</li>
                    <li>Aplikasi <strong>Ramu Jaya POS</strong> akan muncul di layar HP seperti aplikasi native penuh.</li>
                  </ol>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-700 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                    <Monitor className="w-4 h-4" /> Cara Install di Komputer / Laptop (Desktop):
                  </div>
                  <ol className="list-decimal list-inside text-stone-300 space-y-1 leading-relaxed">
                    <li>Buka di <strong>Google Chrome</strong> atau <strong>Microsoft Edge</strong>.</li>
                    <li>Klik ikon <strong>Install / Komputer (⊕)</strong> di sebelah kanan kolom alamat URL (Address Bar).</li>
                    <li>Klik <strong>"Install"</strong> — aplikasi akan memiliki shortcut sendiri di Desktop & Taskbar.</li>
                  </ol>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setInstallModal(false)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                >
                  Mengerti
                </button>
              </div>
            </div>
          </div>
        )}

                {renderCloudSyncModal()}
        {renderQrCodeModal()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-bounce">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
              toast.type === 'error'
                ? 'bg-red-600 text-white border-red-700'
                : 'bg-stone-900 text-amber-300 border-stone-700'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 opacity-75 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SIDEBAR + MAIN CONTENT WRAPPER */}
      <div className="flex flex-1 min-h-screen relative">
        {/* Mobile Backdrop Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          />
        )}

        {/* LEFT SIDEBAR NAVIGATION */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-stone-900 text-stone-100 border-r border-stone-800 flex flex-col justify-between transition-all duration-200 ${
            sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
          } w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          {/* Top Brand & Collapse Toggle */}
          <div className="p-4 border-b border-stone-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center shadow-inner shrink-0">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                {!sidebarCollapsed && (
                  <div className="min-w-0">
                    <h1 className="font-extrabold text-base tracking-tight text-white truncate">
                      Ramu Jaya POS
                    </h1>
                    <p className="text-[11px] text-amber-400 font-semibold truncate">
                      {currentBranch.cafeName || currentBranch.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Desktop Collapse Button */}
              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                title={sidebarCollapsed ? 'Perlebar Sidebar' : 'Kecilkan Sidebar'}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>

              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg bg-stone-800 text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Branch Selector inside Sidebar */}
            {!sidebarCollapsed && (
              <div className="bg-stone-800/90 border border-stone-700 rounded-xl p-2.5 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-stone-400 uppercase font-bold">
                  <span className="flex items-center gap-1">
                    <Store className="w-3 h-3 text-amber-400" /> Cabang Aktif
                  </span>
                  {role === 'cashier' && <Lock className="w-3 h-3 text-stone-400" />}
                </div>
                {role === 'owner' ? (
                  <select
                    value={selectedBranchId}
                    onChange={(e) => {
                      setSelectedBranchId(e.target.value);
                      setCart([]);
                      showToast(
                        `Berpindah ke ${branches.find((b) => b.id === e.target.value)?.name}`
                      );
                    }}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2 py-1.5 text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id} className="bg-stone-900 text-stone-100">
                        {b.name} — {b.cafeName || ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs font-bold text-amber-300 truncate pt-0.5">
                    {currentBranch.name}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Navigation Menu Links */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
            {!sidebarCollapsed && (
              <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Menu Navigasi
              </p>
            )}

            <button
              onClick={() => {
                setActiveTab('pos');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'pos'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
              title="Kasir Penjualan (POS)"
            >
              <div className="flex items-center gap-3 min-w-0">
                <ShoppingCart className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">Kasir Penjualan (POS)</span>}
              </div>
              {!sidebarCollapsed && cart.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-white text-amber-900 font-extrabold">
                  {cart.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>

            {role === 'owner' && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('inventory');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === 'inventory'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                  title="Stok & Restock Cabang"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Package className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">Stok & Restock Cabang</span>}
                  </div>
                  {!sidebarCollapsed && lowStockCountCurrentBranch > 0 && (
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-red-500 text-white font-extrabold">
                      {lowStockCountCurrentBranch}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab('recipes');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === 'recipes'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                  title="Menu & Resep (HPP Manual)"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <BookOpen className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">Menu & Resep</span>}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('reports');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === 'reports'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                  title="Laporan & Mutasi"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <BarChart3 className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span className="truncate">Laporan & Mutasi</span>}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('branches');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === 'branches'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                  title="Cabang & Akun"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Building2 className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="truncate">Cabang & Akun ({branches.length})</span>
                    )}
                  </div>
                </button>
              </>
            )}

            {role === 'cashier' && !sidebarCollapsed && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Mode Karyawan: Hanya akses Kasir Penjualan.</span>
              </div>
            )}

            {/* Quick Tools Section in Sidebar */}
            <div className="pt-4 mt-4 border-t border-stone-800 space-y-1.5">
              {!sidebarCollapsed && (
                <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Perangkat & Aplikasi
                </p>
              )}

              <button
                type="button"
                onClick={() => setPrinterModal(true)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  btDevice
                    ? 'bg-blue-600/25 border border-blue-500/40 text-blue-300'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
                title="Printer Bluetooth Thermal"
              >
                <Bluetooth className="w-4 h-4 shrink-0 text-blue-400" />
                {!sidebarCollapsed && (
                  <span className="truncate">
                    {btDevice ? `Printer: ${btDevice.name}` : `Printer Bluetooth (${paperSize})`}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCloudModal(true)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  cloudStatus === 'connected'
                    ? 'bg-emerald-600/25 border border-emerald-500/40 text-emerald-300'
                    : 'bg-stone-800/80 hover:bg-stone-800 text-amber-300 border border-stone-700'
                }`}
                title="Sinkronisasi Antar HP & Multi-Cafe Cloud"
              >
                <Cloud className="w-4 h-4 shrink-0 text-emerald-400" />
                {!sidebarCollapsed && (
                  <span className="truncate">
                    {cloudStatus === 'connected'
                      ? `Cloud Aktif (${workspaceId})`
                      : `Sinkron Cloud (${workspaceId})`}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 transition"
                title="Install Aplikasi Tanpa Ikon Chrome"
              >
                <Download className="w-4 h-4 shrink-0 text-emerald-400" />
                {!sidebarCollapsed && <span className="truncate">Install App (Full PWA)</span>}
              </button>

              <button
                type="button"
                onClick={handleCopyPortalUrl}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-stone-400 hover:bg-stone-800 hover:text-stone-200 transition"
                title="Salin Link Portal"
              >
                <Copy className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">Salin Link Situs</span>}
              </button>
            </div>
          </div>

          {/* Bottom User Profile & Logout */}
          <div className="p-3 border-t border-stone-800 bg-stone-950/60">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-stone-800 border border-stone-700 shrink-0">
                  {role === 'owner' ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                {!sidebarCollapsed && (
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                    <p className="text-[10px] text-stone-400 truncate">
                      {role === 'owner' ? 'Admin / Owner' : 'Kasir Cabang'}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 shrink-0 transition"
                title="Keluar / Ganti Akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile & Tablet Top Header Bar */}
          <header className="bg-white border-b border-stone-200 sticky top-0 z-20 px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-stone-900">
                    {activeTab === 'pos' && 'Kasir Penjualan (POS)'}
                    {activeTab === 'inventory' && 'Stok & Restock Cabang'}
                    {activeTab === 'recipes' && 'Menu & Resep (HPP Manual)'}
                    {activeTab === 'reports' && 'Laporan & Mutasi'}
                    {activeTab === 'branches' && 'Kelola Cabang & Akun'}
                  </span>
                  <span className="hidden sm:inline-block text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                    {currentBranch.cafeName || currentBranch.name}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 hidden sm:block">
                  Ramu Jaya POS • Lokasi: {currentBranch.name} ({currentBranch.address})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCloudModal(true)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                  cloudStatus === 'connected'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                }`}
                title="Pengaturan Sinkronisasi Cloud Antar HP & ID Kafe"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span className="hidden md:inline">
                  {cloudStatus === 'connected' ? `Sync: ${workspaceId}` : `Cloud (${workspaceId})`}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPrinterModal(true)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                  btDevice
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Bluetooth className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">
                  {btDevice ? btDevice.name : `Printer (${paperSize})`}
                </span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </header>

          {/* MAIN WORKSPACE CONTENT */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5">
        {/* ==================== TAB 1: KASIR (POS) ==================== */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Menu Selection (7 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              {/* Branch Banner & Search */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h2 className="font-bold text-stone-800 text-base">
                      {currentBranch.cafeName || currentBranch.name}
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium">
                      {currentBranch.name}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Header Struk Aktif: <strong className="text-amber-700 font-mono">{currentBranch.receiptName || currentBranch.cafeName || currentBranch.name}</strong>
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={posSearch}
                    onChange={(e) => setPosSearch(e.target.value)}
                    placeholder="Cari kopi, matcha, snack..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-stone-100 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['Semua', 'Kopi', 'Non-Kopi', 'Pastry & Snack', 'Makanan Berat'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPosCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      posCategory === cat
                        ? 'bg-stone-900 text-amber-300 shadow-sm'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {menus
                  .filter(
                    (m) =>
                      (posCategory === 'Semua' || m.category === posCategory) &&
                      m.name.toLowerCase().includes(posSearch.toLowerCase())
                  )
                  .map((menu) => {
                    const inCartQty = cart.find((c) => c.menu.id === menu.id)?.qty || 0;

                    return (
                      <div
                        key={menu.id}
                        onClick={() => handleAddToCart(menu)}
                        className="group bg-white rounded-2xl p-4 border border-stone-200/90 hover:border-amber-500 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                              {renderMenuIcon(menu.icon)}
                            </div>
                            {inCartQty > 0 ? (
                              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                Di Keranjang: {inCartQty}x
                              </span>
                            ) : (
                              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Tersedia
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-stone-800 text-sm group-hover:text-amber-700 transition">
                            {menu.name}
                          </h3>
                          <p className="text-xs text-stone-400 mt-0.5">{menu.category}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                          <span className="font-extrabold text-stone-900 text-base">
                            {formatRp(menu.price)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(menu);
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition bg-amber-600 text-white hover:bg-amber-700"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Tambah
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right Column: Order & Payment Panel (5 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl shadow-sm border border-stone-200 p-4 sm:p-5 space-y-4 sticky top-28">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-bold text-base text-stone-800">Detail Pesanan Baru</h3>
                  <p className="text-xs text-stone-500">{currentBranch.name}</p>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Kosongkan
                  </button>
                )}
              </div>

              {/* Order Type: Dine-In vs Takeaway */}
              <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setOrderType('Dine-In')}
                  className={`py-2 rounded-lg text-xs font-bold transition ${
                    orderType === 'Dine-In'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  🍽️ Dine-In (Makan di Tempat)
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('Takeaway')}
                  className={`py-2 rounded-lg text-xs font-bold transition ${
                    orderType === 'Takeaway'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  🛍️ Takeaway / Bungkus
                </button>
              </div>

              {/* Customer & Table Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-500 uppercase mb-1">
                    Nama Pelanggan
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Kak Budi"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                {orderType === 'Dine-In' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 uppercase mb-1">
                      Nomor Meja
                    </label>
                    <select
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                    >
                      {Array.from({ length: currentBranch.tables || 10 }, (_, idx) => {
                        const label = `Meja ${String(idx + 1).padStart(2, '0')}`;
                        return (
                          <option key={label} value={label}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>

              {/* Cart Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1">
                {cart.length === 0 ? (
                  <div className="py-10 text-center text-stone-400">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">Belum ada menu yang dipilih.</p>
                    <p className="text-[11px] mt-0.5">Klik kartu menu di sebelah kiri.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.menu.id} className="py-2.5 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-800 truncate">{item.menu.name}</p>
                        <p className="text-[11px] text-stone-500">
                          {formatRp(item.menu.price)} × {item.qty} ={' '}
                          <span className="font-semibold text-stone-800">
                            {formatRp(item.menu.price * item.qty)}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.menu.id, -1)}
                          className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.menu.id, 1)}
                          className="w-7 h-7 rounded-lg bg-amber-100 hover:bg-amber-200 flex items-center justify-center text-amber-800"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Discount & Tax Controls */}
              <div className="pt-3 border-t border-stone-100 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-stone-600 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-amber-600" /> Diskon Promo (%)
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[0, 5, 10, 20].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDiscountPercent(d)}
                        className={`px-2 py-1 rounded-md text-[11px] font-bold transition ${
                          Number(discountPercent) === d
                            ? 'bg-amber-600 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {d}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs text-stone-600 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableTax}
                      onChange={(e) => setEnableTax(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    Pajak Restoran / PB1 (10%)
                  </label>
                  <span className="text-xs font-medium text-stone-700">
                    {formatRp(cartSummary.taxAmount)}
                  </span>
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 space-y-1.5">
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Subtotal</span>
                  <span>{formatRp(cartSummary.subtotal)}</span>
                </div>
                {cartSummary.discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700 font-medium">
                    <span>Diskon ({discountPercent}%)</span>
                    <span>- {formatRp(cartSummary.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-stone-600">
                  <span>PB1 (10%)</span>
                  <span>{formatRp(cartSummary.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-1.5 border-t border-stone-200">
                  <span>Total Tagihan</span>
                  <span className="text-amber-700">{formatRp(cartSummary.total)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-stone-500 uppercase">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'QRIS', icon: QrCode, label: 'QRIS' },
                    { id: 'Tunai', icon: Banknote, label: 'Tunai' },
                    { id: 'Debit', icon: CreditCard, label: 'Debit/EDC' }
                  ].map((pm) => {
                    const IconComp = pm.icon;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-xs font-semibold transition ${
                          paymentMethod === pm.id
                            ? 'bg-amber-50 border-amber-600 text-amber-800 shadow-sm'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <IconComp className="w-4 h-4 mb-1" />
                        {pm.label}
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === 'Tunai' && (
                  <div className="pt-2 space-y-2">
                    <label className="block text-xs text-stone-600 font-medium">
                      Uang Diterima (Rp)
                    </label>
                    <input
                      type="number"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      placeholder="Masukkan nominal uang tunai..."
                      className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {[cartSummary.total, 50000, 100000, 150000, 200000]
                        .filter((v) => v > 0)
                        .map((nom, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCashReceived(String(nom))}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg text-[11px] font-semibold text-stone-700"
                          >
                            {idx === 0 ? 'Uang Pas' : formatRp(nom)}
                          </button>
                        ))}
                    </div>
                    {Number(cashReceived) >= cartSummary.total && cartSummary.total > 0 && (
                      <div className="flex justify-between text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                        <span>Kembalian:</span>
                        <span>{formatRp(cartSummary.change)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition ${
                  cart.length === 0
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                <Receipt className="w-4 h-4" />
                Proses Pembayaran & Potong Stok
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: STOK & RESTOCK CABANG ==================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-5">
            {/* Top Action Header */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-stone-800">
                    Stok Bahan Baku & Kemasan — {currentBranch.name}
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                    Restock Mandiri Aktif
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Setiap cabang mengelola belanja stok masing-masing. Stok otomatis berkurang sesuai resep saat kasir transaksi.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setRestockForm({
                      ingredientId: ingredients[0]?.id || 'ing-1',
                      qty: '',
                      totalCost: '',
                      supplier: '',
                      note: ''
                    });
                    setRestockModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  Belanja / Restock Mandiri
                </button>

                <button
                  onClick={() => {
                    setTransferForm({
                      fromBranchId: selectedBranchId,
                      toBranchId: branches.find((b) => b.id !== selectedBranchId)?.id || 'br-2',
                      ingredientId: ingredients[0]?.id || 'ing-1',
                      qty: '',
                      note: ''
                    });
                    setTransferModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  Transfer Antar-Cabang
                </button>

                {role === 'owner' && (
                  <button
                    onClick={() => setNewIngModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Layers className="w-4 h-4" />
                    + Master Bahan Baru
                  </button>
                )}
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInvFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    invFilter === 'all'
                      ? 'bg-stone-900 text-white'
                      : 'bg-white border border-stone-200 text-stone-600'
                  }`}
                >
                  Semua Bahan ({ingredients.length})
                </button>
                <button
                  onClick={() => setInvFilter('low')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    invFilter === 'low'
                      ? 'bg-red-600 text-white'
                      : 'bg-white border border-stone-200 text-red-600'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Perlu Restock ({lowStockCountCurrentBranch})
                </button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={invSearch}
                  onChange={(e) => setInvSearch(e.target.value)}
                  placeholder="Cari nama bahan baku..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-100/80 text-stone-600 text-[11px] font-bold uppercase border-b border-stone-200">
                      <th className="py-3.5 px-4">Bahan Baku / Kemasan</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4">Stok Saat Ini ({currentBranch.name.replace('Cabang ', '')})</th>
                      <th className="py-3.5 px-4">Batas Minimum</th>
                      <th className="py-3.5 px-4">Status</th>
                      {role === 'owner' && <th className="py-3.5 px-4">Perbandingan Cabang Lain</th>}
                      <th className="py-3.5 px-4 text-right">Aksi Cabang</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {ingredients.filter((ing) => {
                      const qty = branchStocks[selectedBranchId]?.[ing.id] || 0;
                      const matchesSearch = ing.name.toLowerCase().includes(invSearch.toLowerCase());
                      const matchesLow = invFilter === 'all' || qty <= ing.minStock;
                      return matchesSearch && matchesLow;
                    }).length === 0 ? (
                      <tr>
                        <td colSpan={role === 'owner' ? 7 : 6} className="py-8 text-center text-stone-400 text-xs">
                          Belum ada bahan baku di sistem atau tidak sesuai pencarian. Klik <strong>+ Master Bahan Baru</strong> di atas untuk menambah.
                        </td>
                      </tr>
                    ) : (
                      ingredients
                        .filter((ing) => {
                          const qty = branchStocks[selectedBranchId]?.[ing.id] || 0;
                          const matchesSearch = ing.name.toLowerCase().includes(invSearch.toLowerCase());
                          const matchesLow = invFilter === 'all' || qty <= ing.minStock;
                          return matchesSearch && matchesLow;
                        })
                        .map((ing) => {
                        const qty = branchStocks[selectedBranchId]?.[ing.id] || 0;
                        const isLow = qty <= ing.minStock;

                        return (
                          <tr key={ing.id} className="hover:bg-stone-50/80 transition">
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-stone-800">{ing.name}</p>
                              <p className="text-[11px] text-stone-400">
                                Estimasi HPP: {formatRp(ing.costPerUnit)} / {ing.unit}
                              </p>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium">
                                {ing.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-sm font-extrabold text-stone-900">
                                {qty.toLocaleString('id-ID')}
                              </span>{' '}
                              <span className="text-stone-500 font-medium">{ing.unit}</span>
                            </td>
                            <td className="py-3.5 px-4 text-stone-500">
                              {ing.minStock.toLocaleString('id-ID')} {ing.unit}
                            </td>
                            <td className="py-3.5 px-4">
                              {isLow ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                                  <AlertTriangle className="w-3 h-3" /> Segera Restock
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" /> Aman
                                </span>
                              )}
                            </td>
                            {role === 'owner' && (
                              <td className="py-3.5 px-4">
                                <div className="flex flex-wrap gap-1.5">
                                  {branches
                                    .filter((b) => b.id !== selectedBranchId)
                                    .map((otherB) => {
                                      const otherQty = branchStocks[otherB.id]?.[ing.id] || 0;
                                      const otherLow = otherQty <= ing.minStock;
                                      return (
                                        <span
                                          key={otherB.id}
                                          className={`text-[11px] px-2 py-0.5 rounded border ${
                                            otherLow
                                              ? 'bg-red-50 border-red-200 text-red-700'
                                              : 'bg-stone-50 border-stone-200 text-stone-600'
                                          }`}
                                        >
                                          {otherB.name.replace('Cabang ', '')}:{' '}
                                          <strong>
                                            {otherQty.toLocaleString('id-ID')} {ing.unit}
                                          </strong>
                                        </span>
                                      );
                                    })}
                                </div>
                              </td>
                            )}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setRestockForm({
                                      ingredientId: ing.id,
                                      qty: '',
                                      totalCost: '',
                                      supplier: '',
                                      note: ''
                                    });
                                    setRestockModal(true);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200 transition"
                                >
                                  + Beli Stok
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpnameModal(ing);
                                    setOpnameActualQty(String(qty));
                                    setOpnameNote('');
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] transition"
                                >
                                  Stok Opname
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteIngredient(ing.id)}
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition"
                                  title={`Hapus bahan ${ing.name}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 3: MENU & RESEP (MANUAL HPP & HARGA JUAL + HAPUS PER ITEM) ==================== */}
        {activeTab === 'recipes' && (role === 'owner' || currentUser?.role === 'owner') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left List of Menus (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-stone-200 p-4 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="font-bold text-base text-stone-800">
                    Daftar Menu & HPP ({menus.length} Item)
                  </h2>
                  <p className="text-xs text-stone-500">
                    Klik menu untuk edit, atau klik ikon tempat sampah untuk hapus per item
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewMenuModal(true)}
                  className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Menu Baru
                </button>
              </div>

              {menus.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-3">
                  <p className="text-xs font-bold text-stone-600">
                    Belum ada daftar menu di sistem.
                  </p>
                  <button
                    type="button"
                    onClick={() => setNewMenuModal(true)}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Tambah Menu Pertama
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {menus.map((m) => {
                    const hpp = calculateMenuHPP(m);
                    const price = Number(m.price) || 0;
                    const margin = price - hpp;
                    const marginPct = price > 0 ? Math.round((margin / price) * 100) : 0;
                    const isSelected = (activeMenuRecipeObj?.id || selectedMenuForRecipe) === m.id;

                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMenuForRecipe(m.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-amber-50/70 border-amber-600 shadow-sm'
                            : 'bg-white border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-stone-100 shrink-0">
                            {renderMenuIcon(m.icon)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-stone-800 truncate">{m.name}</p>
                            <p className="text-xs text-stone-500 truncate">
                              Jual: <strong className="text-stone-800">{formatRp(price)}</strong> •{' '}
                              {m.category}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Margin {marginPct}%
                            </span>
                            <p className="text-[11px] text-stone-500 mt-1">HPP: {formatRp(hpp)}</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteMenu(m.id, e)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition"
                            title={`Hapus menu ${m.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Manual Editor for HPP & Harga Jual (7 cols) */}
            {activeMenuRecipeObj ? (
              <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-stone-200 p-5 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                      Pengaturan Harga & HPP Manual (Tanpa Komposisi)
                    </span>
                    <h3 className="text-xl font-extrabold text-stone-900 mt-0.5">
                      {activeMenuRecipeObj.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Masukkan nilai HPP (Harga Pokok Penjualan) dan Harga Jual secara langsung tanpa rincian komposisi bahan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteMenu(activeMenuRecipeObj.id, e)}
                    className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1.5 border border-red-200 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Hapus Item Menu Ini
                  </button>
                </div>

                {/* Form Input Manual */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Nama Menu
                    </label>
                    <input
                      type="text"
                      value={activeMenuRecipeObj.name || ''}
                      onChange={(e) =>
                        handleUpdateMenuField(activeMenuRecipeObj.id, 'name', e.target.value)
                      }
                      className="w-full px-3.5 py-2.5 text-sm font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Kategori Menu
                    </label>
                    <select
                      value={activeMenuRecipeObj.category || 'Kopi'}
                      onChange={(e) =>
                        handleUpdateMenuField(activeMenuRecipeObj.id, 'category', e.target.value)
                      }
                      className="w-full px-3.5 py-2.5 text-sm font-semibold bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Kopi">Kopi</option>
                      <option value="Non-Kopi">Non-Kopi</option>
                      <option value="Pastry & Snack">Pastry & Snack</option>
                      <option value="Makanan Berat">Makanan Berat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      HPP Manual per Porsi (Rp)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={activeMenuRecipeObj.hpp ?? 0}
                      onChange={(e) =>
                        handleUpdateMenuField(activeMenuRecipeObj.id, 'hpp', e.target.value)
                      }
                      placeholder="Masukkan HPP..."
                      className="w-full px-3.5 py-2.5 text-sm font-extrabold bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      Modal pokok per porsi yang diinput secara manual.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Harga Jual Kasir (Rp)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={activeMenuRecipeObj.price ?? 0}
                      onChange={(e) =>
                        handleUpdateMenuField(activeMenuRecipeObj.id, 'price', e.target.value)
                      }
                      placeholder="Masukkan Harga Jual..."
                      className="w-full px-3.5 py-2.5 text-sm font-extrabold bg-amber-50/60 border border-amber-300 rounded-xl text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      Harga yang tampil pada halaman Kasir (POS) di semua cabang.
                    </p>
                  </div>
                </div>

                {/* Ringkasan Laba Kotor & Margin */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-white rounded-xl border border-stone-200/80">
                    <span className="text-[11px] text-stone-500 block">HPP Manual</span>
                    <span className="text-base font-extrabold text-stone-800">
                      {formatRp(activeMenuRecipeObj.hpp)}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200/80">
                    <span className="text-[11px] text-stone-500 block">Harga Jual</span>
                    <span className="text-base font-extrabold text-amber-700">
                      {formatRp(activeMenuRecipeObj.price)}
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-[11px] text-emerald-700 font-semibold block">
                      Estimasi Laba Kotor / Porsi
                    </span>
                    <span className="text-base font-extrabold text-emerald-800">
                      {formatRp((Number(activeMenuRecipeObj.price) || 0) - (Number(activeMenuRecipeObj.hpp) || 0))}{' '}
                      <span className="text-xs font-bold">
                        (
                        {Number(activeMenuRecipeObj.price) > 0
                          ? Math.round(
                              (((Number(activeMenuRecipeObj.price) || 0) -
                                (Number(activeMenuRecipeObj.hpp) || 0)) /
                                Number(activeMenuRecipeObj.price)) *
                                100
                            )
                          : 0}
                        %)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-stone-200 p-8 text-center space-y-3">
                <p className="text-sm font-bold text-stone-700">
                  Pilih item menu di sebelah kiri atau tambahkan menu baru.
                </p>
                <button
                  type="button"
                  onClick={() => setNewMenuModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Tambah Menu Kafe Baru
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 4: LAPORAN & MUTASI ==================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Filter, Download Excel & Reset Action Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-base text-stone-800">
                  Laporan Transaksi, Laba Bersih & Riwayat Mutasi Stok
                </h2>
                <p className="text-xs text-stone-500">
                  Pantau omzet, potongan HPP, laba bersih, download ke Excel (.xls), atau reset riwayat laporan.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
                  <Filter className="w-4 h-4 text-stone-500" />
                  <span className="text-xs font-semibold text-stone-600">Cabang:</span>
                  <select
                    value={reportBranchFilter}
                    onChange={(e) => setReportBranchFilter(e.target.value)}
                    disabled={role === 'cashier'}
                    className="text-xs font-bold bg-transparent text-stone-900 focus:outline-none cursor-pointer"
                  >
                    {role === 'owner' && <option value="ALL">Semua Cabang (Konsolidasi)</option>}
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.cafeName || ''})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadExcelReport}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Excel (.xls)
                </button>

                {role === 'owner' && (
                  <button
                    type="button"
                    onClick={() =>
                      setResetReportModal({
                        scope: reportBranchFilter,
                        target: 'all'
                      })
                    }
                    className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset Riwayat
                  </button>
                )}
              </div>
            </div>

            {/* KPI Summary Cards (5 Cards including Total HPP & Laba Bersih) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between text-stone-400 mb-1">
                  <span className="text-[11px] font-bold uppercase">Total Omzet Kotor</span>
                  <DollarSign className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-lg font-extrabold text-stone-900">
                  {formatRp(reportMetrics.totalOmzet)}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  {filteredTransactions.length} transaksi (Termasuk PB1{' '}
                  {formatRp(reportMetrics.totalTax)})
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between text-stone-400 mb-1">
                  <span className="text-[11px] font-bold uppercase">Total Modal HPP</span>
                  <Layers className="w-4 h-4 text-rose-600" />
                </div>
                <p className="text-lg font-extrabold text-stone-900">
                  {formatRp(reportMetrics.totalHPP)}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  Akumulasi HPP dari menu terjual
                </p>
              </div>

              <div className="bg-emerald-50/90 p-4 rounded-2xl border border-emerald-300 shadow-sm">
                <div className="flex items-center justify-between text-emerald-800 mb-1">
                  <span className="text-[11px] font-extrabold uppercase">Laba Bersih Penjualan</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xl font-extrabold text-emerald-800">
                  {formatRp(reportMetrics.labaBersihPenjualan)}
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                  Penjualan Bersih ({formatRp(reportMetrics.netRevenueExTax)}) - HPP
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex items-center justify-between text-stone-400 mb-1">
                  <span className="text-[11px] font-bold uppercase">Belanja Restock Stok</span>
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-lg font-extrabold text-stone-900">
                  {formatRp(reportMetrics.totalRestockSpend)}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  Pengeluaran belanja bahan cabang
                </p>
              </div>

              <div className="bg-stone-900 text-white p-4 rounded-2xl border border-stone-800 shadow-sm">
                <div className="flex items-center justify-between text-amber-300 mb-1">
                  <span className="text-[11px] font-bold uppercase">Sisa Kas Bersih</span>
                  <Receipt className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-lg font-extrabold text-amber-300">
                  {formatRp(reportMetrics.kasBersihSetelahRestock)}
                </p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Omzet - HPP - Belanja Restock
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <h3 className="font-bold text-sm text-stone-800 mb-1">
                  Perbandingan Omzet, Laba Bersih & Belanja Restock per Cabang
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  Pantau kontribusi laba bersih setiap cabang kafe secara langsung
                </p>
                <div className="relative h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={branchComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(val) => formatRp(val)} />
                      <Legend />
                      <Bar dataKey="Omzet" name="Omzet Penjualan" fill="#d97706" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="LabaBersih" name="Laba Bersih" fill="#059669" radius={[6, 6, 0, 0]} />
                      <Bar
                        dataKey="BelanjaStok"
                        name="Belanja Restock"
                        fill="#2563eb"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <h3 className="font-bold text-sm text-stone-800 mb-1">Metode Pembayaran</h3>
                <p className="text-xs text-stone-500 mb-4">Proporsi Tunai, QRIS, dan Debit</p>
                <div className="relative h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name }) => name}
                      >
                        {paymentMethodPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => formatRp(val)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Dual Tables: Transaction History & Stock Mutation Log */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Transaction History */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-stone-100 flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-stone-800">Riwayat Transaksi & Laba</h3>
                    <span className="text-[11px] text-stone-400">
                      Menampilkan Omzet, HPP & Laba Bersih per struk
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleDownloadExcelReport}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Excel
                    </button>
                    {role === 'owner' && filteredTransactions.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setResetReportModal({
                            scope: reportBranchFilter,
                            target: 'trx'
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold border border-red-200 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Reset Transaksi
                      </button>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 uppercase text-[11px] border-b border-stone-200">
                        <th className="py-2.5 px-3">ID / Waktu</th>
                        <th className="py-2.5 px-3">Cabang</th>
                        <th className="py-2.5 px-3 text-right">Omzet</th>
                        <th className="py-2.5 px-3 text-right">Laba Bersih</th>
                        <th className="py-2.5 px-3 text-right">Struk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-stone-400 text-xs">
                            Belum ada riwayat transaksi pada filter ini.
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((t) => {
                          const bName =
                            branches
                              .find((b) => b.id === t.branchId)
                              ?.name.replace('Cabang ', '') || t.branchId;
                          const trxHpp = getTransactionHPP(t);
                          const trxLabaBersih = (Number(t.total) || 0) - (Number(t.taxAmount) || 0) - trxHpp;
                          return (
                            <tr key={t.id} className="hover:bg-stone-50">
                              <td className="py-2.5 px-3">
                                <p className="font-bold text-stone-800">{t.id}</p>
                                <p className="text-[11px] text-stone-400">
                                  {t.timestamp} • {t.paymentMethod}
                                </p>
                              </td>
                              <td className="py-2.5 px-3 font-medium text-stone-700">{bName}</td>
                              <td className="py-2.5 px-3 text-right">
                                <p className="font-bold text-stone-900">{formatRp(t.total)}</p>
                                <p className="text-[10px] text-stone-400">HPP: {formatRp(trxHpp)}</p>
                              </td>
                              <td className="py-2.5 px-3 text-right font-extrabold text-emerald-700">
                                +{formatRp(trxLabaBersih)}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => setActiveReceipt(t)}
                                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-[11px]"
                                >
                                  Lihat
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Stock Logs */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-stone-100 flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-stone-800">
                      Log Mutasi Stok & Belanja Bahan
                    </h3>
                    <span className="text-[11px] text-stone-400">
                      Riwayat belanja stok, transfer & opname cabang
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleDownloadExcelReport}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Excel
                    </button>
                    {role === 'owner' && filteredStockLogs.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setResetReportModal({
                            scope: reportBranchFilter,
                            target: 'logs'
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold border border-red-200 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Reset Mutasi
                      </button>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 text-stone-500 uppercase text-[11px] border-b border-stone-200">
                        <th className="py-2.5 px-3">Waktu / Cabang</th>
                        <th className="py-2.5 px-3">Bahan & Jenis</th>
                        <th className="py-2.5 px-3 text-right">Perubahan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredStockLogs.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-stone-400 text-xs">
                            Belum ada riwayat mutasi stok pada filter ini.
                          </td>
                        </tr>
                      ) : (
                        filteredStockLogs.map((log) => {
                          const bName =
                            branches
                              .find((b) => b.id === log.branchId)
                              ?.name.replace('Cabang ', '') || log.branchId;
                          const isPositive = (Number(log.qtyChange) || 0) > 0;
                          return (
                            <tr key={log.id} className="hover:bg-stone-50">
                              <td className="py-2.5 px-3">
                                <p className="font-semibold text-stone-700">{bName}</p>
                                <p className="text-[11px] text-stone-400">{log.timestamp}</p>
                              </td>
                              <td className="py-2.5 px-3">
                                <p className="font-bold text-stone-800">{log.ingredientName}</p>
                                <p className="text-[11px] text-stone-500">
                                  <span className="font-semibold">{log.type}</span> — {log.note}
                                </p>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <span
                                  className={`font-extrabold ${
                                    isPositive ? 'text-emerald-600' : 'text-red-600'
                                  }`}
                                >
                                  {isPositive ? `+${log.qtyChange}` : log.qtyChange} {log.unit}
                                </span>
                                {(Number(log.totalCost) || 0) > 0 && (
                                  <p className="text-[11px] text-stone-500">
                                    Biaya: {formatRp(log.totalCost)}
                                  </p>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: KELOLA CABANG & AKUN ==================== */}
        {activeTab === 'branches' && (role === 'owner' || currentUser?.role === 'owner') && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-base text-stone-800">
                  Daftar Cabang Kafe ({branches.length} Lokasi)
                </h2>
                <p className="text-xs text-stone-500">
                  Setiap cabang memiliki inventori bahan baku independen, meja kasir, dan laporan masing-masing.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNewBranchModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Buka / Tambah Cabang Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {branches.map((b) => {
                const bTrx = transactions.filter((t) => t.branchId === b.id);
                const bOmzet = bTrx.reduce((acc, t) => acc + (Number(t.total) || 0), 0);
                const stocks = branchStocks[b.id] || {};
                const lowCount = ingredients.filter((i) => (stocks[i.id] || 0) <= i.minStock).length;

                return (
                  <div
                    key={b.id}
                    className={`bg-white rounded-2xl p-5 border transition flex flex-col justify-between ${
                      selectedBranchId === b.id
                        ? 'border-amber-600 ring-2 ring-amber-500/20'
                        : 'border-stone-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800">
                          <Store className="w-5 h-5" />
                        </div>
                        {selectedBranchId === b.id && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Sedang Aktif
                          </span>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                            {b.name}
                          </span>
                          <h3 className="font-extrabold text-base text-stone-900">
                            {b.cafeName || b.name}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditBranchModal({ ...b })}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold flex items-center gap-1 shrink-0 transition"
                          title="Ganti Nama Cafe & Nama di Struk"
                        >
                          <Edit3 className="w-3 h-3" /> Edit Nama & Struk
                        </button>
                      </div>

                      <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-stone-100 border border-stone-200/80 text-[11px] flex items-center justify-between">
                        <span className="text-stone-500">Judul di Struk:</span>
                        <span className="font-mono font-bold text-stone-800">
                          {b.receiptName || b.cafeName || b.name}
                        </span>
                      </div>

                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0" /> {b.address}
                      </p>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                        <Users className="w-3.5 h-3.5 shrink-0" /> Kepala Cabang:{' '}
                        <strong className="text-stone-700">{b.manager}</strong> ({b.tables} Meja)
                      </p>

                      <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-stone-50 p-2.5 rounded-xl">
                          <span className="text-[11px] text-stone-400 block">Omzet Hari Ini</span>
                          <span className="font-extrabold text-stone-800">{formatRp(bOmzet)}</span>
                        </div>
                        <div className="bg-stone-50 p-2.5 rounded-xl">
                          <span className="text-[11px] text-stone-400 block">Status Bahan</span>
                          {lowCount > 0 ? (
                            <span className="font-bold text-red-600">{lowCount} Perlu Restock</span>
                          ) : (
                            <span className="font-bold text-emerald-600">Semua Aman</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBranchId(b.id);
                          setActiveTab('pos');
                        }}
                        className="flex-1 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition"
                      >
                        Buka Kasir Cabang
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBranchId(b.id);
                          setActiveTab('inventory');
                        }}
                        className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition"
                      >
                        Cek Stok
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteBranchModal(b)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition"
                        title="Hapus / Tutup Cabang Ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Manajemen Akun Karyawan & Admin */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mt-6">
              <div className="p-5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-stone-800">
                    Manajemen Akun Login Karyawan & Admin
                  </h3>
                  <p className="text-xs text-stone-500">
                    Akun berstatus <strong>Karyawan Kasir</strong> otomatis dibatasi hanya untuk melakukan transaksi penjualan (POS) di cabang penugasannya.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNewUserForm({
                      name: '',
                      username: '',
                      pin: '',
                      role: 'cashier',
                      branchId: selectedBranchId
                    });
                    setNewUserModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <UserPlus className="w-4 h-4" /> + Tambah Akun Karyawan / Admin
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-100/80 text-stone-600 uppercase text-[11px] font-bold border-b border-stone-200">
                      <th className="py-3 px-4">Nama Lengkap</th>
                      <th className="py-3 px-4">Username</th>
                      <th className="py-3 px-4">PIN Login</th>
                      <th className="py-3 px-4">Peran & Hak Akses</th>
                      <th className="py-3 px-4">Cabang Penugasan</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {users.map((u) => {
                      const isOwner = u.role === 'owner';
                      const bName =
                        u.branchId === 'ALL'
                          ? 'Semua Cabang (Pusat)'
                          : branches.find((b) => b.id === u.branchId)?.name || u.branchId;
                      return (
                        <tr key={u.id} className="hover:bg-stone-50">
                          <td className="py-3 px-4 font-bold text-stone-800">{u.name}</td>
                          <td className="py-3 px-4 font-mono text-stone-700">{u.username}</td>
                          <td className="py-3 px-4 font-mono text-stone-600">
                            <div className="flex items-center gap-1.5">
                              <span>{showPinMap[u.id] ? u.pin : '••••'}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setShowPinMap({ ...showPinMap, [u.id]: !showPinMap[u.id] })
                                }
                                className="text-stone-400 hover:text-stone-700"
                                title={showPinMap[u.id] ? 'Sembunyikan PIN' : 'Lihat PIN'}
                              >
                                {showPinMap[u.id] ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {isOwner ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <ShieldCheck className="w-3 h-3" /> Admin / Owner (Akses Penuh)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                <UserCheck className="w-3 h-3" /> Karyawan (Hanya Transaksi POS)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium text-stone-700">{bName}</td>
                          <td className="py-3 px-4 text-right">
                            {u.id !== currentUser?.id ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id)}
                                className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-[11px]"
                              >
                                Hapus
                              </button>
                            ) : (
                              <span className="text-[11px] text-stone-400 italic">Sedang Login</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
          </main>
        </div>
      </div>

      {/* ==================== MODAL 1: RECEIPT / STRUK KASIR ==================== */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="text-center border-b border-dashed border-stone-300 pb-3">
              <h3 className="font-extrabold text-base text-stone-900 uppercase tracking-wide">
                {branches.find((b) => b.id === activeReceipt.branchId)?.receiptName ||
                  branches.find((b) => b.id === activeReceipt.branchId)?.cafeName ||
                  branches.find((b) => b.id === activeReceipt.branchId)?.name ||
                  'RAMU JAYA POS'}
              </h3>
              <p className="text-xs font-semibold text-amber-700">
                {branches.find((b) => b.id === activeReceipt.branchId)?.cafeName
                  ? `${branches.find((b) => b.id === activeReceipt.branchId)?.cafeName} (${
                      branches.find((b) => b.id === activeReceipt.branchId)?.name
                    })`
                  : branches.find((b) => b.id === activeReceipt.branchId)?.name}
              </p>
              <p className="text-[11px] text-stone-400">
                {branches.find((b) => b.id === activeReceipt.branchId)?.address}
              </p>
            </div>

            <div className="text-xs space-y-1 text-stone-600 border-b border-dashed border-stone-300 pb-3">
              <div className="flex justify-between">
                <span>No. Struk:</span>
                <span className="font-bold text-stone-800">{activeReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Waktu:</span>
                <span>{activeReceipt.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span className="font-semibold">{activeReceipt.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Layanan:</span>
                <span>
                  {activeReceipt.orderType}{' '}
                  {activeReceipt.tableNumber !== '-' ? `(${activeReceipt.tableNumber})` : ''}
                </span>
              </div>
            </div>

            <div className="space-y-2 border-b border-dashed border-stone-300 pb-3 text-xs">
              {activeReceipt.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <p className="font-semibold text-stone-800">{item.name}</p>
                    <p className="text-[11px] text-stone-400">
                      {item.qty} x {formatRp(item.price)}
                    </p>
                  </div>
                  <span className="font-bold text-stone-800">
                    {formatRp(item.qty * item.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatRp(activeReceipt.subtotal)}</span>
              </div>
              {activeReceipt.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Diskon ({activeReceipt.discountPercent}%)</span>
                  <span>- {formatRp(activeReceipt.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>PB1 (10%)</span>
                <span>{formatRp(activeReceipt.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-1 border-t border-stone-200">
                <span>TOTAL</span>
                <span>{formatRp(activeReceipt.total)}</span>
              </div>
              <div className="flex justify-between text-stone-500 pt-1">
                <span>Metode ({activeReceipt.paymentMethod})</span>
                <span>{formatRp(activeReceipt.paidAmount)}</span>
              </div>
              {activeReceipt.changeAmount > 0 && (
                <div className="flex justify-between font-bold text-emerald-700">
                  <span>Kembalian</span>
                  <span>{formatRp(activeReceipt.changeAmount)}</span>
                </div>
              )}
            </div>

            {/* Bluetooth Printer Status & Paper Size Selector */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-stone-600 flex items-center gap-1">
                  <Bluetooth className="w-3.5 h-3.5 text-blue-600" />
                  {btDevice ? (
                    <span className="text-emerald-700 font-bold">
                      {btDevice.name || 'Printer Thermal Aktif'}
                    </span>
                  ) : (
                    <span className="text-stone-500">Belum terhubung ke Bluetooth</span>
                  )}
                </span>
                <div className="flex items-center gap-1">
                  {['58mm', '80mm'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setPaperSize(sz)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        paperSize === sz
                          ? 'bg-stone-900 text-amber-300'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Primary Bluetooth Thermal Print Button */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={btPrinting}
                onClick={() => handlePrintBluetoothReceipt(activeReceipt)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <Bluetooth className="w-4 h-4" />
                {btPrinting
                  ? 'Mengirim Data ESC/POS ke Printer...'
                  : btDevice
                  ? `Cetak Struk Bluetooth (${paperSize})`
                  : `Hubungkan & Cetak Bluetooth (${paperSize})`}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintRawBTAndroid(activeReceipt)}
                  className="py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                  title="Cetak lewat aplikasi RawBT Android"
                >
                  <Smartphone className="w-3.5 h-3.5 text-amber-700" /> RawBT Android
                </button>
                <button
                  type="button"
                  onClick={() => handleSystemThermalPrint(activeReceipt)}
                  className="py-2 px-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition"
                >
                  <Printer className="w-3.5 h-3.5" /> CetakStruk/USB
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveReceipt(null)}
                className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: RESTOCK MANDIRI CABANG ==================== */}
      {restockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleRestockSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Belanja / Restock Mandiri Cabang
                </h3>
                <p className="text-xs text-amber-700 font-semibold">{currentBranch.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setRestockModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Pilih Bahan Baku</label>
                <select
                  value={restockForm.ingredientId}
                  onChange={(e) =>
                    setRestockForm({ ...restockForm, ingredientId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                >
                  {ingredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} (Stok saat ini:{' '}
                      {branchStocks[selectedBranchId]?.[ing.id] || 0} {ing.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Jumlah Masuk (
                    {ingredients.find((i) => i.id === restockForm.ingredientId)?.unit})
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={restockForm.qty}
                    onChange={(e) => setRestockForm({ ...restockForm, qty: e.target.value })}
                    placeholder="Contoh: 5000"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Total Biaya Belanja (Rp)
                  </label>
                  <input
                    type="number"
                    value={restockForm.totalCost}
                    onChange={(e) =>
                      setRestockForm({ ...restockForm, totalCost: e.target.value })
                    }
                    placeholder="Contoh: 110000"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Nama Toko / Supplier Lokal
                </label>
                <input
                  type="text"
                  value={restockForm.supplier}
                  onChange={(e) => setRestockForm({ ...restockForm, supplier: e.target.value })}
                  placeholder="Contoh: Toko Bahan Kue / Distributor Susu"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Catatan</label>
                <input
                  type="text"
                  value={restockForm.note}
                  onChange={(e) => setRestockForm({ ...restockForm, note: e.target.value })}
                  placeholder="Nota belanja kasir pagi..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRestockModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Simpan Stok Masuk
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== MODAL 3: TRANSFER ANTAR CABANG ==================== */}
      {transferModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleTransferSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Mutasi / Transfer Stok Antar-Cabang
                </h3>
                <p className="text-xs text-stone-500">
                  Kirim bantuan bahan baku bila cabang lain kehabisan stok
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTransferModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Dari Cabang Asal</label>
                  <select
                    value={transferForm.fromBranchId}
                    onChange={(e) =>
                      setTransferForm({ ...transferForm, fromBranchId: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Ke Cabang Tujuan</label>
                  <select
                    value={transferForm.toBranchId}
                    onChange={(e) =>
                      setTransferForm({ ...transferForm, toBranchId: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Bahan Baku</label>
                <select
                  value={transferForm.ingredientId}
                  onChange={(e) =>
                    setTransferForm({ ...transferForm, ingredientId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                >
                  {ingredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} (Tersedia asal:{' '}
                      {branchStocks[transferForm.fromBranchId]?.[ing.id] || 0} {ing.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Jumlah Dikirim (
                  {ingredients.find((i) => i.id === transferForm.ingredientId)?.unit})
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={transferForm.qty}
                  onChange={(e) => setTransferForm({ ...transferForm, qty: e.target.value })}
                  placeholder="Masukkan jumlah..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Keterangan Kurir</label>
                <input
                  type="text"
                  value={transferForm.note}
                  onChange={(e) => setTransferForm({ ...transferForm, note: e.target.value })}
                  placeholder="Contoh: Dikirim via kurir instan sore"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTransferModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                Proses Transfer Stok
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== MODAL 4: STOK OPNAME ==================== */}
      {opnameModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleOpnameSubmit}
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">Penyesuaian Stok Opname</h3>
                <p className="text-xs text-stone-500">
                  {opnameModal.name} — {currentBranch.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpnameModal(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl flex justify-between">
                <span className="text-stone-500">Stok Tercatat di Sistem:</span>
                <span className="font-bold text-stone-800">
                  {branchStocks[selectedBranchId]?.[opnameModal.id] || 0} {opnameModal.unit}
                </span>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Stok Fisik Aktual ({opnameModal.unit})
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={opnameActualQty}
                  onChange={(e) => setOpnameActualQty(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Alasan Selisih</label>
                <input
                  type="text"
                  value={opnameNote}
                  onChange={(e) => setOpnameNote(e.target.value)}
                  placeholder="Contoh: Tumpah / Kalibrasi grinder pagi"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpnameModal(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold"
              >
                Update Stok Fisik
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== MODAL 5: MASTER BAHAN BARU ==================== */}
      {newIngModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateIngredient}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">Tambah Master Bahan Baku</h3>
              <button
                type="button"
                onClick={() => setNewIngModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nama Bahan / Kemasan</label>
                <input
                  type="text"
                  required
                  value={newIngForm.name}
                  onChange={(e) => setNewIngForm({ ...newIngForm, name: e.target.value })}
                  placeholder="Contoh: Sirup Hazelnut / Bubuk Cokelat"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Satuan Takar</label>
                  <select
                    value={newIngForm.unit}
                    onChange={(e) => setNewIngForm({ ...newIngForm, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                  >
                    <option value="gr">gram (gr)</option>
                    <option value="ml">mililiter (ml)</option>
                    <option value="pcs">pcs / buah</option>
                    <option value="slice">slice / lembar</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Kategori</label>
                  <select
                    value={newIngForm.category}
                    onChange={(e) => setNewIngForm({ ...newIngForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                  >
                    <option value="Bahan Minuman">Bahan Minuman</option>
                    <option value="Bahan Makanan">Bahan Makanan</option>
                    <option value="Kemasan">Kemasan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">HPP / Satuan (Rp)</label>
                  <input
                    type="number"
                    value={newIngForm.costPerUnit}
                    onChange={(e) => setNewIngForm({ ...newIngForm, costPerUnit: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Batas Minimum</label>
                  <input
                    type="number"
                    value={newIngForm.minStock}
                    onChange={(e) => setNewIngForm({ ...newIngForm, minStock: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stok Awal Cabang</label>
                  <input
                    type="number"
                    value={newIngForm.initialStock}
                    onChange={(e) =>
                      setNewIngForm({ ...newIngForm, initialStock: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewIngModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
              >
                Tambah Bahan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== MODAL 6: TAMBAH MENU BARU (MANUAL HPP & HARGA JUAL) ==================== */}
      {newMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateNewMenu}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">Tambah Menu Kafe Baru</h3>
                <p className="text-xs text-stone-500">Input HPP & Harga Jual secara manual</p>
              </div>
              <button
                type="button"
                onClick={() => setNewMenuModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nama Menu</label>
                <input
                  type="text"
                  required
                  value={newMenuForm.name}
                  onChange={(e) => setNewMenuForm({ ...newMenuForm, name: e.target.value })}
                  placeholder="Contoh: Es Kopi Pandan"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Kategori</label>
                <select
                  value={newMenuForm.category}
                  onChange={(e) => setNewMenuForm({ ...newMenuForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                >
                  <option value="Kopi">Kopi</option>
                  <option value="Non-Kopi">Non-Kopi</option>
                  <option value="Pastry & Snack">Pastry & Snack</option>
                  <option value="Makanan Berat">Makanan Berat</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">HPP Manual (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newMenuForm.hpp}
                    onChange={(e) => setNewMenuForm({ ...newMenuForm, hpp: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newMenuForm.price}
                    onChange={(e) => setNewMenuForm({ ...newMenuForm, price: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewMenuModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
              >
                Simpan & Atur Resep
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== MODAL 7: TAMBAH CABANG BARU ==================== */}
      {newBranchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateBranch}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">Buka Cabang Kafe Baru</h3>
                <p className="text-xs text-stone-500">
                  Atur nama cabang, nama brand kafe, dan judul struknya
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNewBranchModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Nama Cabang / Wilayah
                </label>
                <input
                  type="text"
                  required
                  value={newBranchForm.name}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, name: e.target.value })}
                  placeholder="Contoh: Cabang Gresik Kota Baru"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Nama Kafe Cabang
                  </label>
                  <input
                    type="text"
                    required
                    value={newBranchForm.cafeName}
                    onChange={(e) =>
                      setNewBranchForm({
                        ...newBranchForm,
                        cafeName: e.target.value,
                        receiptName:
                          newBranchForm.receiptName || e.target.value.toUpperCase()
                      })
                    }
                    placeholder="Contoh: Kopi Senja Gresik"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Nama Kafe di Struk
                  </label>
                  <input
                    type="text"
                    required
                    value={newBranchForm.receiptName}
                    onChange={(e) =>
                      setNewBranchForm({
                        ...newBranchForm,
                        receiptName: e.target.value.toUpperCase()
                      })
                    }
                    placeholder="Contoh: KOPI SENJA GRESIK"
                    className="w-full px-3 py-2 bg-amber-50/60 border border-amber-300 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  value={newBranchForm.address}
                  onChange={(e) => setNewBranchForm({ ...newBranchForm, address: e.target.value })}
                  placeholder="Jl. Kalimantan No. 12..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Kepala Cabang</label>
                  <input
                    type="text"
                    value={newBranchForm.manager}
                    onChange={(e) =>
                      setNewBranchForm({ ...newBranchForm, manager: e.target.value })
                    }
                    placeholder="Nama PIC..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Jumlah Meja</label>
                  <input
                    type="number"
                    min="1"
                    value={newBranchForm.tables}
                    onChange={(e) =>
                      setNewBranchForm({ ...newBranchForm, tables: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewBranchModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
              >
                Aktifkan Cabang
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== MODAL 7B: EDIT NAMA KAFE & STRUK CABANG ==================== */}
      {editBranchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleEditBranchSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Edit Identitas Kafe & Struk Cabang
                </h3>
                <p className="text-xs text-stone-500">
                  Aplikasi utama tetap <strong>Ramu Jaya POS</strong>, namun nama kafe & struk tiap cabang dapat disesuaikan
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditBranchModal(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Nama Cabang / Lokasi
                </label>
                <input
                  type="text"
                  required
                  value={editBranchModal.name}
                  onChange={(e) =>
                    setEditBranchModal({ ...editBranchModal, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Nama Kafe di Cabang Ini
                </label>
                <input
                  type="text"
                  required
                  value={editBranchModal.cafeName || ''}
                  onChange={(e) =>
                    setEditBranchModal({ ...editBranchModal, cafeName: e.target.value })
                  }
                  placeholder="Contoh: Kopi Senja Sidoarjo"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Nama Kafe yang Tercetak di Struk (Header Struk)
                </label>
                <input
                  type="text"
                  required
                  value={editBranchModal.receiptName || ''}
                  onChange={(e) =>
                    setEditBranchModal({
                      ...editBranchModal,
                      receiptName: e.target.value.toUpperCase()
                    })
                  }
                  placeholder="Contoh: KOPI SENJA SIDOARJO"
                  className="w-full px-3 py-2 bg-amber-50/70 border border-amber-300 rounded-xl font-mono font-extrabold text-amber-900"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Teks ini akan dicetak tebal di bagian paling atas struk kasir & printer Bluetooth thermal.
                </p>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Alamat Lengkap di Struk</label>
                <input
                  type="text"
                  value={editBranchModal.address || ''}
                  onChange={(e) =>
                    setEditBranchModal({ ...editBranchModal, address: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">No. Telepon</label>
                  <input
                    type="text"
                    value={editBranchModal.phone || ''}
                    onChange={(e) =>
                      setEditBranchModal({ ...editBranchModal, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Kepala Cabang</label>
                  <input
                    type="text"
                    value={editBranchModal.manager || ''}
                    onChange={(e) =>
                      setEditBranchModal({ ...editBranchModal, manager: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Jml Meja</label>
                  <input
                    type="number"
                    min="1"
                    value={editBranchModal.tables || 10}
                    onChange={(e) =>
                      setEditBranchModal({ ...editBranchModal, tables: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditBranchModal(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== MODAL 8: TAMBAH AKUN KARYAWAN / ADMIN ==================== */}
      {newUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateUser}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Tambah Akun Login Karyawan / Admin
                </h3>
                <p className="text-xs text-stone-500">
                  Karyawan hanya dapat mengakses menu Kasir Penjualan (POS)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNewUserModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nama Karyawan / Admin</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="Contoh: Dinda (Kasir Sore)"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Username Login</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    placeholder="Contoh: dinda"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">PIN Login</label>
                  <input
                    type="text"
                    required
                    value={newUserForm.pin}
                    onChange={(e) => setNewUserForm({ ...newUserForm, pin: e.target.value })}
                    placeholder="Contoh: 4444"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Peran & Hak Akses</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                >
                  <option value="cashier">Karyawan Kasir (Hanya Transaksi Penjualan)</option>
                  <option value="owner">Admin / Owner (Akses Penuh Semua Menu)</option>
                </select>
              </div>

              {newUserForm.role === 'cashier' && (
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Penempatan Cabang Karyawan
                  </label>
                  <select
                    value={newUserForm.branchId}
                    onChange={(e) => setNewUserForm({ ...newUserForm, branchId: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewUserModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                Simpan Akun
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== MODAL 9: INSTALL APLIKASI (DESKTOP & ANDROID PWA) ==================== */}
      {installModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    Install Aplikasi Ramu Jaya POS
                  </h3>
                  <p className="text-xs text-stone-500">
                    Dukungan Web App (PWA) untuk Android & Desktop
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInstallModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                  <Smartphone className="w-4 h-4 text-amber-700" /> Install di HP / Tablet Android:
                </div>
                <ol className="list-decimal list-inside text-stone-700 space-y-1 leading-relaxed">
                  <li>Buka alamat situs aplikasi ini di browser <strong>Google Chrome</strong> Android.</li>
                  <li>Ketuk ikon titik tiga <strong>(⋮)</strong> di pojok kanan atas layar.</li>
                  <li>Pilih <strong>"Install aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</li>
                  <li>Ikon <strong>Ramu Jaya POS</strong> akan tampil di menu HP tanpa bar browser.</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                  <Monitor className="w-4 h-4 text-emerald-600" /> Install di Komputer / Laptop (Desktop):
                </div>
                <ol className="list-decimal list-inside text-stone-700 space-y-1 leading-relaxed">
                  <li>Buka situs aplikasi di <strong>Chrome</strong> atau <strong>Microsoft Edge</strong>.</li>
                  <li>Klik ikon <strong>Install (⊕)</strong> di ujung kanan kolom alamat URL.</li>
                  <li>Klik <strong>"Install"</strong> agar aplikasi berjalan di jendela sendiri dan muncul di Desktop.</li>
                </ol>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setInstallModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 10: PENGATURAN PRINTER BLUETOOTH THERMAL ==================== */}
      {printerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Bluetooth className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    Printer Bluetooth Thermal (ESC/POS)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Kompatibel dengan Eppos, VSC, Panda, Codeshop, Xprinter, dll.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPrinterModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Connection Status Box */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-400 block">Status Perangkat Bluetooth</span>
                  {btDevice ? (
                    <span className="font-bold text-sm text-emerald-700 flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {btDevice.name || 'Printer Thermal Terhubung'}
                    </span>
                  ) : (
                    <span className="font-bold text-sm text-stone-700 mt-0.5 block">
                      Belum Ada Printer Terhubung
                    </span>
                  )}
                </div>

                {btDevice ? (
                  <button
                    type="button"
                    onClick={disconnectBluetoothPrinter}
                    className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs border border-red-200"
                  >
                    Putuskan
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={btConnecting}
                    onClick={connectBluetoothPrinter}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Bluetooth className="w-3.5 h-3.5" />
                    {btConnecting ? 'Mencari...' : 'Cari & Pairing Printer'}
                  </button>
                )}
              </div>

              {/* Paper Width Setting */}
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">
                  Ukuran Kertas Thermal
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaperSize('58mm')}
                    className={`p-3 rounded-xl border text-left transition ${
                      paperSize === '58mm'
                        ? 'bg-amber-50 border-amber-600 text-amber-900 font-bold'
                        : 'bg-white border-stone-200 text-stone-600'
                    }`}
                  >
                    <div className="text-xs font-extrabold">Kertas 58mm (Standar Kasir HP)</div>
                    <div className="text-[10px] opacity-75 mt-0.5">Lebar 32 karakter per baris</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperSize('80mm')}
                    className={`p-3 rounded-xl border text-left transition ${
                      paperSize === '80mm'
                        ? 'bg-amber-50 border-amber-600 text-amber-900 font-bold'
                        : 'bg-white border-stone-200 text-stone-600'
                    }`}
                  >
                    <div className="text-xs font-extrabold">Kertas 80mm (Kasir Lebar)</div>
                    <div className="text-[10px] opacity-75 mt-0.5">Lebar 48 karakter per baris</div>
                  </button>
                </div>
              </div>

              {/* Auto-Print Toggle */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-stone-800">Cetak Otomatis Saat Bayar</p>
                  <p className="text-[11px] text-stone-500">
                    Langsung cetak struk ke Bluetooth begitu tombol bayar ditekan
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoPrintReceipt}
                  onChange={(e) => setAutoPrintReceipt(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
              </div>

              {/* Tips Penggunaan */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900 space-y-1">
                <p className="font-bold">💡 Tips Koneksi Printer Bluetooth:</p>
                <p>1. Nyalakan printer Bluetooth thermal dan pastikan Bluetooth HP/Laptop aktif.</p>
                <p>2. Gunakan browser <strong>Google Chrome</strong> di Android atau Desktop untuk fitur cetak langsung (Web Bluetooth ESC/POS).</p>
                <p>3. Tersedia juga opsi <strong>RawBT Android</strong> & <strong>Cetak USB/Browser</strong> pada layar struk.</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={handleTestBluetoothPrint}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Tes Cetak Struk
              </button>
              <button
                type="button"
                onClick={() => setPrinterModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 11: KONFIRMASI RESET RIWAYAT LAPORAN & MUTASI ==================== */}
      {resetReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-50 text-red-600">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    Reset Riwayat Laporan & Mutasi
                  </h3>
                  <p className="text-xs text-stone-500">
                    Pilih cakupan cabang dan jenis riwayat yang ingin dibersihkan
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResetReportModal(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Cakupan Cabang</label>
                <select
                  value={resetReportModal.scope}
                  onChange={(e) =>
                    setResetReportModal({ ...resetReportModal, scope: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-800"
                >
                  <option value="ALL">Semua Cabang (Bersihkan Seluruh Cabang)</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      Hanya {b.name} ({b.cafeName || ''})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Data yang Di-reset</label>
                <div className="space-y-2">
                  {[
                    {
                      id: 'all',
                      title: 'Semua Riwayat (Transaksi Kasir + Log Mutasi Stok)',
                      desc: 'Mengembalikan omzet, laba bersih, dan riwayat mutasi ke 0 (Stok fisik bahan saat ini tetap aman)'
                    },
                    {
                      id: 'trx',
                      title: 'Hanya Riwayat Transaksi Penjualan Kasir',
                      desc: 'Menghapus daftar struk penjualan & mereset perhitungan omzet/laba bersih'
                    },
                    {
                      id: 'logs',
                      title: 'Hanya Riwayat Log Mutasi & Belanja Stok',
                      desc: 'Menghapus catatan log belanja stok, transfer, dan stok opname'
                    }
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`block p-3 rounded-xl border cursor-pointer transition ${
                        resetReportModal.target === opt.id
                          ? 'bg-red-50/70 border-red-500 text-red-900'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        <input
                          type="radio"
                          name="resetTarget"
                          checked={resetReportModal.target === opt.id}
                          onChange={() =>
                            setResetReportModal({ ...resetReportModal, target: opt.id })
                          }
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span>{opt.title}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1 pl-5">{opt.desc}</p>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setResetReportModal(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmResetReports}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Ya, Reset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 12: KONFIRMASI HAPUS / TUTUP CABANG ==================== */}
      {deleteBranchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-50 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">
                    Hapus / Tutup Cabang Kafe
                  </h3>
                  <p className="text-xs text-stone-500">
                    Konfirmasi penutupan permanen cabang dari sistem
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeleteBranchModal(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 space-y-1">
                <p className="font-bold text-sm">
                  {deleteBranchModal.cafeName || deleteBranchModal.name} ({deleteBranchModal.name})
                </p>
                <p className="text-[11px] text-red-700">{deleteBranchModal.address}</p>
              </div>

              <p className="text-stone-600 leading-relaxed">
                Apakah Anda yakin ingin menghapus cabang ini? Seluruh data stok cabang, riwayat transaksi cabang, dan akun kasir khusus cabang ini akan ikut dihapus dari sistem.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setDeleteBranchModal(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBranch}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Hapus Cabang Permanen
              </button>
            </div>
          </div>
        </div>
      )}

                {renderCloudSyncModal()}
        {renderQrCodeModal()}
    </div>
  );
}