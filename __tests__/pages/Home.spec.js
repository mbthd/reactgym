'use strict';

jest.dontMock('../../scripts/pages/Home.js');
jest.mock('../../scripts/stores/AppState.js');
jest.mock('../../scripts/stores/TrainingStore.js');
jest.mock('../../scripts/actions/HeaderStateActionCreators.js');
jest.mock('react-router');

var React = require('react/addons'),
    Immutable = require('immutable'),
    AppState = require('../../scripts/stores/AppState.js'),
    TrainingStore = require('../../scripts/stores/TrainingStore.js'),
    Home = require('../../scripts/pages/Home.js'),
    StubRouterContext = require('../../StubRouterContext.js');

let TestUtils = React.addons.TestUtils;

describe("Home", () => {
    var home,
        wrapped,
        ContextComponent = StubRouterContext(Home);
    beforeEach(() => {
        AppState.getActiveTraining.mockImplementation(() => {
            return Immutable.fromJS({
                    id: 1,
                    workout: {
                        label: 'hello'
                    }
                });
        });
        TrainingStore.getTrainings.mockImplementation(() => {
            return Immutable.fromJS([
                {
                    id: 0,
                    date: '01.02.2015',
                    workout: {
                        label: 'some training'
                    }
                }
            ]);
        });
        wrapped = TestUtils.renderIntoDocument(<ContextComponent/>);
        home = TestUtils.findRenderedComponentWithType(wrapped, Home);
    });

    afterEach(() => {
        AppState.getActiveTraining.mockClear();
        TrainingStore.getTrainings.mockClear();
        home.componentWillUnmount();
        AppState.getTimer.mockClear();
    });

    it("renders a Home Page", () => {
        expect(TestUtils.isCompositeComponent(home)).toEqual(true);
        expect(home.getDOMNode().className).toEqual('page home');
        let timerDiv = TestUtils.scryRenderedDOMComponentsWithClass(home, 'timer');
        let activeTrainingDiv = TestUtils.scryRenderedDOMComponentsWithClass(home, 'activeTraining');
        expect(timerDiv.length).toBe(1);
        expect(activeTrainingDiv.length).toBe(1);
    });

    it("goes to the training page on click on the training", () => {
        let activeTrainingDiv = TestUtils.scryRenderedDOMComponentsWithClass(home, 'activeTraining');
        TestUtils.Simulate.click(activeTrainingDiv[0].getDOMNode());
        expect(home.context.router.transitionTo.mock.calls.length).toBe(1);
    });

    it("goes to the training detail page on click on one of the recent trainings", () => {
        let recentTrainingDiv = TestUtils.scryRenderedDOMComponentsWithClass(home, 'listitem');
        TestUtils.Simulate.click(recentTrainingDiv[0].getDOMNode());
        expect(home.context.router.transitionTo.mock.calls.length).toBe(1);
        expect(home.context.router.transitionTo.mock.calls[0][2].training).toBe(0);
    });

    it("gets the timer on change", () => {
        home._onChange();
        expect(AppState.getTimer.mock.calls.length).toBe(2);
    });

    describe("no activeTraining", () => {
        it("doesn't render a timer or active training if there is no active training", () => {
            AppState.getActiveTraining.mockImplementation(() => {
                return null;
            });
            home = TestUtils.renderIntoDocument(<Home />);
            let timerDiv = TestUtils.scryRenderedDOMComponentsWithClass(home, 'timer');
            let activeTrainingDiv = TestUtils.scryRenderedDOMComponentsWithClass(home, 'activeTraining');
            expect(timerDiv.length).toBe(0);
            expect(activeTrainingDiv.length).toBe(0);
        });
    });
});

