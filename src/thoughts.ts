// Words HQ shows. Add your own principles to `thoughts`; they join the daily rotation.

export interface Thought {
  text: string;
  who: string;
  where: string;
}

export const thoughts: Thought[] = [
  { text: "Everywhere means nowhere.", who: "Seneca", where: "Letters to Lucilius 2" },
  {
    text: "You must linger among a limited number of master-thinkers, and digest their works.",
    who: "Seneca",
    where: "Letters to Lucilius 2",
  },
  {
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    who: "Marcus Aurelius",
    where: "Meditations 5.20",
  },
  {
    text: "We suffer more often in imagination than in reality.",
    who: "Seneca",
    where: "Letters to Lucilius 13",
  },
  {
    text: "It is not that we have a short time to live, but that we waste a lot of it.",
    who: "Seneca",
    where: "On the Shortness of Life 1",
  },
  {
    text: "First say to yourself what you would be; and then do what you have to do.",
    who: "Epictetus",
    where: "Discourses 3.23",
  },
  {
    text: "Men are disturbed not by things, but by the views which they take of them.",
    who: "Epictetus",
    where: "Enchiridion 5",
  },
  {
    text: "Some things are within our power, while others are not.",
    who: "Epictetus",
    where: "Enchiridion 1",
  },
  {
    text: "Waste no more time arguing about what a good man should be. Be one.",
    who: "Marcus Aurelius",
    where: "Meditations 10.16",
  },
  {
    text: "While we are postponing, life speeds by.",
    who: "Seneca",
    where: "Letters to Lucilius 1",
  },
  {
    text: "Begin at once to live, and count each separate day as a separate life.",
    who: "Seneca",
    where: "Letters to Lucilius 101",
  },
  {
    text: "If it is not right, do not do it; if it is not true, do not say it.",
    who: "Marcus Aurelius",
    where: "Meditations 12.17",
  },
  {
    text: "How much more grievous are the consequences of anger than the causes of it.",
    who: "Marcus Aurelius",
    where: "Meditations 11.18",
  },
  {
    text: "The soul becomes dyed with the colour of its thoughts.",
    who: "Marcus Aurelius",
    where: "Meditations 5.16",
  },
  {
    text: "Never let the future disturb you. You will meet it, if you have to, with the same weapons of reason which today arm you against the present.",
    who: "Marcus Aurelius",
    where: "Meditations 7.8",
  },
  {
    text: "Nowhere can a man find a quieter or more untroubled retreat than in his own soul.",
    who: "Marcus Aurelius",
    where: "Meditations 4.3",
  },
  {
    text: "Look within. Within is the fountain of good, and it will ever bubble up, if thou wilt ever dig.",
    who: "Marcus Aurelius",
    where: "Meditations 7.59",
  },
  {
    text: "Withdraw into yourself, as far as you can.",
    who: "Seneca",
    where: "Letters to Lucilius 7",
  },
  {
    text: "Associate with those who will make a better man of you.",
    who: "Seneca",
    where: "Letters to Lucilius 7",
  },
  {
    text: "It is difficulties that show what men are.",
    who: "Epictetus",
    where: "Discourses 1.24",
  },
  { text: "No man is free who is not master of himself.", who: "Epictetus", where: "Fragments" },
];

// One short nudge under the greeting, picked by time of day.
export const nudges: Record<"late" | "morning" | "afternoon" | "evening", string[]> = {
  late: ["It's late. Whatever it is will look clearer after sleep."],
  morning: [
    "Pick the one thing before the inbox picks it for you.",
    "Read Pergent once, then close it. The news will keep.",
  ],
  afternoon: [
    "Check what actually needs you, and let the rest wait.",
    "You don't have to read every newsletter. Keep two, archive the rest.",
  ],
  evening: [
    "Write one note in Aletheia about what you learned today.",
    "Enough input for today. What did any of it change?",
  ],
};
