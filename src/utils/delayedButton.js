import React from 'react';
import PropTypes from 'prop-types';
import Button from "../components/common/Button";


class DelayedButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = { hidden: true };
    }

    componentDidMount() {
        setTimeout(() => {
            this.timeout = null
            this.setState({ hidden: false });
        }, this.props.waitBeforeShow);
    }

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
    }

    render() {
        return this.state.hidden ? <>

            <span>

                <Button
                    className="w-1/4 md:w-auto text-xs md:text-lg flex flex-row justify-center mx-auto mr-2"

                    uppercase={false}
                >
                    Loading...
                </Button>

            </span>



        </> : this.props.children;
    }
}

DelayedButton.propTypes = {
    waitBeforeShow: PropTypes.number.isRequired
};

export default DelayedButton;