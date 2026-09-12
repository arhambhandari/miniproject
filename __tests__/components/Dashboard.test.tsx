import React from "react";
import { render as rtlRender, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LanguageProvider } from "@/components/LanguageContext";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatCards } from "@/components/dashboard/StatCards";
import { ScheduledEventsCard } from "@/components/dashboard/ScheduledEventsCard";
import { PlansCard } from "@/components/dashboard/PlansCard";

const render = (ui: React.ReactElement) =>
  rtlRender(<LanguageProvider>{ui}</LanguageProvider>);

describe("Dashboard Components", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ records: [], latestVitals: null, state: null }),
      })
    ) as any;
  });
  it("renders WelcomeBanner with greeting and upcoming count", () => {
    render(<WelcomeBanner userName="Rahul Sharma" upcomingCount={3} />);
    expect(screen.getByText(/Good Day, Rahul Sharma!/i)).toBeInTheDocument();
    expect(screen.getByText(/3 upcoming consultations/i)).toBeInTheDocument();
  });

  it("renders StatCards with In-Clinic OPD, Prescriptions, and Laboratory work metrics", () => {
    render(<StatCards completedVisits={4} upcomingConsultations={9} labAnalyses={19} />);
    expect(screen.getByText("In-Clinic OPD")).toBeInTheDocument();
    expect(screen.getByText(/Prescriptions/i)).toBeInTheDocument();
    expect(screen.getByText(/Diagnostics|Laboratory/i)).toBeInTheDocument();
  });

  it("renders ScheduledEventsCard with completion rate and breakdown", () => {
    render(
      <ScheduledEventsCard
        consultationsCount={25}
        labCount={10}
        meetingsCount={3}
        completionRate={95}
      />
    );
    expect(screen.getByText("My Scheduled Events")).toBeInTheDocument();
    expect(screen.getByText("95%")).toBeInTheDocument();
    expect(screen.getByText("Consultations")).toBeInTheDocument();
    expect(screen.getByText("Laboratory analyzes")).toBeInTheDocument();
    expect(screen.getByText("Follow-up meetings")).toBeInTheDocument();
  });

  it("renders PlansCard with progress bars and Add plan button", () => {
    render(<PlansCard />);
    expect(screen.getByText("My Plans Done")).toBeInTheDocument();
    expect(screen.getByText("Consultations")).toBeInTheDocument();
    expect(screen.getByText("Analysis & Diagnostics")).toBeInTheDocument();
    expect(screen.getByText("Follow-up Meetings")).toBeInTheDocument();
    expect(screen.getByText("Add plan")).toBeInTheDocument();
  });

  it("allows toggling time range dropdown and switching period in PlansCard", () => {
    const { fireEvent } = require("@testing-library/react");
    render(<PlansCard />);

    // Click the time range dropdown button
    const toggleButton = screen.getByRole("button", { name: /today/i });
    fireEvent.click(toggleButton);

    // Check that dropdown menu appeared with options
    expect(screen.getByText("This Week")).toBeInTheDocument();
    expect(screen.getByText("This Month")).toBeInTheDocument();

    // Select 'This Week'
    fireEvent.click(screen.getByText("This Week"));

    // Verify 'This Week' is now active
    expect(screen.getAllByText("This Week").length).toBeGreaterThan(0);
    // Verify updated completion text for This Week (e.g. 9 of 11 completed)
    expect(screen.getByText("9 of 11 completed")).toBeInTheDocument();
  });

  it("renders RightPanel with dynamic calendar and today's schedule", () => {
    const today = new Date();
    const todayFormatted = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const mockAppointments = [
      {
        id: "app_test_1",
        patientName: "Rahul Sharma",
        doctorId: "doc_1",
        doctorName: "Dr. Aarav Mehta",
        specialty: "Neuro-Oncology",
        date: todayFormatted,
        time: "10:00 AM",
        status: "Upcoming" as const,
        fee: "₹2,000",
      },
    ];

    const { RightPanel } = require("@/components/dashboard/RightPanel");
    render(
      <RightPanel
        userName="Rahul Sharma"
        userEmail="rahul@example.com"
        appointments={mockAppointments}
      />
    );

    expect(screen.getByText("My Calendar")).toBeInTheDocument();
    expect(screen.getByText("Consultation with Dr. Aarav Mehta")).toBeInTheDocument();
    expect(screen.getByText("Neuro-Oncology")).toBeInTheDocument();
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
  });

  it("renders SettingsView with all detailed sections (profile, notifications, security, billing)", () => {
    const { fireEvent } = require("@testing-library/react");
    const { SettingsView } = require("@/components/dashboard/SettingsView");
    const onReturn = jest.fn();

    render(
      <SettingsView
        userName="Rahul Sharma"
        userEmail="rahul.sharma@example.com"
        onReturnToOverview={onReturn}
      />
    );

    // Header & profile inputs
    expect(screen.getByText("Account Settings")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Rahul Sharma")).toBeInTheDocument();
    expect(screen.getByDisplayValue("rahul.sharma@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+91 98765 43210")).toBeInTheDocument();
    expect(screen.getByDisplayValue("A(II) Rh+")).toBeInTheDocument();

    // Switch to Notifications tab
    fireEvent.click(screen.getByRole("button", { name: /Notifications/i }));
    expect(screen.getByText("Appointment Email Confirmations")).toBeInTheDocument();
    expect(screen.getByText("SMS / WhatsApp Reminders")).toBeInTheDocument();

    // Switch to Security tab
    fireEvent.click(screen.getByRole("button", { name: /Security & Login/i }));
    expect(screen.getByText("Two-Factor Authentication (2FA)")).toBeInTheDocument();
    expect(screen.getByText("Change Password")).toBeInTheDocument();

    // Switch to Billing tab
    fireEvent.click(screen.getByRole("button", { name: /Payments & Billing/i }));
    expect(screen.getByText("Payment Methods & Invoices")).toBeInTheDocument();
    expect(screen.getByText("Razorpay Instant UPI & Cards")).toBeInTheDocument();
  });

  it("renders NotificationsView with filter pills and notification items", () => {
    const { fireEvent } = require("@testing-library/react");
    const { NotificationsView } = require("@/components/dashboard/NotificationsView");
    const onReturn = jest.fn();
    const onNav = jest.fn();

    render(
      <NotificationsView
        onReturnToOverview={onReturn}
        onNavigateToTab={onNav}
      />
    );

    expect(screen.getByText("Notifications & Activity Center")).toBeInTheDocument();
    expect(screen.getByText(/Upcoming In-Clinic Consultation in 2 Hours/i)).toBeInTheDocument();
    expect(screen.getByText(/Complete Blood Count \(CBC\) Report Ready/i)).toBeInTheDocument();

    // Filter by Unread
    fireEvent.click(screen.getByText(/Unread/i));
    expect(screen.getByText(/Upcoming In-Clinic Consultation in 2 Hours/i)).toBeInTheDocument();

    // Test Back button
    fireEvent.click(screen.getByText("← Back to Dashboard"));
    expect(onReturn).toHaveBeenCalledTimes(1);
  });

  it("renders PatientVitalsCard with clinical health biometrics", () => {
    const { PatientVitalsCard } = require("@/components/dashboard/PatientVitalsCard");
    render(<PatientVitalsCard />);

    expect(screen.getByText("Clinical Health Vitals")).toBeInTheDocument();
    expect(screen.getByText("Blood Pressure")).toBeInTheDocument();
    expect(screen.getByText("120/80")).toBeInTheDocument();
    expect(screen.getByText("Heart Rate")).toBeInTheDocument();
    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByText(/Oxygen/i)).toBeInTheDocument();
    expect(screen.getByText("99")).toBeInTheDocument();
  });

  it("renders LiveOPDQueueTracker with themed tokens, chamber details, and queue steps", () => {
    const { LiveOPDQueueTracker } = require("@/components/dashboard/LiveOPDQueueTracker");
    render(
      <LiveOPDQueueTracker
        upcomingAppointment={{
          id: "app_1",
          patientName: "Rahul Sharma",
          doctorId: "doc_1",
          doctorName: "Dr. Vikramaditya",
          specialty: "Neuro-Oncology",
          date: "Today",
          time: "10:30 AM",
          status: "Upcoming",
          fee: "₹2,000",
          hospitalName: "Apollo Specialty Hospital, Mumbai",
          roomNumber: "OPD Chamber 304",
          tokenNumber: "Token #A-08",
        }}
        onOpenPass={jest.fn()}
      />
    );

    expect(screen.getByText("Live Hospital OPD Queue Tracker")).toBeInTheDocument();
    expect(screen.getByText(/Apollo Specialty Hospital, Mumbai/i)).toBeInTheDocument();
    expect(screen.getByText(/OPD Chamber 304/i)).toBeInTheDocument();
    expect(screen.getByText("Token #A-08")).toBeInTheDocument();
  });
});

