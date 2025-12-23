import { BookingEvent } from "../../../types/trust-builder";

const cities = [
  "Amsterdam Centrum",
  "Rotterdam Zuid",
  "Utrecht",
  "Den Haag",
  "Eindhoven"
];

const users = [
  "Sophie",
  "Lars",
  "Noor",
  "Daan",
  "Emma",
  "Finn",
  "Isa",
  "Milan",
  "Yara",
  "Tess",
  "Bram",
  "Lieke",
  "Jens",
  "Sven",
  "Evi",
  "Stijn",
  "Maud",
  "Sem",
  "Roos",
  "Jurre",
  "Lotte",
  "Guus",
  "Nina"
];

const eventTypes: BookingEvent["type"][] = [
  "viewing_booked",
  "home_found",
  "application_sent"
];

function randomFrom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function randomTimestamp(): string {
  const now = Date.now();
  const minutesAgo = Math.floor(Math.random() * 30);
  return new Date(now - minutesAgo * 60 * 1000).toISOString();
}

export const bookingEvents: BookingEvent[] = Array.from({ length: 24 }).map(
  () => {
    const user = randomFrom(users);
    const city = randomFrom(cities);
    return {
      user: `${user} from ${city}`,
      city,
      timestamp: randomTimestamp(),
      type: randomFrom(eventTypes)
    };
  }
);

