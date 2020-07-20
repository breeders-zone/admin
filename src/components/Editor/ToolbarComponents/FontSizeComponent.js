import React from "react";
import {DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown} from "reactstrap";

const FontSizeComponent = (props) => {
    const {config, currentState, onChange} = props;

    const onClick = (title) => {
        onChange(title);
    };

    return (
        <div className="d-flex align-items-center">
            <UncontrolledDropdown>
                <DropdownToggle
                    className="d-flex align-items-center"
                    href="#"
                    size="sm"
                    onClick={(e) => e.preventDefault()}
                >
                    <span>
                        {currentState.fontSize ? currentState.fontSize : '14 px'}
                    </span><i className="ni ni-bold-down"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                    {
                        config.options.map( (item) => (
                            <DropdownItem
                                key={item}
                                onClick={() => onClick(item)}
                            >
                                {item} px
                            </DropdownItem>
                        ))
                    }
                </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    )
};

export default FontSizeComponent;
