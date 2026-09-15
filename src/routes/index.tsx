import { createFileRoute } from "@tanstack/react-router";
import { BirthdayStory } from "@/features/birthday/BirthdayStory";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday, Kriti aka Alexx" },
      { name: "description", content: "A tiny interactive birthday world made especially for Kriti aka Alexx." },
      { property: "og:title", content: "Happy Birthday, Kriti aka Alexx" },
      { property: "og:description", content: "A tiny interactive birthday world made especially for Kriti aka Alexx." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <BirthdayStory />;
}
