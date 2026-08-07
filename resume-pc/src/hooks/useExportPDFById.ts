import { exportPDF } from '@/api/Resume';
import { IResumeData } from '@/pages/EditorOpt/ResumeInterface';
import { request } from '@umijs/max';
import { useState } from 'react';

const useExportPDFById = () => {
  const [loadingId, setLoadingId] = useState(0);
  const onExportPdf = async (resumeData: IResumeData) => {
    setLoadingId(resumeData.id);
    const res = await exportPDF({ id: resumeData.id });
    if (!res.success) {
      return setLoadingId(0);
    }
    request(`/resume-api/puppeteer/pdf?authCode=${res.data}`, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/pdf',
      },
    })
      .then((res: any) => {
        const blob = new Blob([res]);
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.setAttribute('download', `${resumeData.title}.pdf`);
        a.click();
      })
      .finally(() => setLoadingId(0));
  };
  return {
    loadingId,
    onExportPdf,
  };
};

export default useExportPDFById;
