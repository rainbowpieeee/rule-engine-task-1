const { Engine } = require('json-rules-engine');
const { DRINK_TYPES } = require("./const/drinks");

const engine = new Engine();

engine.addRule({
  conditions: {
    all: [
      {
        fact: 'emptyBottlesCount',
        operator: 'greaterThanInclusive',
        value: 2
      },
      {
        fact: 'emptyBottlesType',
        operator: 'equal',
        value: DRINK_TYPES.SODA,
      },
      {
        fact: 'shopSodaBottlesCount',
        operator: 'greaterThanInclusive',
        value: 1,
      },
    ]
  },
  event: {
    type: 'exchange',
    params: {
      message: 'Empty bottles can be exchanged for new soda bottles!'
    }
  }
});

engine.addRule({
  conditions: {
    all: [{
      fact: 'emptyBottlesCount',
      operator: 'lessThan',
      value: 2,
    }]
  },
  event: {
    type: 'notEnoughBottles',
    params: {
      message: "You don't have enough empty bottles for an exchange!",
    }
  }
});

engine.addRule({
  conditions: {
    all: [{
      fact: 'emptyBottlesType',
      operator: 'notEqual',
      value: DRINK_TYPES.SODA,
    }]
  },
  event: {
    type: 'wrongType',
    params: {
      message: "Only soda bottles can be exchanged!",
    }
  }
});

engine.addRule({
  conditions: {
    all: [{
      fact: 'shopSodaBottlesCount',
      operator: 'lessThan',
      value: 1,
    },]
  },
  event: {
    type: 'outOfStock',
    params: {
      message: "The shop doesn't have any more soda bottles to exchange!",
    }
  }
});

const facts = {
  emptyBottlesCount: 2,
  emptyBottlesType: DRINK_TYPES.SODA,
  shopSodaBottlesCount: 50,
};

engine
  .run(facts)
  .then(({ events }) => {
    events.map(event => console.log(event.params.message))
  });
