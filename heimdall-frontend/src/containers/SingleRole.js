import React, {Component} from 'react'
import {push} from 'connected-react-router';
import {connect} from 'react-redux'

import RoleForm from "../components/roles/RoleForm";
import {clearRole, clearRoles, getRole, initLoading, remove, save, update} from "../actions/roles";
import PageHeader from "../components/ui/PageHeader";
import {Card, notification, Row} from "antd";
import Loading from "../components/ui/Loading";
import {getAllPrivileges} from "../actions/privileges";

class SingleRole extends Component {

    state = {loadEntity: false, timer: Date.now(), intervalSeconds: 2}

    componentDidMount() {
        let idRole = this.props.match.params.id
        if (idRole) {
            this.props.dispatch(initLoading())
            this.props.dispatch(getRole(idRole))
            this.setState({...this.state, loadEntity: true})
        }
        this.props.dispatch(getAllPrivileges())
    }

    componentWillReceiveProps(newProps) {
        if (newProps.notification && newProps.notification !== this.props.notification) {
            const { type, message, description } = newProps.notification
            notification[type]({ message, description })
        }
    }

    componentWillUnmount() {
        this.props.dispatch(clearRole())
        this.props.dispatch(clearRoles())
    }

    handleSubmit = (formObject) => {
        this.props.dispatch(initLoading())
        if (formObject.id) {
            this.props.dispatch(update(formObject))
        } else {
            this.props.dispatch(save(formObject))
        }
    }

    handleDelete = (roleId) => {
        this.props.dispatch(remove(roleId))
        this.props.dispatch(push('/roles'))
    }

    render() {

        const {role, privileges} = this.props

        if (this.state.loadEntity || this.props.loading){
            if (!role) return <Loading/>
        }

        if (!privileges || privileges.length === 0) return <Loading/>

        const title = role ? 'Edit' : 'Add'

        return (
            <div>
                <PageHeader title="Roles" icon="solution"/>
                <Row className="h-row bg-white">
                    <Card style={{width: '100%'}} title={title + ' Role'}>
                        <RoleForm
                            loading={this.props.loading}
                            role={role}
                            privileges={privileges}
                            handleDelete={this.handleDelete}
                            handleSubmit={this.handleSubmit}
                            handleSearch={this.handleSearch}
                        />
                    </Card>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        role: state.roles.role,
        loading: state.roles.loading,
        privileges: state.privileges.privileges
    }
}

export default connect(mapStateToProps)(SingleRole)