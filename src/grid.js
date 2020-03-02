import * as types from "../mutation-types";
import gridApi from "@/api/grid";
import Json from "json3";
import _ from "lodash";

const state = {
  filterData: {}, //{ filterID: null, api: null, filter: {}, result: {}} // { gridID: null, data: [], total: 0},
  mulitItem: {},
  reload: false
};
const getters = {
  filterData: state => state.filterData,
  mulitItem: state => state.mulitItem,
  reload: state => state.reload
};

const actions = {
  [types.GRID_FILTER.SET]({ commit }, obj) {
    commit(types.GRID_FILTER.SET, obj);
  },
  [types.GRID_FILTER.RESET]({ commit }, obj) {
    commit(types.GRID_FILTER.RESET, obj);
  },
  [types.GRID_FILTER.RELOAD]({ commit }, obj) {
    commit(types.GRID_FILTER.RELOAD, obj);
  },
  [types.GRID_FILTER.SET_CONDITION]({ commit }, obj) {
    commit(types.GRID_FILTER.RELOAD, obj);
  },
  [types.GRID_FILTER.QUERY]({ commit }, obj) {
    return new Promise((resolve, reject) => {
      let filterID = obj.filterID;
      let p = {
        index: state.filterData[filterID].filter.index,
        size: state.filterData[filterID].filter.size,
        sorts: encodeURIComponent(
          Json.stringify(state.filterData[filterID].filter.sorts)
        ),
        conditions: encodeURIComponent(
          Json.stringify(state.filterData[filterID].filter.conditions)
        )
      };
      gridApi
        .getList(state.filterData[filterID].api, { params: p })
        .then(response => {
          commit(types.GRID_FILTER.QUERY, {
            filterID: filterID,
            data: response.data.Data,
            total: response.data.Total
          });
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  [types.GRID_FILTER.SET_PARAMS]({ commit }, obj) {
    commit(types.GRID_FILTER.SET_PARAMS, obj);
  },
  [types.GRID_FILTER.SET_MULIT]({ commit }, obj) {
    commit(types.GRID_FILTER.SET_MULIT, obj);
  },
  [types.GRID_FILTER.CLEAR_MULIT]({ commit }, obj) {
    commit(types.GRID_FILTER.CLEAR_MULIT, obj);
  }
};

const mutations = {
  [types.GRID_FILTER.SET](state, obj) {
    let filterID = obj.filterID;
    state.mulitItem[filterID] = {
      items: []
    };
    state.filterData[filterID] = {
      gridID: null,
      api: null,
      filter: {},
      result: { data: [], total: 0 }
    };
  },
  [types.GRID_FILTER.RESET](state, obj) {
    state.filterData = {};
  },
  [types.GRID_FILTER.RELOAD](state, obj) {
    let filterID = obj.filterID;
    state.reload = true;
  },
  [types.GRID_FILTER.QUERY](state, obj) {
    // state.filterData[obj.filterID].result = { data: obj.data, total: obj.total }
    state.filterData[obj.filterID].result = _.cloneDeep({
      data: obj.data,
      total: obj.total
    });
    state.reload = false;
  },
  [types.GRID_FILTER.SET_CONDITION](state, obj) {
    //todo
  },
  [types.GRID_FILTER.SET_PARAMS](state, obj) {
    let filterID = obj.filterID;

    if (typeof state.mulitItem[filterID] == "undefined") {
      state.mulitItem[filterID] = {
        items: []
      };
    }
    if (typeof state.filterData[filterID] == "undefined") {
      state.filterData[filterID] = {
        gridID: null,
        api: null,
        filter: {},
        result: { data: [], total: 0 }
      };
    }
    for (let p in obj) {
      switch (p) {
        case "api":
          state.filterData[filterID].api = obj.api;
          break;
        case "filterID":
          state.filterData[filterID].gridID = obj.filterID;
          break;
        case "size":
          state.filterData[filterID].filter.size = obj.size;
          break;
        case "index":
          state.filterData[filterID].filter.index = obj.index;
          break;
        case "sorts":
          state.filterData[filterID].filter.sorts = obj.sorts;
          break;
        case "conditions":
          state.filterData[filterID].filter.conditions = obj.conditions;
          break;
        default:
          break;
      }
    }
  },
  [types.GRID_FILTER.SET_MULIT](state, obj) {
    let filterID = obj.filterID;
    state.mulitItem[filterID].items = obj.items;
  },
  [types.GRID_FILTER.CLEAR_MULIT](state, obj) {
    let filterID = obj.filterID;
    state.mulitItem[obj.filterID].items = [];
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
