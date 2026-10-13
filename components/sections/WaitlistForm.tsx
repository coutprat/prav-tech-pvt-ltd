"use client";

import { MailForm } from "@/components/sections/MailForm";

export function WaitlistForm() {
  return (
    <MailForm
      subject="MENNIE waitlist"
      submitLabel="Join the waitlist"
      fields={[
        { name: "name", label: "Name", required: true, autoComplete: "name" },
        { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email" },
        { name: "org", label: "Hospital or organisation", required: true, autoComplete: "organization" },
        {
          name: "role",
          label: "Your role",
          type: "select",
          options: ["Clinician", "Hospital administration", "IT", "Other"]
        },
        {
          name: "context",
          label: "What does the queue look like today?",
          type: "textarea",
          placeholder: "Rough daily volume, where patients get stuck, languages spoken."
        }
      ]}
    />
  );
}
