export type KycStatus = "NOT_STARTED" | "PENDING" | "APPROVED" | "REJECTED";

export type KycStep = {
  id: string;
  title: string;
  description: string;
  done: boolean;
};

export const defaultKycSteps: KycStep[] = [
  {
    id: "identity",
    title: "Government ID",
    description: "Passport or national ID — front and back.",
    done: false,
  },
  {
    id: "selfie",
    title: "Selfie check",
    description: "Hold your ID next to your face for liveness.",
    done: false,
  },
  {
    id: "address",
    title: "Proof of address",
    description: "Utility bill or bank statement from the last 90 days.",
    done: false,
  },
  {
    id: "review",
    title: "Compliance review",
    description: "Usually completed within 1 business day.",
    done: false,
  },
];
