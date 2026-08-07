import { ResumeDataContext } from '@/context';
import DivProgress from '@/pages/TemplateDir/components/DivProgress';
import Title from '@/pages/TemplateDir/components/Title';
import { Plus } from '@icon-park/react';
import { Button } from 'antd';
import { useContext } from 'react';

export default (props: { color?: string }) => {
  const { resumeData, readOnly, updateResume } = useContext(ResumeDataContext);

  if (!resumeData.content.skill.show) return null;

  const onCreateSkill = () => {
    if (resumeData.content.skill) {
      resumeData.content.skill.list.push({
        key: '自定义',
        value: 8,
      });
      updateResume(resumeData);
    }
  };

  const isRow = resumeData.content.skill.direction === 'row';
  const isDashboard = resumeData.content.skill.type === 'dashboard';
  const titleWarp = resumeData.content.skill.titleWarp ?? true;
  return (
    <div className={`${resumeData.content.config.lineSpace}`}>
      <Title
        value={resumeData.content.skill.title}
        icon={resumeData.content.skill.icon}
        onSelectIcon={(icon: string) => {
          resumeData.content.skill.icon = icon;
          updateResume(resumeData);
        }}
        onChange={(v) => {
          resumeData.content.skill!.title = v;
          updateResume(resumeData);
        }}
      ></Title>
      <div className={'pt-2'}>
        <div className={`${isRow ? 'flex flex-wrap' : ''}`}>
          {resumeData.content.skill.list.map((item, index) => {
            return (
              <div
                key={index}
                className={`${isDashboard ? 'mb-4' : ''} ${isRow ? 'mb-3 mr-5' : `${titleWarp ? 'mb-3' : ''}`}`}
              >
                <DivProgress
                  color={props.color}
                  item={item}
                  step={resumeData.content.skill?.step}
                  onDelete={() => {
                    resumeData.content.skill?.list.splice(index, 1);
                    updateResume(resumeData);
                  }}
                  index={index}
                  onUpdate={(v) => {
                    resumeData.content.skill!.list[index] = v;
                    updateResume(resumeData);
                  }}
                />
              </div>
            );
          })}
        </div>
        {!readOnly && (
          <div className={'mt-2rounded-sm'}>
            <Button icon={<Plus />} className={'w-[132px]'} onClick={onCreateSkill} type="dashed">
              添加
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
