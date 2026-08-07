import { Popover } from 'antd-mobile';
import { SVGProps, useRef } from 'react';
import BookPage from './BookPage';
import CalenderSolid from './CalenderSolid';
import EducationInfo from './EducationInfo';
import EmptyFill from './EmptyFill';
import HonorInfo from './HonorInfo';
import KeepOn from './KeepOn';
import Other from './Other';
import PersonComment from './PersonComment';
import PlayList from './PlayList';
import ProjectList from './ProjectList';
import ProjectUser from './ProjectUser';
import StarIcon from './StarIcon';
import TestWork from './TestWork';
import UserFillIcon from './UserFillIcon';
import WorkRecord from './WorkRecord';
import WorkTest from './WorkTest';

export const TitleIconsMap: Record<string, (props: SVGProps<SVGSVGElement>) => JSX.Element> = {
  UserFillIcon,
  EducationInfo,
  WorkRecord,
  ProjectList,
  PlayList,
  ProjectUser,
  CalenderSolid,
  StarIcon,
  BookPage,
  Other,
  WorkTest,
  EmptyFill,
  KeepOn,
  TestWork,
  HonorInfo,
  PersonComment,
};

type PropsType = {
  type?: string;
  readOnly?: boolean;
  onSelect?: (key: string) => void;
};
export default (props: PropsType) => {
  const ref = useRef(null);
  const Icon = TitleIconsMap[props.type || 'EmptyFill'];
  const iconList = Object.keys(TitleIconsMap);

  if (props.readOnly)
    return (
      <span className={'flex text-[22px]'}>
        <Icon />
      </span>
    );

  const content = (
    <div className={'grid grid-cols-4 gap-[1px] text-[25px]'} ref={ref}>
      {iconList.map((key) => {
        const Icon = TitleIconsMap[key];
        return (
          <span
            key={key}
            className={'flex cursor-pointer bg-zinc-50 p-2 text-zinc-700 hover:bg-zinc-200'}
            onClick={() => props.onSelect?.(key)}
          >
            <Icon />
          </span>
        );
      })}
    </div>
  );
  return (
    <Popover stopPropagation={[]} getContainer={null} placement="bottom-start" content={content} trigger="click">
      <span className={'flex cursor-pointer outline-dashed outline-1 text-[25px] outline-zinc-300'}>
        <Icon />
      </span>
    </Popover>
  );
};
