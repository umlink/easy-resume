import VipContainer from '@/components/VipContainer';
import { ResumeDataContext } from '@/context';
import { VIP_ENABLED } from '@/constants/feature-flags';
import useExportPDFById from '@/hooks/useExportPDFById';
import { useModel } from '@umijs/max';
import { DownloadOne } from '@icon-park/react';
import { Button, Tooltip } from 'antd';
import React, { useContext } from 'react';

export default () => {
  const { loadingId, onExportPdf } = useExportPDFById();
  const { resumeData } = useContext(ResumeDataContext);
  const { globalData } = useModel('global');

  const canExport = !VIP_ENABLED || !!globalData.vipInfo;

  const icon = (
    <span className={'flex'}>
      <DownloadOne strokeWidth={4} size={20} />
    </span>
  );

  return (
    <Tooltip title="导出PDF" placement={'top'}>
      {canExport ? (
        <Button icon={icon} onClick={() => onExportPdf(resumeData)} loading={!!loadingId} />
      ) : (
        <VipContainer icon={icon}></VipContainer>
      )}
    </Tooltip>
  );
};
