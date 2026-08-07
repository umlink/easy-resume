import { ResumeDataContext } from '@/context';
import InputItem from '@/pages/Editor/components/OperateModules/InputItem';
import { PreviewCloseOne, PreviewOpen } from '@icon-park/react';
import { useContext } from 'react';
import { configItemClass } from '../PreviewEditor';

type AvatarSizeType = 'width' | 'height' | 'radius' | 'show';
export default () => {
  const { resumeData, updateResume } = useContext(ResumeDataContext);

  const changeAvatarSize = (key: AvatarSizeType, v: any) => {
    resumeData.content.avatar[key] = v;
    updateResume(resumeData);
  };

  return (
    <div className={`${configItemClass} space-x-5`}>
      <b className={'whitespace-nowrap'}>证件照</b>
      <div className={'flex items-center space-x-1'}>
        <InputItem
          label={'宽'}
          value={resumeData.content.avatar.width}
          placeholder={'宽'}
          onChange={(v) => changeAvatarSize('width', +v)}
        />
        <InputItem
          label={'高'}
          value={resumeData.content.avatar.height}
          placeholder={'高'}
          onChange={(v) => changeAvatarSize('height', +v)}
        />
        <InputItem
          label={'弧'}
          value={resumeData.content.avatar.radius}
          placeholder={'弧'}
          onChange={(v) => changeAvatarSize('radius', +v)}
        />
        <span
          className={'flex p-1 bg-zinc-100 rounded-full border border-zinc-100'}
          onClick={() => {
            resumeData.content.avatar.show = !resumeData.content.avatar.show;
            updateResume(resumeData);
          }}
        >
          {resumeData.content.avatar.show ? (
            <PreviewOpen theme="outline" size="18" />
          ) : (
            <PreviewCloseOne theme="outline" size="18" />
          )}
        </span>
      </div>
    </div>
  );
};
