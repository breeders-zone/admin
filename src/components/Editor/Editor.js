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
import LinkComponent from "./ToolbarComponents/LinkComponent";
import FontFamilyComponent from "./ToolbarComponents/FontFamilyComponent";
import ColorPickerComponent from "./ToolbarComponents/ColorPickerComponent";
import {stateFromHTML} from "draft-js-import-html";

const Editor = (props) => {
    const { state = EditorState.createEmpty(), onChange } = props;

    const handlePastedText = (text, html) => {
        const blockMap = stateFromHTML(html || text).blockMap;
        const newState = Modifier.replaceWithFragment(state.getCurrentContent(), state.getSelection(), blockMap);
        onChange(EditorState.push(state, newState, 'insert-fragment'));
        return true
    };

    return (
        <div className="editor form-control form-control-alternative text-dark">
            <DraftEditor
                editorState={state}
                toolbarClassName="editor-panel"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={onChange}
                handlePastedText={handlePastedText}
                toolbar={{
                    options: [
                        'inline',
                        'link',
                        'blockType',
                        'fontSize',
                        'fontFamily',
                        'colorPicker',
                        'list',
                        'textAlign',
                        'history',
                    ],
                    inline: {
                        options: ["bold", "italic", "underline"],
                        component: InlineComponent
                    },
                    colorPicker: {
                        component: ColorPickerComponent
                    },
                    fontFamily: {
                        options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana', 'Open Sans'],
                        component: FontFamilyComponent
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
                    },
                    link: {
                        component: LinkComponent
                    }
                }}
            />
        </div>
    );
};

export default Editor;
