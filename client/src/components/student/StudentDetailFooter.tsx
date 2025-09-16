import api, { certificateAPI, logsAPI, studentAPI } from '@/lib/api';
import { formatDate } from '@/types/school';
import { Student } from '@/types/student';
import { Edit, Printer, Trash, FileText, Clock, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StudentDetailFooterProps {
  student: Student;
}

const StudentDetailFooter = ({ student }: StudentDetailFooterProps) => {
  const [showDocuments, setShowDocuments] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const [documentList, setDocumentList] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const [printingDocument, setPrintingDocument] = useState<string | null>(null);

  const fetchLogs = async () => {
    if (!student._id) return setError('Student ID is missing.');

    setLoadingLogs(true);
    setError(null);
    try {
      const response = await logsAPI.getLogs(student._id);
      setLogs(response.data.data || []);
    } catch (err: any) {
      if (err.response?.status === 404) setLogs([]);
      else setError('Failed to fetch logs. Please try again later.');
    }
    setLoadingLogs(false);
  };

  const fetchDocumentList = async () => {
    if (!student._id) return setError('Student ID is missing.');

    setLoadingDocs(true);
    setError(null);
    try {
      const response = await certificateAPI.getCertificates(student.schoolId);
      setDocumentList(response.data || []);
    } catch (err: any) {
      if (err.response?.status === 404) setDocumentList([]);
      else setError('Failed to fetch documents.');
    }
    setLoadingDocs(false);
  };

  const fetchStudentDocs = async (docId: string) => {
    setPrintingDocument(docId);
    setError(null);

    try {
      const response = await certificateAPI.generateCertificate(
        student._id!,
        docId
      );
      const zplCode = response.data.data;

      const labelaryResponse = await fetch(
        'https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: zplCode,
        }
      );

      if (!labelaryResponse.ok)
        throw new Error('Unable to render certificate.');

      const blob = await labelaryResponse.blob();
      const previewUrl = URL.createObjectURL(blob);

      window.open(previewUrl, '_blank');
    } catch (err: any) {
      setError(err.message || 'Error generating certificate preview.');
    }

    setPrintingDocument(null);
  };

  useEffect(() => {
    if (showDocuments) fetchDocumentList();
  }, [showDocuments]);
  useEffect(() => {
    if (showLogs) fetchLogs();
  }, [showLogs]);
  return (
    <div className="mt-6 flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-200 bg-white px-4 md:px-6 py-4">
      {/* Documents */}
      <button
        onClick={() => setShowDocuments(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Documents
      </button>

      {/* Logs */}
      <button
        onClick={() => setShowLogs(true)}
        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Logs
      </button>

      {/* Edit */}
      {/* <button
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        onClick={() => console.log('Edit student:', student._id)}>
        <Edit className="h-4 w-4" />
        Edit Student
      </button> */}

      {/* Shared Modal */}
      {(showDocuments || showLogs) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg md:max-w-2xl p-6 m-4 relative">
            {/* Error handling */}
            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-100 text-red-700 rounded-lg">
                <XCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Documents Modal */}
            {showDocuments && (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  Student Documents
                </h2>
                {loadingDocs ? (
                  <p className="text-gray-500">Loading documents...</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {documentList.map((doc) => (
                      <div
                        key={doc._id}
                        className="p-3 border rounded-lg flex justify-between items-center">
                        <span className="font-medium text-sm">{doc.name}</span>
                        <button
                          onClick={() => fetchStudentDocs(doc._id)}
                          disabled={printingDocument === doc._id}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1">
                          {printingDocument === doc._id ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                          ) : (
                            <>
                              <Printer className="h-4 w-4" />
                              Print
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                    {!documentList.length && (
                      <p className="text-gray-500 text-sm col-span-2">
                        No documents found.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Logs Modal */}
            {showLogs && (
              <>
                <h2 className="text-lg font-semibold mb-4">
                  Student Log History
                </h2>
                {loadingLogs ? (
                  <p className="text-gray-500">Loading logs...</p>
                ) : logs.length ? (
                  <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                    {logs.map((log, idx) => (
                      <li key={idx} className="text-sm border-b pb-2">
                        {log.message} –{' '}
                        <span className="text-gray-500">
                          {formatDate(log.createdAt)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No logs found.</p>
                )}
              </>
            )}

            {/* Close button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowDocuments(false);
                  setShowLogs(false);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetailFooter;
