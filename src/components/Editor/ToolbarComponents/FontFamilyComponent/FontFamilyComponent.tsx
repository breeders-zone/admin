import React from "react";
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";

const FontFamilyComponent = (props: any) => {
    const {config, currentState, onChange} = props;

    const onClick = (title: string) => {
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
                            currentState.fontFamily ?
                                currentState.fontFamily
                                : 'Шрифт'
                        }
                    </span><i className="ni ni-bold-down"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                    {
                        config.options.map( (item: string, idx: number) => {
                            return (
                                <DropdownItem
                                    key={item}
                                    onClick={() => onClick(item)}
                                >
                                    {item}
                                </DropdownItem>
                            )
                        })
                    }
                </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    )
};

export default FontFamilyComponent;
