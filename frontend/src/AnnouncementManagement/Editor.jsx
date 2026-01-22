// RichTextEditor.jsx
import React, { useRef, useEffect } from "react";
import '../Style/editor.css';
import { AiOutlineBold, AiOutlineItalic, AiOutlineUnderline, AiOutlineStrikethrough } from "react-icons/ai";
import { FaListOl, FaListUl } from "react-icons/fa";


export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  // sync from parent
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const execCmd = (command) => {
    // keep focus in editor so command applies where the caret is
    editorRef.current.focus();
    document.execCommand(command, false, null);
    onChange(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd("bold")}
          className="px-2 py-1   font-bold text-white bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700 rounded-full"
          aria-label="Bold"
        >
          <AiOutlineBold />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd("italic")}
          className="px-2 py-1   italic hover:bg-gray-200 text-white bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700 rounded-full p-2"
          aria-label="Italic"
        >
          <AiOutlineItalic />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd("underline")}
          className="px-2 py-1   underline hover:bg-gray-200 text-white bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700 rounded-full p-2"
          aria-label="Underline"
        >
          <AiOutlineUnderline />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd("strikeThrough")}
          className="px-2 py-1   line-through hover:bg-gray-200 text-white bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700 rounded-full p-2"
          aria-label="Strikethrough"
        >
          <AiOutlineStrikethrough />
        </button>

        {/* Unordered + Ordered list */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd("insertUnorderedList")}
          className="px-2 py-1   hover:bg-gray-200 text-white bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700 rounded-full p-2"
          aria-label="Bulleted List"
        >
          <FaListOl />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd("insertOrderedList")}
          className="px-2 py-1   hover:bg-gray-200 text-white bg-gradient-to-r from-teal-500 via-blue-900 to-pink-700 rounded-full p-2"
          aria-label="Numbered List"
        >
          <FaListUl />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="rte-content  border rounded-lg p-2 h-[150px] focus:outline-none overflow-y-auto"
      />
    </div>
  );
}
