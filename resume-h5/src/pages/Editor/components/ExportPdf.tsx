import { ResumeDataContext } from '@/context';
import useExportPDFById from '@/pages/hooks/useExportPDFById';
import { DownloadOne } from '@icon-park/react';
import { useContext } from 'react';

export default () => {
  const { onExportPdf } = useExportPDFById();
  const { resumeData } = useContext(ResumeDataContext);

  const onHandlerExport = () => {
    // if (window.wx) {
    //   window.wx.miniProgram.navigateTo({
    //     url: `/pages/download/index?resumeId=${resumeData.id}&title=${resumeData.title}`,
    //   });
    // } else {
    //   onExportPdf(resumeData);
    // }
    onExportPdf(resumeData);
  };

  return (
    <span className={'action-span-btn'} onClick={onHandlerExport}>
      <DownloadOne theme="filled" size="24" />
    </span>
  );
};
