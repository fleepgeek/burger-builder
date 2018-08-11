import React, { Component, Fragment } from 'react';

import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => (
    class extends Component {
        constructor(props) {
            super(props);

            this.reqInterceptor = axios.interceptors.request.use(request => {
                this.setState({ error: null });
                return request;
            })
    
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({ error: error });
            })
        }

        state = {
            error: null,
        }

        componentWillUnmount() {
            // console.log('Will Unmount', this.reqInterceptor, this.resInterceptor)
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }
        

        //Deprecated, use contructors if you want to access
        //a component before it mounts
        // componentWillMount() {
        //     axios.interceptors.request.use(request => {
        //         this.setState({ error: null });
        //         return request;
        //     })
    
        //     axios.interceptors.response.use(res => res, error => {
        //         this.setState({ error: error });
        //     })
        // }
        
        errorConfirmedHandler = () => {
            this.setState({ error: null });
        }

        render() {
            return (
                <Fragment>
                    <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
                        {this.state.error && this.state.error.message}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Fragment>
            )
        }
    }
);

export default withErrorHandler;