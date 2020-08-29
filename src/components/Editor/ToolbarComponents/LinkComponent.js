import React, {useState} from "react";
import {DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, Label, UncontrolledDropdown} from "reactstrap";
import {CompactPicker} from "react-color";

const LinkComponent = (props) => {
    const {config, onChange, currentState} = props;
    const [isDropdown, setDropdown] = useState(false);
    const [linkText, setLinkText] = useState(currentState.selectionText);
    const [link, setLink] = useState('');
    const [isWindow, setWindow] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);


    const unlink = () => onChange('unlink');
    return (
        <div className="d-flex align-items-center position-relative">
            <UncontrolledDropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle
                    className="d-flex align-items-center"
                    href="#"
                    size="sm"
                    onClick={(e) => {
                        e.preventDefault();
                        setLinkText(currentState.selectionText);
                    }}
                >
                    <span>
                        <i
                            className="fas fa-lg fa-link m-0"
                        ></i>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow p-0">
                    <div className="editor-dropdown rounded">
                        <FormGroup className="mb-2">
                            <Label className="mb-1" htmlFor="link-text">Текст ссылки:</Label>
                            <Input
                                id="link-text"
                                className="form-control-alternative m-0"
                                name="link-text"
                                value={linkText}
                                onChange={(e) => setLinkText(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup className="mb-2">
                            <Label className="mb-1" htmlFor="link">Ссылка:</Label>
                            <Input
                                id="link"
                                className="form-control-alternative m-0"
                                name="link"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup className="d-flex align-items-center mb-2">
                            <Label className="m-0 mr-2">Открывать в новой вкладке:</Label>
                            <i
                                onClick={() => setWindow(true)}
                                className={`fa fa-lg fa-check mr-2 ${isWindow ? 'text-success' : 'text-gray'}`}
                            ></i>
                            <i
                                onClick={() => setWindow(false)}
                                className={`fa fa-lg fa-times mr-2 ${!isWindow ? 'text-danger' : 'text-gray'}`}
                            ></i>
                        </FormGroup>
                        <button
                            onClick={() => {
                                if (linkText && link) {
                                    setLinkText('');
                                    setLink('');
                                    setWindow(false);
                                    onChange('link', linkText, link, isWindow ? '_blank' : '_self');
                                    setDropdown(false);
                                    toggle();
                                }
                            }}
                            type="button"
                            className={`btn btn-primary${linkText && link ? '' : ' disabled' }`}
                        >
                            Дабавить
                        </button>
                    </div>
                </DropdownMenu>
            </UncontrolledDropdown>
            <div
                onClick={() => unlink()}
                className="btn btn-secondary btn-sm editor-style"
            >
                <i
                    className="fas fa-lg fa-unlink m-0"
                ></i>
            </div>
            <div className="editor-divider"></div>
        </div>
    )
};

export default LinkComponent;
