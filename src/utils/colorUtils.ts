// src/utils/colorUtils.ts 

import { Participant } from "../stores/chatStore";

const PARTICIPANT_COLORS_CLASSES = [
  'text-red-600', 'text-blue-600', 'text-green-600', 'text-yellow-600',
  'text-purple-600', 'text-pink-600', 'text-indigo-600', 'text-teal-600',
  'text-orange-600', // Add more Tailwind classes as needed
];

// To ensure consistent color per participant across sessions for the same chat,
// sort participants by waId before assigning colors, or use a hash if preferred.
export function assignColorsToParticipants(participants: Omit<Participant, 'color'>[]): Participant[] {
  // Sort by waId to ensure consistent color assignment if participant list order changes but content is same
  const sortedParticipants = [...participants].sort((a, b) => a.waId.localeCompare(b.waId));
  
  return sortedParticipants.map((participant, index) => ({
    ...participant,
    color: PARTICIPANT_COLORS_CLASSES[index % PARTICIPANT_COLORS_CLASSES.length],
  }));
}