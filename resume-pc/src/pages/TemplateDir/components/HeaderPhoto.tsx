import { ResumeDataContext } from '@/context';
import { useModel } from '@umijs/max';
import { useContext } from 'react';

type PropsType = {
  className?: string;
  imgClass?: string;
  hasEdit?: boolean;
  size?: number;
  round?: boolean;
  width?: number;
  height?: number;
};

const baseWidth = 90;
const baseHeight = 120;

export default (props: PropsType = { hasEdit: true }) => {
  const { resumeData, readOnly } = useContext(ResumeDataContext);
  const { onUpdateHeadImg } = useModel('global');
  const width = resumeData.content.avatar.width || props.width || props.size || baseWidth;
  const height = resumeData.content.avatar.height || props.height || props.size || baseHeight;
  return (
    <div
      className={`relative mx-auto flex justify-center overflow-hidden ${props.className}`}
      onClick={onUpdateHeadImg}
    >
      <img
        style={{ width, height, borderRadius: resumeData.content.avatar.radius || 0 }}
        className={`${props.imgClass ? props.imgClass : 'border border-zinc-100'} ${
          readOnly ? '' : 'cursor-pointer'
        } object-cover`}
        src={resumeData.content.avatar.url}
        alt="简历头像"
      />
    </div>
  );
};
