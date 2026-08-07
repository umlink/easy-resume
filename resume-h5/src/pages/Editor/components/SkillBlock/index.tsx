import { ResumeDataContext } from '@/context';
import TitleIcons from '@/pages/components/TitleIcons';
import CircleItem from '@/pages/Editor/components/SkillBlock/CircleItem';
import LineItem from '@/pages/Editor/components/SkillBlock/LineItem';
import { CollapseTextInput, ExpandTextInput, SettingTwo } from '@icon-park/react';
import { List } from 'antd-mobile';
import { useContext } from 'react';

type PropsType = {
  openKeys: string[];
  onSingleExpand: (v: string) => void;
};

export const uniSkillKey = 'skill';
export default (props: PropsType) => {
  const { openKeys, onSingleExpand } = props;
  const { resumeData } = useContext(ResumeDataContext);

  const isDashboard = resumeData?.content.skill.type === 'dashboard';

  return (
    <div>
      <List.Item
        className={'!pl-0 [&_.adm-list-item-content-main]:!pl-3'}
        key={uniSkillKey}
        extra={
          <div className={'flex items-center space-x-2'}>
            <span className={'flex p-1'} onClick={() => onSingleExpand(uniSkillKey)}>
              {openKeys.includes(uniSkillKey) ? (
                <CollapseTextInput theme="outline" size={18} fill="#999" />
              ) : (
                <ExpandTextInput theme="outline" size={18} fill="#999" />
              )}
            </span>

            <span className={'flex p-1'}>
              <SettingTwo theme="outline" size={20} fill={resumeData.content.config.themeColor} />
            </span>
          </div>
        }
      >
        <div
          style={{ color: resumeData.content.config.themeColor }}
          className={'flex items-center space-x-2 text-zinc-700'}
        >
          <TitleIcons readOnly={true} type={resumeData.content.skill.icon} />
          <b className={'text-[17px]'}>{resumeData.content.skill.title}</b>
        </div>
      </List.Item>
      {openKeys.includes(uniSkillKey) && (
        <div className={`p-3 ${isDashboard ? 'grid-cols-4' : 'grid-cols-2'} grid grid-cols-2 gap-2`}>
          {resumeData?.content.skill.list.map((item, index) => {
            const SkillItem = isDashboard ? CircleItem : LineItem;
            return <SkillItem value={+item.value} key={`${index}${item}`} title={item.key} />;
          })}
        </div>
      )}
    </div>
  );
};
