import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatCards } from "@/components/dashboard/StatCards";
import { ScheduledEventsCard } from "@/components/dashboard/ScheduledEventsCard";
import { PlansCard } from "@/components/dashboard/PlansCard";

describe("Dashboard Components", () => {
  it("renders WelcomeBanner with greeting and upcoming count", () => {
    render(<WelcomeBanner userName="Rahul Sharma" upcomingCount={3} />);
    expect(screen.getByText(/Good Day, Rahul Sharma!/i)).toBeInTheDocument();
    expect(screen.getByText(/3 upcoming consultations/i)).toBeInTheDocument();
  });

  it("renders StatCards with Offline, Online, and Laboratory work metrics", () => {
    render(<StatCards completedVisits={4} upcomingConsultations={9} labAnalyses={19} />);
    expect(screen.getByText("Offline Work")).toBeInTheDocument();
    expect(screen.getByText("Online Work")).toBeInTheDocument();
    expect(screen.getByText("Laboratory Work")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("19")).toBeInTheDocument();
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
        doctorName: "Dr. Elena Rostova",
        specialty: "Neuro-Oncology",
        date: todayFormatted,
        time: "10:00 AM",
        status: "Upcoming" as const,
        fee: "₹1,500",
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

    expect(screen.getByText("My Profile")).toBeInTheDocument();
    expect(screen.getByText("My Calendar")).toBeInTheDocument();
    expect(screen.getByText("Consultation with Dr. Elena Rostova")).toBeInTheDocument();
    expect(screen.getByText("Neuro-Oncology")).toBeInTheDocument();
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
  });
});
