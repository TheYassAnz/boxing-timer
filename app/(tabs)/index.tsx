import Timer from "@/components/timer";

export default function Index() {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 10);
  return <Timer expiryTimestamp={time} />;
}
