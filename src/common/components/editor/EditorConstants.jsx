export const LIME_EDITOR_OPTIONS = {
    mode: "classic",
    fontSize: [8, 10, 14, 18, 20, 24, 36],
    font: ["Arial", "Noto Sans Korean", "Malgun Gothic", "Dotum", "굴림", "궁서", "돋움"],
    formats: ["p", "blockquote", "h1", "h2", "h3", "h4"],
    resizingBar: false,
    imageResizing: true,
    imageFileInput: true,
    imageUrlInput: true,
    audioUrlInput: false,
    width: '100%',
    height: 'auto',
    buttonList: [
        [
            'removeFormat',
            "undo",
            "redo",
            "font",
            "fontSize",
            "formatBlock",
            // "paragraphStyle",
            // "blockquote",
        ],
        [
            'bold',
            'underline',
            'italic',
            'strike',
            'subscript',
            'superscript',

        ],
        [
            'fontColor',
            'hiliteColor',
            'outdent',
            'indent',
            'align',
            'horizontalRule',
            'list',
            'table'
        ],
        [
            'link',
            'image',
            // 'video',
            //'fullScreen',
            'showBlocks',
            'codeView',
            'preview',
            // 'print',
            // 'save'
        ]

    ],
}
