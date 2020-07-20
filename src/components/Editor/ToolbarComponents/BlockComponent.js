import React from "react";
import {DropdownItem, DropdownMenu, DropdownToggle, Input, UncontrolledDropdown} from "reactstrap";

const BlockComponent = (props) => {
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
                        {
                            currentState.blockType !== 'Normal' ?
                                currentState.blockType
                                : 'Згаловок'
                        }
                    </span><i className="ni ni-bold-down"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                    {
                        currentState.blockType !== 'Normal' ?
                            <DropdownItem
                                onClick={() => onClick}
                            >
                               Нет заголовка
                            </DropdownItem>
                            : null
                    }
                    {
                        config.options.map( (item, idx) => {
                            if (item !== 'Normal') {
                                return (
                                    <DropdownItem
                                        key={item}
                                        onClick={() => onClick(item)}
                                    >
                                        Заголовок {idx}
                                    </DropdownItem>
                                )
                            }

                            return null
                        })
                    }
                </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    )
};

export default BlockComponent;
