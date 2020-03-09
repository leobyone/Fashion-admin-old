import Json from 'json3';
import _ from 'lodash';

function Query(api) {
  this.pageIndex = 0;
  this.pageSize = 0;
  this.conditions = [];
  this.sorts = [];
  this.sortBy = {
    asc: 1,
    desc: 2
  };
  this.dataType = {
    int: 1,
    string: 2,
    date: 3,
    bool: 4
  };
  this.opts = {
    eq: 1,
    neq: 2,
    gt: 3,
    gte: 4,
    lt: 5,
    lte: 6,
    like: 7
  };
  let that = this;
  this.otherParames = {};

  this.encode = input => {
    var temp = {};
    for (var k in input) {
      if (
        (input != null &&
          Object.prototype.toString.call(input) ===
          '[object Object]') ||
        (input instanceof Array ||
          Object.prototype.toString.call(input) === '[object Array]')
      ) {
        temp[k] = encodeURIComponent(Json.stringify(input[k]));
      } else {
        temp[k] = input[k];
      }
    }
    return temp;
  };
  // this.addSort = (k, s) => {
  //     return that.addSort(k, s);
  // };

  this.addConditions = (k, v, o, t) => {
    that.addCondition(k, v, o, t);
    let l;
    switch (o) {
      case 1:
        l = (k, v, t) => {
          return that.eq(k, v, t);
        };
        break;
      case 2:
        l = (k, v, t) => {
          return that.neq(k, v, t);
        };
        break;
      case 3:
        l = (k, v, t) => {
          return that.gt(k, v, t);
        };
        break;
      case 4:
        l = (k, v, t) => {
          return that.gte(k, v, t);
        };
        break;
      case 5:
        l = (k, v, t) => {
          return that.lt(k, v, t);
        };
        break;
      case 6:
        l = (k, v, t) => {
          return that.lte(k, v, t);
        };
        break;
      case 7:
        l = (k, v, t) => {
          return that.like(k, v, t);
        };
        break;
      default:
    }
    return l;
  };
  this.page = (p) => {
    this.pageIndex = p;
    return new qo();
  }
  this.size = (s) => {
    this.pageSize = s;
    return new qo();
  }
  this.setParames = (p) => {
    this.otherParames = p;
    return new qo();
  }
  this.asc = (k) => {
    return that.addSort(k, that.sortBy.asc);
  }
  this.desc = (k) => {
    return that.addSort(k, that.sortBy.desc);
  }

  this.eq = (k, v, t) => {
    return that.addCondition(k, v, this.opts.eq, t);
  };
  this.neq = (k, v, t) => {
    return that.addCondition(k, v, this.opts.neq, t);
  };
  this.gt = (k, v, t) => {
    return that.addCondition(k, v, this.opts.gt, t);
  };
  this.gte = (k, v, t) => {
    return that.addCondition(k, v, this.opts.gte, t);
  };
  this.lt = (k, v, t) => {
    return that.addCondition(k, v, this.opts.lt, t);
  };
  this.lte = (k, v, t) => {
    return that.addCondition(k, v, this.opts.lte, t);
  };
  this.like = (k, v, t) => {
    return that.addCondition(k, v, this.opts.like, t);
  };
  this.build = () => {
    let params;
    if (this.pageSize > 0 && this.pageIndex > 0) {
      params = {
        page: this.pageIndex,
        size: this.pageSize,
        sorts: this.sorts,
        conditions: this.conditions
      };
    } else {
      params = {
        sorts: this.sorts,
        conditions: this.conditions
      };
    }
    return this.encode(_.extend(params, this.otherParames));
  };
  this.request = () => {
    return new Promise((resolve, reject) => {
      api.apply(null, [{
        params: that.build()
      }]).then(r => {
        resolve(r);
      }).catch(err => {
        reject(err);
      });
    });
  };

  function qo() {
    let l = (k, v, o, t) => {
      return that.addCondition(k, v, o, t);
    };
    l.eq = (k, v, t) => {
      return that.addCondition(k, v, that.opts.eq, t);
    };
    l.neq = (k, v, t) => {
      return that.addCondition(k, v, that.opts.neq, t);
    };
    l.gt = (k, v, t) => {
      return that.addCondition(k, v, that.opts.gt, t);
    };
    l.gte = (k, v, t) => {
      return that.addCondition(k, v, that.opts.gte, t);
    };
    l.lt = (k, v, t) => {
      return that.addCondition(k, v, that.opts.lt, t);
    };
    l.lte = (k, v, t) => {
      return that.addCondition(k, v, that.opts.lte, t);
    };
    l.like = (k, v, t) => {
      return that.addCondition(k, v, that.opts.like, t);
    };
    l.addSort = (k, s) => {
      return that.addSort(k, s);
    };
    l.request = () => {
      return that.request();
    };
    l.asc = (k) => {
      return that.addSort(k, that.sortBy.asc);
    };
    l.desc = (k) => {
      return that.addSort(k, that.sortBy.desc);
    };
    l.page = (k) => {
      return that.page(k);
    };
    l.size = (k) => {
      return that.size(k);
    }
    l.setParames = (p) => {
      return that.setParames(p);
    };
    l.build = () => {
      return that.build();
    }
    return l;
  }
  this.addCondition = (k, v, o, t) => {
    let temp = [];
    if (_.isObject(k)) {
      temp = _.toPairs(k);
    } else {
      temp = [
        [k, v]
      ];
    }
    for (let i = 0; i < temp.length; i++) {
      this.conditions.push({
        Field: temp[i][0],
        DataType: typeof t != 'undefined' ? t : this.dataType.string,
        Option: o,
        Value: temp[i][1]
      });
    }
    return new qo();
  };
  this.addSort = (k, s) => {
    let temp = [];
    let _s = typeof s != 'undefined' ? s : this.sortBy.asc;
    if (_.isArray(k)) {
      for (let i = 0; i < k.length; i++) {
        this.sorts.push({
          Field: k[i],
          SortBy: _s
        });
      }
    } else {
      this.sorts.push({
        Field: k,
        SortBy: _s
      });
    }

    return new qo();
  };
  this.reset = () => {
    this.conditions = [];
    this.sorts = [];
  };
  this.removeCondition = k => {
    let index = this.conditions.findIndex(t => t.Field == k);
    if (index > -1) {
      this.conditions.splice(index, 1);
    }
  };
}
var query = function (api) {
  return new Query(api);
};

export default query;