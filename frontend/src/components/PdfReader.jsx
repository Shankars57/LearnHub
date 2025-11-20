import { X } from "lucide-react";

const PdfReader = ({ url, onClose }) => {
  const responsiveUrl = `${url}#toolbar=0&navpanes=0&zoom=page-width`;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-3 sm:p-6">
      <div className="relative bg-gray-900 rounded-lg w-full h-[90vh] sm:w-[90vw] sm:max-w-4xl sm:h-[85vh] overflow-hidden shadow-lg border border-gray-700">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded-md z-20"
        >
          <X size={16} />
        </button>

        <iframe
          src={responsiveUrl}
          title="PDF Preview"
          className="w-full h-full bg-white"
          style={{
            border: "none",
            overflow: "hidden",
          }}
        />
      </div>
    </div>
  );
};

export default PdfReader;
