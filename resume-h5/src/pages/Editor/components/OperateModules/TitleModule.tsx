import { ResumeDataContext } from '@/context';
import InputItem from '@/pages/Editor/components/OperateModules/InputItem';
import { configItemClass, configItemValClass } from '@/pages/Editor/components/PreviewEditor';
import { PreviewCloseOne, PreviewOpen } from '@icon-park/react';
import { Popover } from 'antd-mobile';
import { useContext } from 'react';
enum TitleEnum {
  ET1 = 'ET1',
  ET2 = 'ET2',
  ET3 = 'ET3',
  ET4 = 'ET4',
  ET5 = 'ET5',
  ET6 = 'ET6',
  ET7 = 'ET7',
  IconLongBg = 'IconLongBg',
  IconRoundBg = 'IconRoundBg',
  RoundBgLine = 'RoundBgLine',
  RoundLongShallowBg = 'RoundLongShallowBg',
  RoundDarkOblique = 'RoundDarkOblique',
  RoundLineBgLine = 'RoundLineBgLine',
  RoundLongLineShallowBg = 'RoundLongLineShallowBg',
}
const titleLabelMap: any = {
  [TitleEnum.ET1]: '基础常规',
  [TitleEnum.ET2]: '背景渐变',
  [TitleEnum.ET3]: '无底无边',
  [TitleEnum.ET4]: '短边无底',
  [TitleEnum.ET5]: '短深背景',
  [TitleEnum.ET7]: '浅边背景',
  [TitleEnum.ET6]: '英文专用',
  [TitleEnum.RoundDarkOblique]: '斜角深底',
  [TitleEnum.IconLongBg]: '长浅背景',
  [TitleEnum.IconRoundBg]: '圆角带边',
  [TitleEnum.RoundLongShallowBg]: '圆角带边浅底',
  [TitleEnum.RoundLongLineShallowBg]: '圆角带边渐变',
  [TitleEnum.RoundLineBgLine]: '小角带边渐变',
  [TitleEnum.RoundBgLine]: '小角标带边浅底',
};

const titleActions = Object.keys(titleLabelMap).map((key) => {
  return {
    key,
    text: titleLabelMap[key],
  };
});
export default () => {
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  return (
    <div className={'pb-2 border-b border-dashed border-b-zinc-200'}>
      <div className={`${configItemClass} !border-0`}>
        <b className={'whitespace-nowrap'}>模块标题</b>
        <Popover.Menu
          actions={titleActions}
          placement="bottom-start"
          trigger="click"
          onAction={(node) => {
            resumeData.content.config.entryTitleMode = node.key;
            updateResume(resumeData, true);
          }}
        >
          <span className={configItemValClass}>{titleLabelMap[resumeData.content.config.entryTitleMode]}</span>
        </Popover.Menu>
      </div>
      <div className={'flex items-center justify-between space-x-2'}>
        <span className={'flex space-x-1 items-center'}>
          <span>是否显示标题图标：</span>
          <span
            className={'flex p-1 rounded-full bg-zinc-100 border text-zinc-900 border-zinc-100'}
            onClick={() => {
              resumeData.content.config.showEntryTitleIcon = !resumeData.content.config.showEntryTitleIcon;
              updateResume(resumeData, true);
            }}
          >
            {resumeData.content.config.showEntryTitleIcon ? (
              <PreviewOpen theme="outline" size="22" />
            ) : (
              <PreviewCloseOne theme="outline" size="22" />
            )}
          </span>
        </span>
        <InputItem
          label={'标题大小'}
          width={80}
          placeholder={'14-22'}
          value={resumeData.content.config.entryTitleSize}
          onChange={(v) => {
            let size = +v;
            if (size < 14) size = 14;
            if (size > 20) size = 20;
            resumeData.content.config.entryTitleSize = size;
            updateResume(resumeData);
          }}
        />
      </div>
    </div>
  );
};
