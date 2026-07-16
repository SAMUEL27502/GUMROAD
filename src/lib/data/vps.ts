export type VpsPlan = {
  id: string;
  name: string;
  region: string;
  cpu: string;
  ram: string;
  disk: string;
  latencyMs: number;
  price: number;
  status: "RUNNING" | "STOPPED" | "PROVISIONING";
  mt5Slots: number;
  usedSlots: number;
};

export type VpsMetric = { time: string; cpu: number; ram: number; net: number };

export const vpsInstances: VpsPlan[] = [
  {
    id: "vps1",
    name: "London-Edge-01",
    region: "London (LD4)",
    cpu: "4 vCPU",
    ram: "8 GB",
    disk: "80 GB NVMe",
    latencyMs: 12,
    price: 29,
    status: "RUNNING",
    mt5Slots: 4,
    usedSlots: 3,
  },
  {
    id: "vps2",
    name: "NY-Core-02",
    region: "New York (NY4)",
    cpu: "2 vCPU",
    ram: "4 GB",
    disk: "40 GB NVMe",
    latencyMs: 18,
    price: 19,
    status: "RUNNING",
    mt5Slots: 2,
    usedSlots: 2,
  },
  {
    id: "vps3",
    name: "Tokyo-Node-01",
    region: "Tokyo (TY3)",
    cpu: "4 vCPU",
    ram: "8 GB",
    disk: "80 GB NVMe",
    latencyMs: 22,
    price: 29,
    status: "PROVISIONING",
    mt5Slots: 4,
    usedSlots: 0,
  },
];

export const vpsMetrics: VpsMetric[] = [
  { time: "00:00", cpu: 22, ram: 41, net: 12 },
  { time: "04:00", cpu: 18, ram: 39, net: 8 },
  { time: "08:00", cpu: 44, ram: 52, net: 28 },
  { time: "12:00", cpu: 61, ram: 58, net: 36 },
  { time: "16:00", cpu: 48, ram: 55, net: 31 },
  { time: "20:00", cpu: 33, ram: 47, net: 19 },
];

export const vpsCatalog = [
  { id: "starter", name: "Starter VPS", price: 19, specs: "2 vCPU · 4 GB · 2 MT5" },
  { id: "pro", name: "Pro VPS", price: 29, specs: "4 vCPU · 8 GB · 4 MT5" },
  { id: "elite", name: "Elite VPS", price: 59, specs: "8 vCPU · 16 GB · 8 MT5" },
];
