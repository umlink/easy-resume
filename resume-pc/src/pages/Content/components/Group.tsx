import HtmlDev from '@/components/CommonIcons/HtmlDev';
import Services from '@/components/CommonIcons/Services';
import UIDesign from '@/components/CommonIcons/UIDesign';
import ProductUser from '@/components/CommonIcons/ProductUser';
import ProjectUser from '@/components/CommonIcons/ProjectUser';
import HRBP from '@/components/CommonIcons/HRBP';
import TestDev from '@/components/CommonIcons/TestDev';
import TestBug from '@/components/CommonIcons/TestBug';
import { Link } from '@@/exports';
import { useModel } from '@umijs/max';
import { Affix } from 'antd';

export const groupIconObj: Record<string, any> = {
  HtmlDev,
  Services,
  UIDesign,
  ProductUser,
  ProjectUser,
  TestBug,
  HRBP,
  TestDev,
};
const groupKeyClass = 'bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text font-extrabold !text-transparent';
const BaseGroup = () => {
  const { state } = useModel('Content.model');
  return (
    <div className={'w-[150px] space-y-1 md:h-full'}>
      {state.groupList.map((item) => {
        const Icon = groupIconObj[item.icon] || HtmlDev;
        return (
          <Link
            key={item.key}
            to={`/content/${item.key}`}
            className={`
                flex cursor-pointer
                items-center space-x-4
                rounded-xl border
                border-zinc-100 !bg-zinc-50/70
                px-4 py-2 text-center text-[14px] font-extrabold
                hover:!bg-zinc-100 lg:border-transparent
                `}
          >
            <span className={'flex text-[18px]'}>
              <Icon />
            </span>
            <span className={`flex text-zinc-700 ${item.key === state.groupKey ? groupKeyClass : ''}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default () => {
  return (
    <Affix offsetTop={75} className={'[&_.ant-affix]:!z-1'}>
      <BaseGroup />
    </Affix>
  );
};
