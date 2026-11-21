// Append-only: one import and one line per feature.
import common from './common';
import dashboard from './dashboard';
import movements from './movements';
import savings from './savings';
import chat from './chat';
import invest from './invest';
import dataGenerator from './dataGenerator';
import comingUp from './comingUp';
import myFuture from './myFuture';
import categories from './categories';
import buddy from './buddy';

export default {
  common,
  categories,
  buddy,
  features: {
    dashboard,
    movements,
    savings,
    chat,
    invest,
    dataGenerator,
    comingUp,
    myFuture,
  },
};
