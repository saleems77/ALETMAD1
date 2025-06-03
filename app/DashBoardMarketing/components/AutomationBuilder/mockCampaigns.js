import { faker } from "@faker-js/faker";

export const mockCampaigns = Array(5)
  .fill()
  .map(() => ({
    id: faker.string.uuid(),
    name: faker.lorem.words(3),
    nodes: [
      {
        id: faker.string.uuid(),
        type: "trigger",
        position: { x: 0, y: 0 },
        data: {
          event: faker.helpers.arrayElement(["signup", "purchase"]),
          conditions: [],
        },
      },
    ],
    edges: [],
    stats: {
      active: faker.datatype.boolean(),
      conversionRate: faker.number.float({ min: 0, max: 1 }),
    },
  }));
