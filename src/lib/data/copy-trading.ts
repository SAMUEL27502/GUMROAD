export type CopyLeader = {
  id: string;
  handle: string;
  name: string;
  roi30d: number;
  maxDd: number;
  copiers: number;
  minAllocation: number;
  feePercent: number;
  risk: "LOW" | "MEDIUM" | "HIGH";
  strategy: string;
  open: boolean;
};

export type CopyAllocation = {
  id: string;
  leaderId: string;
  allocation: number;
  pnl: number;
  status: "ACTIVE" | "PAUSED";
};

export const copyLeaders: CopyLeader[] = [
  {
    id: "cl1",
    handle: "novacapital",
    name: "NovaCapital",
    roi30d: 8.4,
    maxDd: 6.2,
    copiers: 312,
    minAllocation: 500,
    feePercent: 20,
    risk: "MEDIUM",
    strategy: "Multi-bot portfolio",
    open: true,
  },
  {
    id: "cl2",
    handle: "goldedge",
    name: "GoldEdge",
    roi30d: 11.2,
    maxDd: 12.5,
    copiers: 188,
    minAllocation: 1000,
    feePercent: 25,
    risk: "HIGH",
    strategy: "XAUUSD scalping",
    open: true,
  },
  {
    id: "cl3",
    handle: "quietgrid",
    name: "QuietGrid",
    roi30d: 4.1,
    maxDd: 3.8,
    copiers: 540,
    minAllocation: 250,
    feePercent: 15,
    risk: "LOW",
    strategy: "Asian grid",
    open: true,
  },
  {
    id: "cl4",
    handle: "londonbreak",
    name: "LondonBreak",
    roi30d: 6.7,
    maxDd: 8.1,
    copiers: 96,
    minAllocation: 750,
    feePercent: 20,
    risk: "MEDIUM",
    strategy: "Session breakouts",
    open: false,
  },
];

export const myCopyAllocations: CopyAllocation[] = [
  { id: "ca1", leaderId: "cl1", allocation: 2500, pnl: 186.4, status: "ACTIVE" },
  { id: "ca2", leaderId: "cl3", allocation: 800, pnl: 42.1, status: "ACTIVE" },
];
