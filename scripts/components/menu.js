'use strict';

import React from 'react';
import MenuButton from '../components/MenuButton';
import MenuStore from '../stores/MenuStore.js';
import AppStateActionCreators from '../actions/AppStateActionCreators';

let Menu = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            menuPoints: MenuStore.getMenuPoints()
        };
    },

    render() {
        let self = this,
            menuPoints = this.state.menuPoints.map((item) => {
                let handlerFunc = () => {
                    AppStateActionCreators.closeMenu();
                    self.context.router.transitionTo(item.link);
                };
                return (<MenuButton key={item.name} icon={item.icon}
                    name={item.name} handler={handlerFunc} />);
            });

        return (
            <div className={this.props.className + ' menu'}>
                {menuPoints}
            </div>
        );
    },

    componentDidMount() {
        MenuStore.addChangeListener(this._onChange);
    },

    componentWillUnmount() {
        MenuStore.removeChangeListener(this._onChange);
    },

    _onChange() {
        this.setState({menuPoints: MenuStore.getMenuPoints()});
    }
});

module.exports = Menu;
