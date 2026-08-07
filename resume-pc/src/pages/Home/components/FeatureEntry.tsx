import { Link } from '@umijs/max';
import { Toolkit, Data, LightHouse, Necktie } from '@icon-park/react';
import { useModel } from '@umijs/max';

export default () => {
  const { responsive } = useModel('global');
  const iconSize = responsive.large ? 22 : 18;
  const featureList = [
    {
      icon: <Toolkit size={iconSize} />,
      label: '主题模板',
      description: '精美、简约的简历模板，随心选择，轻松制作自己满意的简历。',
      done: true,
      path: '/template',
    },
    {
      icon: <Data size={iconSize} />,
      label: '内容模板',
      description: '针对不同职业提供优秀的简历数据样板，可一键点击使用。',
      done: true,
      path: '/content/client',
    },
    {
      icon: <Necktie size={iconSize} />,
      label: '招聘入口',
      description: '集全网资源，提供快捷招聘入口，方便大家查阅',
      done: true,
      path: '/recruitment',
    },
    {
      icon: <LightHouse size={iconSize} />,
      label: '避坑指南',
      description: '帮助大家了解写简历时的一些注意事项和求职是时重点关注的陷阱。',
      done: true,
      path: '/guide',
    },
  ];
  return (
    <div className={'w-full px-4 lg:px-0'}>
      <div className={'mx-auto grid max-w-[1110px] gap-8 lg:grid-cols-2'}>
        {featureList.map((item) => {
          return (
            <Link
              to={item.done ? item.path : '/'}
              key={item.label}
              prefetch
              reloadDocument={item.done}
              className={`${
                item.done ? '' : 'cursor-not-allowed text-zinc-400'
              } g-shadow cursor-pointer space-y-3 rounded-md border border-primary bg-white p-4 md:space-y-4 md:rounded-xl md:bg-white/50 md:p-6 md:hover:shadow-md`}
            >
              <div className={`flex items-center space-x-2`}>
                {item.icon}
                <span className={'text-[18px] font-bold leading-none md:text-[18px]'}>{item.label}</span>
              </div>
              <p className={'text-[14px] md:text-[16px]'}>{item.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
