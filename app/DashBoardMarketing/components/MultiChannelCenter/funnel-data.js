// app/data/funnel-data.js
import { faker } from "@faker-js/faker";

export const funnelNodes = [
  {
    id: "awareness",
    position: { x: 250, y: 0 },
    data: { label: "الوعي", count: faker.number.int({ min: 50, max: 200 }) },
  },
  {
    id: "interest",
    position: { x: 250, y: 150 },
    data: { label: "الاهتمام", count: faker.number.int({ min: 30, max: 150 }) },
  },
  {
    id: "desire",
    position: { x: 250, y: 300 },
    data: { label: "الرغبة", count: faker.number.int({ min: 10, max: 100 }) },
  },
  {
    id: "action",
    position: { x: 250, y: 450 },
    data: { label: "العمل", count: faker.number.int({ min: 5, max: 50 }) },
  },
];

export const funnelEdges = [
  { id: "e1", source: "awareness", target: "interest" },
  { id: "e2", source: "interest", target: "desire" },
  { id: "e3", source: "desire", target: "action" },
];
// app/data/mock-data.js

export const funnelData = {
  nodes: [
    {
      id: "awareness",
      position: { x: 250, y: 0 },
      data: {
        label: "الوعي",
        count: faker.number.int({ min: 500, max: 1000 }), // عدد العملاء في مرحلة الوعي
        conversionRate: faker.number.float({
          min: 0.1,
          max: 0.3,
          precision: 0.01,
        }), // نسبة التحويل
      },
    },
    {
      id: "interest",
      position: { x: 250, y: 150 },
      data: {
        label: "الاهتمام",
        count: faker.number.int({ min: 200, max: 500 }),
        conversionRate: faker.number.float({
          min: 0.2,
          max: 0.4,
          precision: 0.01,
        }),
      },
    },
    {
      id: "desire",
      position: { x: 250, y: 300 },
      data: {
        label: "الرغبة",
        count: faker.number.int({ min: 50, max: 200 }),
        conversionRate: faker.number.float({
          min: 0.15,
          max: 0.35,
          precision: 0.01,
        }),
      },
    },
    {
      id: "action",
      position: { x: 250, y: 450 },
      data: {
        label: "العمل",
        count: faker.number.int({ min: 10, max: 100 }),
        conversionRate: faker.number.float({
          min: 0.05,
          max: 0.2,
          precision: 0.01,
        }),
      },
    },
  ],
  edges: [
    { id: "e1", source: "awareness", target: "interest" },
    { id: "e2", source: "interest", target: "desire" },
    { id: "e3", source: "desire", target: "action" },
  ],
};
