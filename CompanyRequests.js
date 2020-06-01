import React, {useEffect} from 'react';
import LayoutPage from "../../hoc/LayoutPage/LayoutPage";
import Table from "../../components/Table/Table";
import {DeadlineCell, EditCell, StatusCell, UserCell} from "../../components/TableCells/TableCells";
import SelectColumnFilter from "../../components/Table/Filters/SelectColumnFilter";
import * as actions from "../../store/actions";
import WithErrorHandler from "../../hoc/WithErrorHandler/WithErrorHandler";
import {connect} from "react-redux";
import axios from "../../apis/axios";
import Spinner from "../../components/UI/Spinner/Spinner";
import DateColumnFilter from "../../components/Table/Filters/DateColumnFilter";

const CompanyRequests = (props) => {
    useEffect(() => {
        props.onRequestsGet(props.companies.fetchedCompany._id
            ? props.companies.fetchedCompany._id
            : props.authUser.user.company);
        props.onCompanyEmployeeGet(props.authUser.user.company)
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Deadline',
                accessor: 'deadlineAt',
                Cell: DeadlineCell,
                filter: (rows, id, filterValue) => {
                    return rows.filter(row => {
                        const rowValue = row.values[id];
                        return filterValue > rowValue
                    });
                },
                Filter: DateColumnFilter
            },
            {
                Header: 'Assigned',
                accessor: 'assigned',
                disableFilter: true,
                Cell: UserCell
            },
            {
                Header: 'Assistant',
                accessor: 'assistant',
                disableFilter: true,
                Cell: UserCell,
            },
            {
                Header: "Status",
                accessor: "status",
                filter: (rows, id, filterValue) => {
                    return rows.filter(row => {
                        const rowValue = row.values[id];
                        return filterValue.includes(rowValue);
                    });
                },
                Cell: StatusCell,
                Filter: SelectColumnFilter
            },
            {
                Header: 'Description',
                accessor: 'description',
                disableFilter: true,
            },
            {
                Header: '',
                accessor: 'editColumn',
                Cell: EditCell,
                disableSortBy: true,
                disableFilter: true,
            },
        ],
        []
    );

    const data = React.useMemo(() =>
            props.requests.fetchedRequests
        , [props.requests.fetchedRequests]);
    return (
        props.requests.loaded ? (
                <LayoutPage title="Comment">
                    <Table visibleFields={['deadlineAt', 'assigned']}
                           shouldResponse
                           showFilter
                           columns={columns}
                           data={props.requests.fetchedRequests.length ? data : []}/>
                </LayoutPage>)
            : <Spinner/>
    )
};

const mapStateToProps = (state) => {
    return {
        requests: state.requests,
        companies: state.companies,
        authUser: state.auth
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onRequestsGet: companyId => dispatch(actions.fetchRequests(companyId)),
        onCompanyEmployeeGet: companyId => dispatch(actions.fetchEmployees(companyId))
    }
};

export default WithErrorHandler(connect(mapStateToProps, mapDispatchToProps)(CompanyRequests), axios);
