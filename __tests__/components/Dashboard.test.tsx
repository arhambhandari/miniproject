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
});
