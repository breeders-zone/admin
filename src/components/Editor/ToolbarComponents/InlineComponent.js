import React from "react";

const InlineComponent = (props) => {
    const {config, currentState, onChange} = props;

    const onClick = (title) => {
        onChange(title, !currentState[title]);
    };

    return (
        <div className="d-flex align-items-center">
            {
                config.options.map((item) => (
                    <div
                        key={item}
                        onClick={() => onClick(item)}
                        className={`btn btn-secondary btn-sm editor-style ${currentState[item] ? ' editor-active' : ''}`}
                    >
                        <i
                            className={`fas fa-lg fa-${item}`}
                        >

                        </i>
                    </div>
                ))
            }

            <div className="editor-divider"></div>
        </div>
    )
};

export default InlineComponent;
