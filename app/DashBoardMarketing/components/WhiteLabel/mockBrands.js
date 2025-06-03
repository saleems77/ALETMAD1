import { faker } from "@faker-js/faker";

export const mockBrands = Array(3)
  .fill()
  .map(() => ({
    id: faker.string.uuid(),
    logo: faker.image.urlLoremFlickr({ category: "abstract" }),
    primaryColor: faker.color.rgb(),
    font: faker.helpers.arrayElement(["Inter", "Poppins"]),
  }));
