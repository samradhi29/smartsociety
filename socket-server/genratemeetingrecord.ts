import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import Message from "./models/message";
import MeetingReport from "./models/Meetingreports";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export default async function generateMeetingReport(
  meetingId: string
) {
  try {
    const messages = await Message.find({ meetingId });

    if (!messages.length) {
      return "No messages found for this meeting.";
    }

    let prompt = `
Summarize the following meeting into a short, clear report (max 5 bullet points).
Include only the key discussion topics, decisions, and next steps if discussed.
Don't add anything not present in the text.
Avoid tables, roles, fake people, and unnecessary details.
`;

    messages.forEach((msg: any) => {
      prompt += `${msg.sender}: ${msg.content}\n`;
    });

    const response = await openai.chat.completions.create({
      model: "gpt-oss-20b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const report = response.choices[0].message.content;

    const savedReport = await new MeetingReport({
      meetingId,
      report,
    }).save();

    console.log("Meeting report generated and saved.");

    return savedReport;
  } catch (err) {
    console.error("Error generating meeting report:", err);
    return null;
  }
}