import { SVGProps } from 'react';
import UserFillIcon from './UserFillIcon';
import EducationInfo from './EducationInfo';
import PlayList from './PlayList';
import ProjectList from './ProjectList';
import WorkRecord from './WorkRecord';
import CalenderSolid from './CalenderSolid';
import EmptyFill from './EmptyFill';
import ProjectUser from './ProjectUser';
import StarIcon from './StarIcon';
import WorkTest from './WorkTest';
import BookPage from './BookPage';
import KeepOn from './KeepOn';
import Other from './Other';
import TestWork from './TestWork';
import HonorInfo from './HonorInfo';
import PersonComment from './PersonComment';
import { Popover } from 'antd';

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
  onSelect: (key: string) => void;
};
export default (props: PropsType) => {
  const Icon = TitleIconsMap[props.type || 'EmptyFill'];
  const iconList = Object.keys(TitleIconsMap);
  if (props.readOnly) return <Icon />;
  const content = (
    <div className={'grid grid-cols-4 gap-[1px] text-[20px]'}>
      {iconList.map((key) => {
        const Icon = TitleIconsMap[key];
        return (
          <span
            key={key}
            className={'flex cursor-pointer bg-zinc-50 p-2 text-zinc-700 hover:bg-zinc-200'}
            onClick={() => props.onSelect(key)}
          >
            <Icon />
          </span>
        );
      })}
    </div>
  );
  return (
    <Popover content={content} placement={'bottom'} trigger="hover">
      <span className={'flex cursor-pointer outline-dashed outline-1 outline-zinc-300'}>
        <Icon />
      </span>
    </Popover>
  );
};
