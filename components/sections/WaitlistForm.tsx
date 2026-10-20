"use client";

import { EnquiryForm } from "@/components/sections/EnquiryForm";

export function WaitlistForm() {
  return (
    <EnquiryForm
      subject="MENNIE waitlist"
      submitLabel="Join the waitlist"
      kind="waitlist"
      nextStep="We will write to you personally before MENNIE opens to new hospitals."
      fields={[
        { name: "name", label: "Name", required: true, autoComplete: "name" },
        {
          name: "email",
          label: "Work email",
          type: "email",
          required: true,
          autoComplete: "email"
        },
        {
          name: "org",
          label: "Hospital or organisation",
          required: true,
          autoComplete: "organization"
        },
        {
          name: "role",
          label: "Your role",
          type: "select",
          options: ["Clinician", "Hospital administration", "IT", "Other"]
        },
        {
          name: "message",
          label: "What does the queue look like today?",
          type: "textarea",
          // The API needs a few words here; say so before submit, not after.
          required: true,
          placeholder: "Rough daily volume, where patients get stuck, languages spoken."
        }
      ]}
    />
  );
}
