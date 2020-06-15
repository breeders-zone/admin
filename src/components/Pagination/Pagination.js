import {Pagination as BootstrapPagination,PaginationItem, PaginationLink} from "reactstrap";
import {times} from "../../utils";
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

const Pagination = (props) => {
    const {value = {
        current_page: null,
        last_page: null
    }} = props;
    return (
        <nav aria-label="...">
            <BootstrapPagination
                className="pagination justify-content-end mb-0"
                listClassName="justify-content-end mb-0"
            >
                <PaginationItem>
                    <PaginationLink
                        href="#pablo"
                        onClick={e => {
                            e.preventDefault();
                            if (value.current_page !== 1) {
                                const {router, history} = props;
                                const query = router.location.query;
                                query.page = value.current_page - 1;
                                history.push('?' +  window.qs.stringify(query))
                            }
                        }}
                        tabIndex="-1"
                    >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem className="active" >
                    <PaginationLink
                        href="#"
                        onClick={e => e.preventDefault()}
                    >
                        {value.current_page}
                    </PaginationLink>
                </PaginationItem>
                {
                    value.current_page !== null && value.last_page !== null ?
                        times(value.current_page + 2)((i) => {
                            const page = value.current_page + i;
                            if (page <= value.last_page) {
                                return (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            onClick={e => {
                                                e.preventDefault();
                                                const {router, history} = props;
                                                const query = router.location.query;
                                                query.page = page;
                                                history.push('?' +  window.qs.stringify(query))
                                            }}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            }
                        }) : null
                }

                <PaginationItem>
                    <PaginationLink
                        href="#pablo"
                        onClick={e => {
                            e.preventDefault();
                            if (value.last_page <= (value.current_page + 1)) {
                                const {router, history} = props;
                                const query = router.location.query;
                                query.page = value.current_page + 1;
                                history.push('?' +  window.qs.stringify(query))
                            }
                        }}
                    >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                    </PaginationLink>
                </PaginationItem>
            </BootstrapPagination>
        </nav>
    );
};

const mapStateToProps = ({router}) => ({
    router
});

export default connect(mapStateToProps)(withRouter(Pagination))