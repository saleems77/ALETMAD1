import { faker } from "@faker-js/faker";

export const mockCalls = Array(20)
  .fill()
  .map(() => ({
    id: faker.string.uuid(),
    number: faker.phone.number("+9665########"),
    status: faker.helpers.arrayElement(["ringing", "active", "ended"]),
    duration: faker.number.int({ min: 0, max: 3600 }),
    timestamp: faker.date.recent(),
    direction: faker.helpers.arrayElement(["inbound", "outbound"]),
  }));
