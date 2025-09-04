import api, { certificateAPI, logsAPI, studentAPI } from '@/lib/api';
import { Student } from '@/types/student';
import { Edit, Printer, Trash, FileText, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StudentDetailFooterProps {
  student: Student;
}

const StudentDetailFooter = ({ student }: StudentDetailFooterProps) => {
  const [showDocuments, setShowDocuments] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [documentList, setDocumentList] = useState<any[]>([]);
  const [printingDocument, setPrintingDocument] = useState<string | null>(null);

  const fetchLogs = async () => {
    if (!student._id) {
      setError('Student ID is missing.');
      console.log('Student ID is missing.');
      return;
    }
    setLoadingLogs(true);
    setError('');
    try {
      console.log('Fetching logs for student:', student._id);
      const response = await logsAPI.getLogs(student._id);
      console.log('Fetched logs:', response.data.data);
      setLogs(response.data.data || []);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setLogs([]);
      } else {
        console.log('Error fetching logs:', error.message);
        setError('Failed to fetch logs.');
      }
    }
    setLoadingLogs(false);
  };

  useEffect(() => {
    if (showDocuments) {
      fetchDocumentList();
    }
  }, [showDocuments]);

  useEffect(() => {
    if (showLogs) {
      fetchLogs();
    }
  }, [showLogs]);

  const fetchDocumentList = async () => {
    if (!student._id) {
      setError('Student ID is missing.');
      console.log('Student ID is missing.');
      return;
    }
    setLoadingLogs(true);
    setError('');
    try {
      console.log('Fetching documents for student:', student.schoolId);
      const response = await certificateAPI.getCertificates(student.schoolId);
      console.log('Fetched documents:', response.data);
      setDocumentList(response.data || []);
    } catch (error) {
      if (error.response?.status === 404) {
        setDocumentList([]);
      } else {
        console.log('Error fetching documents:', error.message);
        setError('Failed to fetch documents.');
      }
    }
    setLoadingLogs(false);
  };

  const fetchStudentDocs = async (docId: string) => {
    let zplCode = '';
    setPrintingDocument(docId);
    setError('');
    try {
      console.log('Fetching certificate for student...');
      const response = await certificateAPI.generateCertificate(
        student._id!,
        docId
      );
      zplCode = response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError('');
      } else {
        console.log('Error fetching certificate:', error.message);
        setError('Failed to fetch certificate.');
      }
      setPrintingDocument(null);
      return;
    }

    try {
      const labelaryResponse = await fetch(
        'https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: zplCode,
        }
      );

      if (!labelaryResponse.ok) {
        throw new Error(`Labelary error: ${labelaryResponse.statusText}`);
      }

      const blob = await labelaryResponse.blob();
      const previewUrl = URL.createObjectURL(blob);

      // Open a preview window with the rendered PNG
      const previewWindow = window.open('', '_blank', 'width=800,height=600');
      if (previewWindow) {
        previewWindow.document.write(
          `<html><head><title>Certificate Preview</title></head>
           <body style="margin:0;display:flex;justify-content:center;align-items:center;background:#f9f9f9">
             <img src="${previewUrl}" style="max-width:100%;max-height:100%;" />
           </body></html>`
        );
        previewWindow.document.close();
      } else {
        alert('Please allow pop-ups to preview the certificate.');
      }
    } catch (error: any) {
      console.log('Error rendering certificate preview:', error.message);
      alert(error.message || 'An error occurred while generating the preview.');
    }

    setPrintingDocument(null);
  };

  const handleDelete = () => {
    console.log('Delete student:', student._id);
  };

  return (
    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200 bg-white px-6 py-4">
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
      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        onClick={() => console.log('Edit student:', student._id)}>
        <Edit className="h-4 w-4" />
        Edit Student
      </button>

      <button
        className="px-4 py-2 bg-white text-black rounded-lg hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2"
        onClick={handleDelete}>
        <Trash className="h-4 w-4" />
        Delete
      </button>

      {showDocuments && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[500px]">
            <h2 className="text-lg font-semibold mb-4">Student Documents</h2>
            <div className="grid grid-cols-2 gap-4">
              {documentList.map((doc) => (
                <div
                  key={doc._id}
                  className="p-4 border rounded-lg flex items-center justify-between">
                  <span className="font-medium">{doc.name}</span>

                  <button
                    onClick={() => fetchStudentDocs(doc._id)}
                    disabled={printingDocument === doc._id}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] justify-center">
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
              {documentList.length === 0 && !loadingLogs && (
                <p className="col-span-2 text-center text-gray-500">
                  No documents found.
                </p>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDocuments(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogs && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[600px]">
            <h2 className="text-lg font-semibold mb-4">Student Log History</h2>
            {loadingLogs ? (
              <p>Loading logs...</p>
            ) : logs.length ? (
              <ul className="space-y-2">
                {logs.map((log, idx) => (
                  <li key={idx} className="text-sm border-b pb-2">
                    {log.message} - {new Date(log.createdAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No logs found.</p>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowLogs(false)}
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
