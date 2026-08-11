import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Mt5MobileTerminal } from "@/components/mt5/mt5-mobile-terminal";

vi.mock("@/store/mt5-accounts-store", () => ({
  useMt5AccountsStore: () => ({
    accounts: [
      {
        id: "acc1",
        nickname: "IC Markets Live",
        broker: "IC Markets",
        brokerServer: "ICMarkets-Live03",
        accountNumber: "8742931",
        accountType: "INVESTOR",
        balance: 24850.42,
        equity: 25120.18,
        freeMargin: 18440.55,
        marginLevel: 412.6,
        leverage: "1:500",
        connected: true,
        openTrades: 3,
        recentOrders: [],
      },
    ],
  }),
}));

describe("Mt5MobileTerminal", () => {
  it("renders Quotes tab with symbols and bottom navigation", () => {
    render(<Mt5MobileTerminal />);
    expect(screen.getByRole("heading", { name: /mt5 mobile terminal/i })).toBeInTheDocument();
    expect(screen.getByText("EURUSD")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /mt5 mobile tabs/i })).toBeInTheDocument();
  });

  it("switches to Trade tab and shows account equity", () => {
    render(<Mt5MobileTerminal />);
    fireEvent.click(screen.getByRole("button", { name: /^trade$/i }));
    expect(screen.getByText("Equity")).toBeInTheDocument();
    expect(screen.getByText("Positions (4)")).toBeInTheDocument();
  });

  it("opens Chart tab from bottom nav", () => {
    render(<Mt5MobileTerminal />);
    fireEvent.click(screen.getByRole("button", { name: /^chart$/i }));
    expect(screen.getByRole("img", { name: /candlestick chart/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /buy/i })).toBeInTheDocument();
  });
});
