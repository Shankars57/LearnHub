import { X } from "lucide-react";
import { Rnd } from "react-rnd";

const PdfReader = ({ url, onClose }) => {
  const responsiveUrl = `${url}#toolbar=0&navpanes=0&zoom=page-width`;

  return (
    <div className="fixed inset-0 bg-black/80 z-50">
      <Rnd
        default={{ x: 80, y: 50, width: 800, height: 500 }}
        minWidth={350}
        minHeight={300}
        bounds="window"
        className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 overflow-hidden"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between bg-gray-800 px-3 py-2 cursor-move">
            <p className="text-white text-sm">PDF Viewer</p>
            <button
              onClick={onClose}
              className="text-white bg-red-600 px-2 rounded hover:bg-red-700"
            >
              <X size={14} />
            </button>
          </div>

          <iframe
            src={responsiveUrl}
            title="PDF"
            className="flex-1 w-full bg-white"
          />
        </div>
      </Rnd>
    </div>
  );
};

export default PdfReader;
