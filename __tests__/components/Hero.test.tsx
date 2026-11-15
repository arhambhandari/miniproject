import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { LanguageProvider } from "@/components/LanguageContext";
import { Hero } from "@/components/home/Hero";
import type { Doctor } from "@/types";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt?: string }) => <div role="img" aria-label={alt} />,
}));

const doctors: Doctor[] = [
  {
    id: "doctor-1",
    specialization: "Cardiology",
    experience: 12,
    satisfaction: 98,
    hospitalName: "Heart Center",
    nextAvailable: "Today",
    user: { name: "Dr. Asha Mehta" },
  },
  {
    id: "doctor-2",
    specialization: "Dermatology",
    experience: 8,
    satisfaction: 95,
    hospitalName: "Skin Clinic",
    nextAvailable: "Tomorrow",
    user: { name: "Dr. Ravi Shah" },
  },
];

describe("Homepage doctor search", () => {
  it("opens booking for a matching doctor suggestion", () => {
    const onBook = jest.fn();
    render(
      <LanguageProvider>
        <Hero doctors={doctors} onBook={onBook} />
      </LanguageProvider>
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "cardio" },
    });

    expect(screen.getByRole("listbox", { name: "Matching doctors" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Dr\. Asha Mehta.*Cardiology/ })).toBeInTheDocument();
    expect(screen.queryByText("Dr. Ravi Shah")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: /Dr\. Asha Mehta.*Cardiology/ }));

    expect(onBook).toHaveBeenCalledWith(doctors[0]);
  });

  it("does not show suggestions for an unmatched query", () => {
    render(
      <LanguageProvider>
        <Hero doctors={doctors} onBook={jest.fn()} />
      </LanguageProvider>
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "neurology" },
    });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
