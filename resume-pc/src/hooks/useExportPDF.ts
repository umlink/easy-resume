import { LOCALHOST_ENUMS } from '@/constants/enums';
import { IResumeData } from '@/pages/EditorOpt/ResumeInterface';
import { request } from '@umijs/max';
import { useState } from 'react';

const useExportPDF = () => {
  const [loadingId, setLoadingId] = useState(0);
  const onExportPdf = (resumeData: IResumeData) => {
    setLoadingId(resumeData.id);
    const url = encodeURIComponent(`${location.origin}/preview/${resumeData.id}?print=1`);
    const margin = JSON.stringify(resumeData.content.margin);
    const fileName = encodeURIComponent(resumeData.title);
    const token = localStorage.getItem(LOCALHOST_ENUMS.TOKEN);

    request(
      `${location.origin}/resume-api/wktline/pdf?url=${url}&margin=${margin}&fileName=${fileName}&token=${token}`,
      {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/pdf',
        },
      },
    )
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

export default useExportPDF;
