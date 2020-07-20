import React from "react";
import {Editor as DraftEditor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {EditorState, Modifier, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import InlineComponent from "./ToolbarComponents/InlineComponent";
import BlockComponent from "./ToolbarComponents/BlockComponent";
import TextAlignComponent from "./ToolbarComponents/TextAlignComponent";
import ListComponent from "./ToolbarComponents/ListComponent";
import FontSizeComponent from "./ToolbarComponents/FontSizeComponent";
import HistoryComponent from "./ToolbarComponents/HistoryComponent";

const Editor = (props) => {
    const { state = EditorState.createEmpty(), onChange } = props;

    return (
        <div className="editor form-control form-control-alternative">
            <DraftEditor
                editorState={state}
                toolbarClassName="editor-panel"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={onChange}
                toolbar={{
                    options: [
                        'inline',
                        'blockType',
                        'fontSize',
                        'list',
                        'textAlign',
                        'history',
                    ],
                    inline: {
                        options: ["bold", "italic", "underline"],
                        component: InlineComponent
                    },
                    blockType: {
                        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
                        component: BlockComponent
                    },
                    textAlign: {
                        component: TextAlignComponent
                    },
                    list: {
                        options: ['unordered', 'ordered'],
                        component: ListComponent
                    },
                    fontSize: {
                        component: FontSizeComponent
                    },
                    history: {
                        component: HistoryComponent
                    }
                }}
            />
        </div>
    );
};

export default Editor;
