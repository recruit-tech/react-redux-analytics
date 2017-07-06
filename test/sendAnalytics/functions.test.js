import { describe, it } from 'mocha'
import { expect } from 'chai'
import rewire from 'rewire'
import { topPageProps } from '../_data/props'
import { staticVariables } from '../_data/variables'
import { mockState1 } from '../_data/state'
import { mapPropsToVariables1, mapPropsToVariables2 } from '../_data/mapFunction'
import { noStaticVariables, withStaticVariables } from '../_data/hocOutput'

const target = rewire('../../src/sendAnalytics.js')

const composeVariables = target.__get__('composeVariables')

describe('composeVariables', () => {
  describe('with static variables', () => {
    describe('no map function', () => {
      let composeVars
      beforeEach(() => {
        composeVars = composeVariables({})
      })
      it('default', () => {
        const mappedVars = composeVars({}, {})
        expect(mappedVars).to.deep.equal(noStaticVariables.noMapFunction['*,*'])
      })
      it('with props', () => {
        const mappedVars = composeVars(topPageProps, {})
        expect(mappedVars).to.deep.equal(noStaticVariables.noMapFunction['*,*'])
      })
      it('with state', () => {
        const mappedVars = composeVars({}, mockState1)
        expect(mappedVars).to.deep.equal(noStaticVariables.noMapFunction['*,*'])
      })
      it('with props & state', () => {
        const mappedVars = composeVars(topPageProps, mockState1)
        expect(mappedVars).to.deep.equal(noStaticVariables.noMapFunction['*,*'])
      })
    })

    describe('with mapFunction (only map props to variables)', () => {
      let composeVars
      beforeEach(() => {
        composeVars = composeVariables({}, mapPropsToVariables1)
      })
      it('default', () => {
        const mappedVars = composeVars({}, {})
        expect(mappedVars).to.deep.equal(noStaticVariables.mapPropsToVariables1[','])
      })
      it('with props', () => {
        const mappedVars = composeVars(topPageProps, {})
        expect(mappedVars).to.deep.equal(noStaticVariables.mapPropsToVariables1['props,'])
      })
      it('with state', () => {
        const mappedVars = composeVars({}, mockState1)
        expect(mappedVars).to.deep.equal(noStaticVariables.mapPropsToVariables1[',state'])
      })
      it('with props and state', () => {
        const mappedVars = composeVars(topPageProps, mockState1)
        expect(mappedVars).to.deep.equal(noStaticVariables.mapPropsToVariables1['props,state'])
      })
    })

    describe('with mapFunction (map both props and state to variables)', () => {
      let composeVars
      beforeEach(() => {
        composeVars = composeVariables({}, mapPropsToVariables2)
      })
      it('default', () => {
        const mappedVars = composeVars({}, {})
        expect(mappedVars).to.deep.equal(noStaticVariables.mapPropsToVariables2[','])
      })
      it('with props', () => {
        const mappedVars = composeVars(topPageProps, {})
        expect(mappedVars).to.deep.equal(noStaticVariables.mapPropsToVariables2['props,'])
      })
      it('with state', () => {
        const mappedVars = composeVars({}, mockState1)
        expect(mappedVars).to.deep.equal(noStaticVariables.mapPropsToVariables2[',state'])
      })
      it('with props and state', () => {
        const mappedVars = composeVars(topPageProps, mockState1)
        expect(mappedVars).to.deep.equal(noStaticVariables.mapPropsToVariables2['props,state'])
      })
    })
  })

  describe('with static variables', () => {
    describe('no map function', () => {
      let composeVars
      beforeEach(() => {
        composeVars = composeVariables(staticVariables)
      })
      it('default', () => {
        const mappedVars = composeVars({}, {})
        expect(mappedVars).to.deep.equal(withStaticVariables.noMapFunction['*,*'])
      })
      it('with props', () => {
        const mappedVars = composeVars(topPageProps, {})
        expect(mappedVars).to.deep.equal(withStaticVariables.noMapFunction['*,*'])
      })
      it('with state', () => {
        const mappedVars = composeVars({}, mockState1)
        expect(mappedVars).to.deep.equal(withStaticVariables.noMapFunction['*,*'])
      })
      it('with props & state', () => {
        const mappedVars = composeVars(topPageProps, mockState1)
        expect(mappedVars).to.deep.equal(withStaticVariables.noMapFunction['*,*'])
      })
    })

    describe('with mapFunction (only map props to variables)', () => {
      let composeVars
      beforeEach(() => {
        composeVars = composeVariables(staticVariables, mapPropsToVariables1)
      })
      it('default', () => {
        const mappedVars = composeVars({}, {})
        expect(mappedVars).to.deep.equal(withStaticVariables.mapPropsToVariables1[','])
      })
      it('with props', () => {
        const mappedVars = composeVars(topPageProps, {})
        expect(mappedVars).to.deep.equal(withStaticVariables.mapPropsToVariables1['props,'])
      })
      it('with state', () => {
        const mappedVars = composeVars({}, mockState1)
        expect(mappedVars).to.deep.equal(withStaticVariables.mapPropsToVariables1[',state'])
      })
      it('with props and state', () => {
        const mappedVars = composeVars(topPageProps, mockState1)
        expect(mappedVars).to.deep.equal(withStaticVariables.mapPropsToVariables1['props,state'])
      })
    })

    describe('with mapFunction (map both props and state to variables)', () => {
      let composeVars
      beforeEach(() => {
        composeVars = composeVariables(staticVariables, mapPropsToVariables2)
      })
      it('default', () => {
        const mappedVars = composeVars({}, {})
        expect(mappedVars).to.deep.equal(withStaticVariables.mapPropsToVariables2[','])
      })
      it('with props', () => {
        const mappedVars = composeVars(topPageProps, {})
        expect(mappedVars).to.deep.equal(withStaticVariables.mapPropsToVariables2['props,'])
      })
      it('with state', () => {
        const mappedVars = composeVars({}, mockState1)
        expect(mappedVars).to.deep.equal(withStaticVariables.mapPropsToVariables2[',state'])
      })
      it('with props and state', () => {
        const mappedVars = composeVars(topPageProps, mockState1)
        expect(mappedVars).to.deep.equal(withStaticVariables.mapPropsToVariables2['props,state'])
      })
    })
  })
})
