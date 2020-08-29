import React from "react";
import {ColorChangeHandler, CompactPicker} from 'react-color';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";

const ColorPickerComponent = (props: any) => {
    const {currentState, onChange} = props;

    const handleChange: ColorChangeHandler = (color) => {
        onChange("color", color.hex)
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
                        <i className="fas fa-palette fa-lg" style={{color: currentState.color}}></i>
                    </span><i className="ni ni-bold-down"></i>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                    <DropdownItem className="compact-picker-container">
                        <CompactPicker color={currentState.color} onChange={handleChange}/>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    )
};

export default ColorPickerComponent;
