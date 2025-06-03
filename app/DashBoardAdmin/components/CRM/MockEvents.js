import { faker } from "@faker-js/faker";

export const generateMockEvents = (count = 100) => {
  const eventTypes = ["page_view", "click", "form_submit", "purchase"];

  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(eventTypes),
    timestamp: faker.date.recent({ days: 7 }),
    page: faker.internet.url(),
    userAgent: faker.internet.userAgent(),
    metadata: {
      value: faker.number.float({ min: 0, max: 1000 }),
      duration: faker.number.int({ min: 1, max: 300 }),
    },
  }));
};
