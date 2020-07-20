import React from "react";

const TextAlignComponent = (props) => {
    const {config, currentState, onChange} = props;

    const onClick = (title) => {
        onChange(title);
    };

    return (
        <div className="d-flex align-items-center">
            {
                config.options.map((item) => (
                    <div
                        key={item}
                        onClick={() => onClick(item)}
                        className="btn btn-secondary btn-sm editor-style"
                    >
                        <i
                            className={`fas fa-lg fa-align-${item}`}
                        >

                        </i>
                    </div>
                ))
            }
            <div className="editor-divider"></div>
        </div>
    )
};

export default TextAlignComponent;
