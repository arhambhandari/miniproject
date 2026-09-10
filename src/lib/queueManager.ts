import type { QueueState, QueueTokenItem } from "@/types";

const INITIAL_QUEUE_TOKENS: QueueTokenItem[] = [
  {
    tokenNumber: "Token #A-06",
    patientName: "Ramesh Verma",
    time: "10:00 AM",
    status: "SERVING",
  },
  {
    tokenNumber: "Token #A-07",
    patientName: "Sunita Patel",
    time: "10:15 AM",
    status: "WAITING",
  },
  {
    tokenNumber: "Token #A-08",
    patientName: "Rahul Sharma",
    time: "10:30 AM",
    status: "WAITING",
    patientId: "patient_demo_1",
  },
  {
    tokenNumber: "Token #A-09",
    patientName: "Ananya Iyer",
    time: "10:45 AM",
    status: "WAITING",
  },
  {
    tokenNumber: "Token #A-10",
    patientName: "Devendra Joshi",
    time: "11:00 AM",
    status: "WAITING",
  },
];

const INITIAL_QUEUE_STATE: QueueState = {
  doctorName: "Dr. Vikramaditya Rathore",
  hospitalName: "Apollo Specialty Hospital, Mumbai",
  roomNumber: "OPD Chamber 304",
  currentServingToken: "Token #A-06",
  currentPatientName: "Ramesh Verma",
  status: "ACTIVE",
  delayMinutes: 0,
  tokens: INITIAL_QUEUE_TOKENS,
  lastUpdated: Date.now(),
  announcement: "Now Serving: Token #A-06 (Ramesh Verma) in OPD Chamber 304",
};

type QueueListener = (state: QueueState) => void;

class OPDQueueManager {
  private state: QueueState;
  private listeners: Set<QueueListener> = new Set();

  constructor() {
    this.state = {
      ...INITIAL_QUEUE_STATE,
      tokens: INITIAL_QUEUE_TOKENS.map((t) => ({ ...t })),
    };
  }

  public getQueueState(): QueueState {
    return {
      ...this.state,
      tokens: this.state.tokens.map((t) => ({ ...t })),
    };
  }

  private notify() {
    this.state.lastUpdated = Date.now();
    const snapshot = this.getQueueState();
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (err) {
        console.error("Error notifying queue listener:", err);
      }
    });
  }

  public subscribe(listener: QueueListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public advanceQueue(): QueueState {
    const currentIdx = this.state.tokens.findIndex(
      (t) => t.tokenNumber === this.state.currentServingToken
    );

    if (currentIdx !== -1) {
      this.state.tokens[currentIdx].status = "COMPLETED";
    }

    // Find next WAITING token
    const nextIdx = this.state.tokens.findIndex((t) => t.status === "WAITING");

    if (nextIdx !== -1) {
      const nextToken = this.state.tokens[nextIdx];
      nextToken.status = "SERVING";
      this.state.currentServingToken = nextToken.tokenNumber;
      this.state.currentPatientName = nextToken.patientName;
      this.state.announcement = `Now Calling: ${nextToken.tokenNumber} (${nextToken.patientName}) to ${this.state.roomNumber}`;
      this.state.status = "ACTIVE";
    } else {
      this.state.status = "IDLE";
      this.state.announcement = `All scheduled consultations for this slot are completed.`;
    }

    this.notify();
    return this.getQueueState();
  }

  public callDirectToken(tokenNumber: string): QueueState {
    const targetIdx = this.state.tokens.findIndex((t) => t.tokenNumber === tokenNumber);

    if (targetIdx !== -1) {
      // Mark old serving as completed
      const currentIdx = this.state.tokens.findIndex(
        (t) => t.tokenNumber === this.state.currentServingToken
      );
      if (currentIdx !== -1 && currentIdx !== targetIdx) {
        this.state.tokens[currentIdx].status = "COMPLETED";
      }

      this.state.tokens[targetIdx].status = "SERVING";
      this.state.currentServingToken = this.state.tokens[targetIdx].tokenNumber;
      this.state.currentPatientName = this.state.tokens[targetIdx].patientName;
      this.state.announcement = `Priority Call: ${this.state.tokens[targetIdx].tokenNumber} (${this.state.tokens[targetIdx].patientName}) please proceed immediately to ${this.state.roomNumber}`;
      this.state.status = "ACTIVE";
      this.notify();
    }

    return this.getQueueState();
  }

  public setEmergencyDelay(delayMinutes: number, reason?: string): QueueState {
    this.state.delayMinutes = delayMinutes;
    this.state.status = "EMERGENCY_DELAY";
    this.state.delayReason = reason || "Doctor attending to an urgent trauma consultation in ICU.";
    this.state.announcement = `OPD Schedule Notice: Queue delayed by ~${delayMinutes} mins due to emergency. Thank you for your patience.`;
    this.notify();
    return this.getQueueState();
  }

  public resolveEmergencyDelay(): QueueState {
    this.state.delayMinutes = 0;
    this.state.status = "ACTIVE";
    this.state.delayReason = undefined;
    this.state.announcement = `OPD consultations have resumed normally.`;
    this.notify();
    return this.getQueueState();
  }

  public resetQueue(): QueueState {
    this.state = {
      ...INITIAL_QUEUE_STATE,
      tokens: INITIAL_QUEUE_TOKENS.map((t) => ({ ...t })),
      lastUpdated: Date.now(),
    };
    this.notify();
    return this.getQueueState();
  }
}

// Preserve singleton across hot reloads in Next.js development
const globalForQueue = globalThis as unknown as {
  medibookQueueManager?: OPDQueueManager;
};

export const queueManager =
  globalForQueue.medibookQueueManager ?? new OPDQueueManager();

if (process.env.NODE_ENV !== "production") {
  globalForQueue.medibookQueueManager = queueManager;
}
