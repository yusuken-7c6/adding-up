"use strict";
const fs = require("fs");
const readline = require("readline");
const rs = fs.createReadStream("./popu-pref.csv");
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map();

rl.on("line", (lineString) => {
  const columns = lineString.split(",");
  const year = parseInt(columns[0]);
  const prefecture = columns[2];
  const population = parseInt(columns[4]);
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null,
      };
    }

    if (year === 2010) {
      value.popu10 = population;
    }

    if (year === 2015) {
      value.popu15 = population;
    }

    prefectureDataMap.set(prefecture, value);
  }
});

rl.on("close", () => {
  for (const [, val] of prefectureDataMap) {
    val.change = val.popu15 / val.popu10;
  }

  const rankingArray = Array.from(prefectureDataMap).sort((p1, p2) => {
    return p2[1].change - p1[1].change;
  });

  const rankingStrings = rankingArray.map(([key, value], index) => {
    return (
      index +
      1 +
      "位: " +
      key +
      ": " +
      value.popu10 +
      "=>" +
      value.popu15 +
      " 変化率:" +
      value.change
    );
  });
  console.log(rankingStrings);
});
