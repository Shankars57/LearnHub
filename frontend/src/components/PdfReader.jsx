import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

const getPdf = async (url) => {
  const loadingTask = pdfjsLib.getDocument(url);
  const pdf = await loadingTask.promise;
  return pdf;
};

const parsePageFromHash = (hash) => {
  if (!hash) return null;
  const m = hash.match(/page=(\d+)/i);
  if (m) return Number(m[1]);
  return null;
};

const PdfReader = ({ url, onClose }) => {
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const iframeRef = useRef(null);

  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  useEffect(() => {
    const onResize = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const pdf = await getPdf(url);
        if (!mounted) return;
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (e) {}
    })();
    return () => {
      mounted = false;
    };
  }, [url]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goToPage(currentPage - 1);
      if (e.key === "ArrowRight") goToPage(currentPage + 1);
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentPage, totalPages, onClose]);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const iframe = iframeRef.current;
        if (!iframe) return;
        const win = iframe.contentWindow;
        if (!win) return;
        const hash = win.location && win.location.hash;
        const p = parsePageFromHash(hash);
        if (p && p !== currentPage && totalPages) {
          const clamped = Math.max(1, Math.min(totalPages, p));
          setCurrentPage(clamped);
        }
      } catch (e) {}
    }, 400);
    return () => clearInterval(interval);
  }, [currentPage, totalPages]);

  const buildSrc = (page) =>
    `${url}#toolbar=0&navpanes=0&zoom=page-width&page=${page}`;

  const goToPage = (n) => {
    if (!totalPages) return;
    const p = Math.max(1, Math.min(totalPages, n));
    setCurrentPage(p);
    const iframe = iframeRef.current;
    if (iframe) iframe.src = buildSrc(p);
  };

  const goFirst = () => goToPage(1);
  const goLast = () => totalPages && goToPage(totalPages);

  const isMobile = viewport.width < 768;

  const rndDefault = isMobile
    ? {
        x: 8,
        y: 24,
        width: Math.max(320, viewport.width - 16),
        height: Math.max(300, viewport.height - 64),
      }
    : { x: 80, y: 50, width: 900, height: 600 };

  return (
    <>
    
      <button
        onClick={onClose}
        onTouchStart={onClose}
        aria-label="Close PDF"
        style={{
          position: "fixed",
          top: 100,
          right: 10,
          zIndex: 99999,
          display: isMobile ? "block" : "none",
        }}
        className="bg-red-600
         text-white px-3 py-1 rounded 
         shadow"
      >
        x
      </button>

      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
        <Rnd
          key={isMobile ? "mobile" : "desktop"}
          default={rndDefault}
          minWidth={320}
          minHeight={240}
          bounds="window"
          dragHandleClassName="pdf-drag-handle"
          className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 overflow-hidden"
          enableResizing={true}
        >
          <div className="flex flex-col h-full">
            <div
              className="pdf-drag-handle flex items-center justify-between bg-gray-800 px-3 py-2 select-none"
              style={{ cursor: "move" }}
            >
              <div className="flex items-center gap-3">
                <p className="text-white text-sm">PDF Viewer</p>
                <div className="text-white text-sm bg-black/40 px-2 py-1 rounded">
                  {currentPage}
                  {totalPages ? ` / ${totalPages}` : ""}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    className="text-white bg-gray-700 px-2 py-1 rounded disabled:opacity-50"
                    disabled={!totalPages || currentPage <= 1}
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    className="text-white bg-gray-700 px-2 py-1 rounded disabled:opacity-50"
                    disabled={!totalPages || currentPage >= totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goFirst}
                  className="text-white bg-gray-700 px-2 py-1 rounded"
                  disabled={!totalPages}
                >
                  First
                </button>
                <button
                  onClick={goLast}
                  className="text-white bg-gray-700 px-2 py-1 rounded"
                  disabled={!totalPages}
                >
                  Last
                </button>

                <button
                  onClick={onClose}
                  onTouchStart={onClose}
                  className="text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700 hidden md:inline-block"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 bg-white">
              <iframe
                id="pdf-iframe"
                ref={iframeRef}
                title="pdf"
                src={buildSrc(currentPage)}
                className="w-full h-full"
                style={{ border: 0, touchAction: "auto" }}
              />
            </div>
          </div>
        </Rnd>
      </div>
    </>
  );
};

export default PdfReader;
