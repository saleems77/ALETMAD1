import { faker } from "@faker-js/faker";

export const mockPages = Array(5)
  .fill()
  .map((_, index) => ({
    id: index + 1,
    title: faker.lorem.words(3),
    slug: faker.lorem.slug(),
    visits: faker.number.int({ max: 1000 }),
    elements: [
      {
        id: Date.now(),
        type: "text",
        content: "مرحبًا بك في صفحتي التسويقية!",
      },
      {
        id: Date.now() + 1,
        type: "image",
        content: "/default-banner.jpg",
      },
    ],
  }));
