export const initNodes = [
  {
    id: "1",
    type: "custom",
    data: "111",
    position: { x: 0, y: 0 }
  },
  {
    id: "2",
    type: "custom",
    data: "222",

    position: { x: 200, y: -200 }
  },
  {
    id: "3",
    type: "custom",
    data: "333",
    position: { x: 200, y: 200 }
  },
  {
    id: "4",
    type: "custom",
    data: "333",
    parentNode: "3",
    position: { x: 200, y: 0 }
  }
];
