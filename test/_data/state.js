import { top } from './location'
import { topPageViewProps, topPageProps } from './variables'

export const page = {
  topPageBeforeSent: {
    location: top,
    variables: topPageProps,
  },
  topPageAfterSent: {
    location: top,
    variables: { topPageProps, ...topPageProps },
    lastPageViewSent: topPageViewProps,
  },
}

export const state = {
  default: {

  },
}
