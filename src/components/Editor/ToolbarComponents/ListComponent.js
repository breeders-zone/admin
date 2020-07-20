import React from "react";

const ListComponent = (props) => {
    const {config, onChange} = props;

    const onClick = (title) => {
        onChange(title);
    };
    return (
        <div className="d-flex align-items-center">
            {
                config.options.map((item) => {
                    let listTitle = item;
                    switch (item) {
                        case 'unordered':
                            listTitle = 'ul';
                            break;
                        case 'ordered':
                            listTitle = 'ol';
                            break;
                    }

                    return (
                        <div
                            key={item}
                            onClick={() => onClick(item)}
                            className="btn btn-secondary btn-sm editor-style"
                        >
                            <i
                                className={`fas fa-lg fa-list-${listTitle}`}
                            >

                            </i>
                        </div>
                    )
                })
            }
            <div className="editor-divider"></div>
        </div>
    )
};

export default ListComponent;
