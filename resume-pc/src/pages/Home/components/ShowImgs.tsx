import { Eyes, WritingFluently } from '@icon-park/react';
import { Image, Segmented } from 'antd';
import { useState } from 'react';
export default () => {
  const featureList = [
    '真 PDF',
    '灵活切换主题',
    '高度自由的模块标题设置',
    '任意修改主题色',
    '一键制作副本',
    '自由调整证件照',
    '边距随意调整',
    '技能特长',
  ];
  const [readonly, setReadonly] = useState(false);
  return (
    <div className={'mb-5 w-full px-4 lg:mb-[60px] lg:px-0'}>
      <div className={`mx-auto w-full max-w-[1110px] space-y-[30px] px-2 md:px-0`}>
        <h3 className={'mb-[20px] text-[24px] font-extrabold'}>极致的编辑体验</h3>
        <p className={'space-x-4'}>
          {featureList.map((item, index) => (
            <span className={'g-shadow rounded-full bg-slate-100/60 px-4 py-3 text-zinc-700'} key={index}>
              {item}
            </span>
          ))}
        </p>
        <div className={'g-shadow relative rounded-lg border border-zinc-300'}>
          <Image
            className={'w-full rounded-lg'}
            src={`${
              readonly
                ? 'https://static.wktline.com/avatar/51a35cc689d2eb7be604435d052f7d78.jpg'
                : 'https://static.wktline.com/avatar/993dc47d69760a4553c0c52418430b82.jpg'
            }`}
            preview={false}
          />
          <span className={'absolute right-[22px] top-[22px] rounded border-[2px] border-red-500 shadow'}>
            <Segmented
              value={readonly}
              options={[
                { label: '编辑', value: false, icon: <WritingFluently /> },
                { label: '预览', value: true, icon: <Eyes /> },
              ]}
              onChange={(value: boolean) => setReadonly?.(value)}
            />
          </span>
        </div>
      </div>
    </div>
  );
};
