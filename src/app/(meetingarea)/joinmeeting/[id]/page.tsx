import MeetingChat from "@/components/MeetingChat";

export default async function JoinMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <MeetingChat meetingId={id} />;
}