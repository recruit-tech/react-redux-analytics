import { reducerName } from '../../src/names'
import { news, newsLatest } from '../_data/location'

export const mockState1 = {
  article: {
    title: 'title from article',
    content: 'content from article',
    author: 'author from article',
    category: 'category from article',
    language: 'language from article',
    links: 'links from article',
  },
  routing: {
    locationBeforeTransitions: news,
  },
  [reducerName]: {
    global: {
      variables: {
        prop30: 'prop30 from globalProps',
        prop31: 'prop31 from globalProps',
        prop40: 'prop40 from globalProps',
        prop41: 'prop41 from globalProps',
      },
    },
    page: {
      location: undefined,
      variables: {
        prop10: 'prop10 from topPageProps',
        prop11: 'prop11 from topPageProps',
        prop15: 'prop15 from topPageProps',
        prop40: 'prop40 from topPageProps',
        prop41: 'prop41 from topPageProps',
      },
      lastPageViewSent: undefined,
    },
    prevPages: [],
    initialState: false,
  },
}

// with page.location = newsLatest
export const mockState2 = {
  ...mockState1,
  [reducerName]: {
    ...mockState1[reducerName],
    page: {
      ...mockState1[reducerName].page,
      location: newsLatest,
    },
  },
}
