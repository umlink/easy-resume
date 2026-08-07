import { ResumeDataContext } from '@/context';
import InputItem from '@/pages/Editor/components/OperateModules/InputItem';
import { configItemClass } from '@/pages/Editor/components/PreviewEditor';
import { useContext } from 'react';

export default () => {
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  const changeMargin = (val: any, type: string) => {
    resumeData.content.margin = {
      ...resumeData.content.margin,
      [type]: +val || 0,
    };
    updateResume(resumeData, true);
  };

  return (
    <div className={configItemClass}>
      <b>边距</b>
      <div className={'flex items-center space-x-2'}>
        <InputItem
          width={44}
          value={resumeData.content.margin.top}
          label={'上'}
          placeholder={'上'}
          onChange={(v) => changeMargin(v, 'top')}
        />
        <InputItem
          width={44}
          value={resumeData.content.margin.right}
          label={'右'}
          placeholder={'右'}
          onChange={(v) => changeMargin(v, 'right')}
        />
        <InputItem
          width={44}
          value={resumeData.content.margin.bottom}
          label={'下'}
          placeholder={'下'}
          onChange={(v) => changeMargin(v, 'bottom')}
        />
        <InputItem
          width={44}
          value={resumeData.content.margin.left}
          label={'左'}
          placeholder={'左'}
          onChange={(v) => changeMargin(v, 'left')}
        />
      </div>
    </div>
  );
};
