import Json from "json3";
import _ from "lodash";

const util = {};
util.query = {};
util.query.opt = {
  eq: 1,
  neq: 2,
  gt: 3,
  gte: 4,
  lt: 5,
  lte: 6,
  like: 7
};
util.query.sort = {
  asc: 1,
  desc: 2
};
util.query.dataType = {
  int: 1,
  string: 2,
  date: 3,
  bool: 4
};
util.query.convert = (sorts, conditions) => {
  return {
    sorts: encodeURIComponent(Json.stringify(sorts)),
    conditions: encodeURIComponent(Json.stringify(conditions))
  };
};
util.query.convert = p => {
  return encodeURIComponent(Json.stringify(p));
};
util.query.encode = input => {
  let temp = {};
  for (let k in input) {
    if (util.valid.isObject(input[k]) || util.valid.isArray(input[k])) {
      temp[k] = encodeURIComponent(Json.stringify(input[k]));
    } else {
      temp[k] = input[k];
    }
  }
  return temp;
};

export default util;