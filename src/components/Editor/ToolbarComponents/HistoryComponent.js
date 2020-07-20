import React from "react";

const HistoryComponent = (props) => {
    const {config, onChange} = props;

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
                            className={`fas fa-lg fa-${item}-alt`}
                        >

                        </i>
                    </div>
                ))
            }
        </div>
    )
};

export default HistoryComponent;
