import { getGuideList } from '@/api/Guide';
import AccessAdmin from '@/components/AccessAdmin';
import { LightHouse, ListTwo, PlusCross } from '@icon-park/react';
import { history, Link, NavLink, useModel } from '@umijs/max';
import { Affix, Drawer, FloatButton } from 'antd';
import { useEffect, useState } from 'react';

export default () => {
  const [guideList, setGuidList] = useState<API.GuideItemVO[]>([]);
  const { showMenu, setShowMenu } = useModel('Guide.model');

  useEffect(() => {
    getGuideList({ pageNum: 1, pageSize: 20 }).then((res) => {
      if (res.success) {
        const list = res.data?.list || [];
        setGuidList(list);
        history.replace(`/guide/${list[0].id}`);
      }
    });
  }, []);

  const GuideLink = ({ isDrawer }: { isDrawer?: boolean }) => {
    return (
      <div
        className={`${
          isDrawer ? '' : 'w-[280px] border-r border-r-zinc-200'
        } min-h-[calc(100vh-75px)] space-y-[1px] bg-white pb-2 text-[15px]`}
      >
        <div
          onClick={() => setShowMenu(false)}
          className={`hidden items-center justify-between border-b border-b-zinc-200 p-3 md:flex`}
        >
          <span className={'space-x-2 text-zinc-900'}>
            <LightHouse size="20" />
            <b>避坑指南</b>
          </span>
          <AccessAdmin>
            <Link to={'/guide/edit'} className={'!text-zinc-700'}>
              <PlusCross />
            </Link>
          </AccessAdmin>
        </div>
        {guideList.map((item) => {
          return (
            <NavLink
              to={`/guide/${item.id}`}
              onClick={() => setShowMenu(false)}
              className={'block cursor-pointer truncate px-3 py-2 hover:bg-zinc-50'}
              key={item.id}
            >
              {({ isActive }) => (
                <span className={isActive ? 'g-line-bg-text font-bold' : 'text-zinc-600'}>{item.title}</span>
              )}
            </NavLink>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Affix offsetTop={75} className={'[&_.ant-affix]:!z-1 hidden md:inline-block'}>
        <GuideLink />
      </Affix>
      <span className={'md:hidden'}>
        <FloatButton
          style={{ right: 16, bottom: 180, zIndex: 999 }}
          onClick={() => setShowMenu(true)}
          icon={<ListTwo />}
        />
      </span>
      <Drawer
        width={320}
        title={null}
        styles={{ body: { padding: 0 } }}
        onClose={() => setShowMenu(false)}
        open={showMenu}
      >
        <GuideLink isDrawer />
      </Drawer>
    </>
  );
};
