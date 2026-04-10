import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Save lead to Supabase
    const { data: lead, error } = await supabase.from("leads").insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
      location: body.location || "",
      how_found: body.howFound || "",
      services: body.services || [],
      areas: body.areas || [],
      timeline: body.timeline || "",
      budget: body.budget || "",
      preferred_contact: body.preferredContact || ["Phone"],
      message: body.message || "",
      status: "new",
      archived: false,
      notes: "",
      payments: [],
    }).select().single();

    if (error) throw error;

    // 2. Send auto-reply email via Resend (if configured)
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || "Steadfast Renovation <noreply@steadfastreno.ca>",
            to: body.email,
            subject: "Thank you for contacting Steadfast Renovation",
            text: `Hi ${body.name},\n\nThank you for reaching out to Steadfast Renovation. We've received your inquiry and our team will review your project details carefully.\n\nYou can expect a call or email from us within 24 hours to discuss your project further.\n\nBest regards,\nSteadfast Renovation Inc.\n+1 (416) 834-5484`,
          }),
        });
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
      }
    }

    // 3. Send SMS notification via Twilio (if configured)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      try {
        const sid = process.env.TWILIO_ACCOUNT_SID;
        const token = process.env.TWILIO_AUTH_TOKEN;
        const from = process.env.TWILIO_PHONE_NUMBER;
        const to = process.env.NOTIFY_PHONE_NUMBER || "+14168345484";

        const smsBody = `NEW LEAD: ${body.name} | ${body.phone} | ${(body.services || []).join(", ")} | Budget: ${body.budget || "N/A"} | ${body.location || "No location"}`;

        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
          },
          body: new URLSearchParams({ From: from, To: to, Body: smsBody }),
        });
      } catch (smsErr) {
        console.error("SMS send failed:", smsErr);
      }
    }

    return NextResponse.json({ success: true, lead });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
