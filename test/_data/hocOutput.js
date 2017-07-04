export const noStaticVariables = {
  noMapFunction: {
    '*,*': {
    },
  },
  mapPropsToVariables1: {
    ',': {
    },
    'props,': {
      prop10: 'data10 from topPageProps',
      prop31: 'data31 from topPageProps',
      prop40: 'data40 from topPageProps',
      prop50: 'data50 from topPageProps',

    },
    ',state': {
    },
    'props,state': {
      prop10: 'data10 from topPageProps',
      prop31: 'data31 from topPageProps',
      prop40: 'data40 from topPageProps',
      prop50: 'data50 from topPageProps',
    },
  },
  mapPropsToVariables2: {
    ',': {
    },
    'props,': {
      prop10: 'data10 from topPageProps',
      prop31: 'data31 from topPageProps',
      prop40: 'data40 from topPageProps',
      prop50: 'data50 from topPageProps',
    },
    ',state': {
      prop30: 'title from article',
      prop40: 'author from article',
      prop41: 'content from article',
    },
    'props,state': {
      prop10: 'data10 from topPageProps',
      prop30: 'title from article',
      prop31: 'data31 from topPageProps',
      prop40: 'author from article',
      prop41: 'content from article',
      prop50: 'data50 from topPageProps',
    },
  },
}

export const withStaticVariables = {
  noMapFunction: {
    '*,*': {
      pageName: 'top',
      prop10: 'prop10 from static',
      prop32: 'prop32 from static',
      prop41: 'prop41 from static',
    },
  },
  mapPropsToVariables1: {
    ',': {
      pageName: 'top',
      prop10: 'prop10 from static',
      prop32: 'prop32 from static',
      prop41: 'prop41 from static',
    },
    'props,': {
      // prop10: 'data10 from topPageProps',
      prop31: 'data31 from topPageProps',
      prop40: 'data40 from topPageProps',
      prop50: 'data50 from topPageProps',
      pageName: 'top',
      prop10: 'prop10 from static',
      prop32: 'prop32 from static',
      prop41: 'prop41 from static',

    },
    ',state': {
      pageName: 'top',
      prop10: 'prop10 from static',
      prop32: 'prop32 from static',
      prop41: 'prop41 from static',
    },
    'props,state': {
      // prop10: 'data10 from topPageProps',
      prop31: 'data31 from topPageProps',
      prop40: 'data40 from topPageProps',
      prop50: 'data50 from topPageProps',
      pageName: 'top',
      prop10: 'prop10 from static',
      prop32: 'prop32 from static',
      prop41: 'prop41 from static',
    },
  },
  mapPropsToVariables2: {
    ',': {
      pageName: 'top',
      prop10: 'prop10 from static',
      prop32: 'prop32 from static',
      prop41: 'prop41 from static',
    },
    'props,': {
      // prop10: 'data10 from topPageProps',
      prop31: 'data31 from topPageProps',
      prop40: 'data40 from topPageProps',
      prop50: 'data50 from topPageProps',
      pageName: 'top',
      prop10: 'prop10 from static',
      prop32: 'prop32 from static',
      prop41: 'prop41 from static',
    },
    ',state': {
      prop30: 'title from article',
      prop40: 'author from article',
      // prop41: 'content from article',
      pageName: 'top',
      prop10: 'prop10 from static',
      prop32: 'prop32 from static',
      prop41: 'prop41 from static',
    },
    'props,state': {
      // prop10: 'data10 from topPageProps',
      prop30: 'title from article',
      prop31: 'data31 from topPageProps',
      prop40: 'author from article',
      // prop41: 'content from article',
      prop50: 'data50 from topPageProps',
      pageName: 'top',
      prop10: 'prop10 from static',
      prop32: 'prop32 from static',
      prop41: 'prop41 from static',
    },
  },
}
