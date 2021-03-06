'use strict';

import React from 'react/addons';
import AppStateActionCreators from '../../actions/AppStateActionCreators';
import ValidatedInput from './ValidatedInput';
import TrainingStore from '../../stores/TrainingStore';
import ExerciseStore from '../../stores/ExerciseStore';

let TrainingForm = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    getInitialState() {
        return {};
    },

    handleSubmit() {
        let reps = this.refs.reps.getDOMNode(),
            weight = this.refs.weight.getDOMNode();
        if (reps.className.indexOf('invalid') === -1 && weight.className.indexOf('invalid') === -1) {
            this.props.handler(this.props.exercise, reps.value, weight.value);
        }
    },

    render() {
        let self = this,
            exercise = ExerciseStore.getExerciseForId(this.props.exercise),
            sets = this.props.sets.map((item, index) => {
                let handler = () => {
                    AppStateActionCreators.removeSet(self.props.exercise, index);
                };
                return <span className='rep' key={index} onClick={handler}>{index + 1}</span>;
            }).toArray(),
            historyValues = TrainingStore.getLastInputsForExercise(this.props.exercise,
                sets.length, this.props.training.get('workout'));

        return (
            <div className='form training'>
                <div className='sets'>{sets}</div>
                <h1>{exercise.get('label')}</h1>
                <div>
                    <span>
                        <ValidatedInput validator='number' type='number'
                            ref='reps' placeholder='reps' className='reps' value={historyValues.rep}/><br />
                        <ValidatedInput validator='number' type='number'
                            ref='weight' placeholder='weight' className='weight' value={historyValues.weight} /><br />
                    </span>
                    <span>
                        <button className='submitButton' onClick={this.handleSubmit}>Add</button>
                    </span>
                </div>
            </div>
        );
    }
});

module.exports = TrainingForm;
