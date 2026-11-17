import React from "react";
import { fireEvent, render as rtlRender, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LanguageProvider } from "@/components/LanguageContext";
import { RightPanel } from "@/components/dashboard/RightPanel";
import { SettingsView } from "@/components/dashboard/SettingsView";
import { NotificationsView } from "@/components/dashboard/NotificationsView";
import { PatientVitalsCard } from "@/components/dashboard/PatientVitalsCard";
import { DailyMedicationTracker } from "@/components/dashboard/DailyMedicationTracker";
import { MedicalRecordsView } from "@/components/dashboard/MedicalRecordsView";
import { LiveOPDQueueTracker } from "@/components/dashboard/LiveOPDQueueTracker";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatCards } from "@/components/dashboard/StatCards";
import { ScheduledEventsCard } from "@/components/dashboard/ScheduledEventsCard";
import { PlansCard } from "@/components/dashboard/PlansCard";

const render = (ui: React.ReactElement) =>
  rtlRender(<LanguageProvider>{ui}</LanguageProvider>);

describe("Dashboard Components", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ records: [], latestVitals: null, state: null }),
    } as Response);
  });
  it("renders WelcomeBanner with greeting and upcoming count", () => {
    render(<WelcomeBanner userName="Rahul Sharma" upcomingCount={3} />);
    expect(screen.getByText(/Good Day, Rahul Sharma!/i)).toBeInTheDocument();
    expect(screen.getByText(/3 upcoming consultations/i)).toBeInTheDocument();
  });

  it("renders StatCards with live appointment and record metric labels", () => {
    render(<StatCards completedVisits={4} upcomingConsultations={9} clinicalRecords={19} />);
    expect(screen.getByText("Completed visits")).toBeInTheDocument();
    expect(screen.getByText("Upcoming consultations")).toBeInTheDocument();
    expect(screen.getByText("Medical records")).toBeInTheDocument();
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

  it("renders recorded treatment plans", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        records: [{
          id: "plan-1",
          diagnosis: "Seasonal allergy",
          treatmentPlan: "Follow up in two weeks",
          createdAt: "2026-01-01T10:00:00.000Z",
          doctor: { user: { name: "Dr. Test" } },
        }],
      }),
    } as Response);

    render(<PlansCard />);
    expect(await screen.findByText("Seasonal allergy")).toBeInTheDocument();
    expect(screen.getByText("Follow up in two weeks")).toBeInTheDocument();
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

  it("renders recorded clinical vitals from the API", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        records: [],
        latestVitals: {
          bloodPressure: "120/80",
          heartRate: "72",
          bloodSugar: "94",
          spo2: "99",
          weight: "68 kg",
          temperature: "98.4",
          recordedAt: "2026-01-01T10:00:00.000Z",
          doctorName: "Dr. Test",
        },
      }),
    } as Response);

    render(<PatientVitalsCard />);

    expect(screen.getByText("Clinical Health Vitals")).toBeInTheDocument();
    expect(screen.getByText("Blood Pressure")).toBeInTheDocument();
    expect(await screen.findByText("120/80")).toBeInTheDocument();
    expect(screen.getByText("Heart Rate")).toBeInTheDocument();
    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByText(/Oxygen/i)).toBeInTheDocument();
    expect(screen.getByText("99")).toBeInTheDocument();
  });

  it("reuses dashboard clinical data without refetching records", () => {
    global.fetch = jest.fn();
    const records = [{
      id: "record-1",
      diagnosis: "Seasonal allergy",
      treatmentPlan: "Follow up in two weeks",
      createdAt: "2026-01-01T10:00:00.000Z",
      doctor: { user: { name: "Dr. Test" } },
    }];

    render(
      <>
        <PatientVitalsCard
          dashboardData={{
            vitals: {
              bloodPressure: "120/80",
              heartRate: null,
              bloodSugar: null,
              spo2: null,
              weight: null,
              temperature: null,
              recordedAt: null,
              doctorName: null,
            },
            loading: false,
            error: null,
          }}
        />
        <PlansCard dashboardData={{ records, loading: false, error: null }} />
      </>
    );

    expect(screen.getByText("120/80")).toBeInTheDocument();
    expect(screen.getByText("Follow up in two weeks")).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("does not show invented vitals when no clinical record exists", async () => {
    render(<PatientVitalsCard />);
    expect(await screen.findAllByText("—")).toHaveLength(6);
  });

  it("shows an empty state instead of demo medications when none are prescribed", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ medications: [] }),
    } as Response);

    render(<DailyMedicationTracker />);
    expect(await screen.findByText("No prescribed medications are linked to your account.")).toBeInTheDocument();
    expect(screen.queryByText("Atorvastatin")).not.toBeInTheDocument();
    expect(screen.getByTestId("log-medication-dose-btn")).toBeDisabled();
  });

  it("shows clinical records returned by the API", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        records: [{
          id: "record-1",
          diagnosis: "Seasonal allergy",
          treatmentPlan: "Follow up in two weeks",
          notes: null,
          createdAt: "2026-01-01T10:00:00.000Z",
          doctor: { user: { name: "Dr. Test" } },
        }],
        latestVitals: null,
      }),
    } as Response);

    render(<MedicalRecordsView userName="Test Patient" onReturnToOverview={jest.fn()} />);
    expect(await screen.findByText("Seasonal allergy")).toBeInTheDocument();
    expect(screen.getByText(/Follow up in two weeks/)).toBeInTheDocument();
    expect(screen.getByText(/Recorded by Dr\. Test/)).toBeInTheDocument();
  });

  it("renders LiveOPDQueueTracker with themed tokens, chamber details, and queue steps", () => {
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
