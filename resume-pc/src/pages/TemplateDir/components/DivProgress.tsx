import DivInput from '@/components/DivInput';
import { ResumeDataContext } from '@/context';
import { CloseOne } from '@icon-park/react';
import { Progress } from 'antd';
import { useContext } from 'react';

type ProgressItemType = { key: string; value: string | number };

type PropsType = {
  item: ProgressItemType;
  index: number;
  step?: number;
  color?: string;
  onUpdate: (v: ProgressItemType) => void;
  onDelete: () => void;
};

export default (props: PropsType) => {
  const { readOnly, resumeData } = useContext(ResumeDataContext);
  const onChange = (v: any) => {
    props.onUpdate({
      ...props.item,
      ...v,
    });
  };

  const skillType = resumeData.content.skill.type || 'step';
  const skillSize: any = resumeData.content.skill.size || 15;
  const themeColor = props.color || resumeData.content.config.themeColor;
  const titleWarp = resumeData.content.skill.titleWarp ?? true;

  return (
    <div
      className={`group/progress relative flex items-center rounded-sm text-[14px] ${
        readOnly ? '' : ' hover:outline hover:outline-1 hover:outline-zinc-900'
      }`}
    >
      <div
        className={` ${
          titleWarp
            ? `${skillType === 'dashboard' ? 'items-center' : ''} flex flex-col space-y-[1px] leading-none`
            : 'flex items-center space-x-1'
        }`}
      >
        <div className={`space-x-[1px] ${titleWarp ? 'mb-1' : ''}`}>
          <DivInput
            value={props.item.key}
            placeholder={'技能'}
            className={`${skillType === 'dashboard' ? 'text-center' : ''} ${titleWarp ? 'px-0' : ''}`}
            style={{ width: resumeData.content.skill.titleWidth || 80 }}
            onChange={(v) => onChange({ key: v })}
          />
          {!readOnly && (
            <DivInput
              value={props.item.value}
              placeholder={'1-9'}
              className={`min-w-[50px] ${skillType === 'dashboard' ? 'text-center' : ''}`}
              onChange={(v) => onChange({ value: v })}
            />
          )}
        </div>
        {skillType === 'dashboard' && (
          <Progress
            className={'[&_.ant-progress-text]:!text-zinc-400'}
            type="dashboard"
            steps={10}
            size={skillSize}
            strokeColor={themeColor}
            percent={+props.item.value * 10}
            trailColor="rgba(0, 0, 0, 0.06)"
            success={{ strokeColor: themeColor }}
            strokeWidth={12}
          />
        )}
        {skillType === 'step' && (
          <Progress
            size={{ height: 8, width: skillSize }}
            strokeColor={themeColor}
            percent={+props.item.value * 10}
            steps={10}
            showInfo={false}
          />
        )}
      </div>
      {!readOnly && (
        <span
          onClick={props.onDelete}
          className={
            'absolute right-[-8px] top-[-8px] hidden cursor-pointer bg-white leading-none group-hover/progress:inline-block'
          }
        >
          <CloseOne theme="outline" size="18" strokeWidth={5} />
        </span>
      )}
    </div>
  );
};
