import DivInput from '@/components/DivInput';
import { IconsMap } from '@/components/IconsSVG';
import { ResumeDataContext } from '@/context';
import { Image } from 'antd';
import { useContext } from 'react';

export default () => {
  const { resumeData, updateResume } = useContext(ResumeDataContext);
  const InfoIcon = IconsMap['FilledMail'];
  const content = resumeData.content;
  return (
    <div className={'w-full rounded-md bg-white p-1'}>
      <div className={'flex items-end'}>
        <div className={'mr-3 flex'}>
          <Image
            src={content.avatar.url}
            width={Number(content.avatar.width) * 0.75}
            height={Number(content.avatar.height) * 0.75}
            style={{ borderRadius: 4 }}
          />
        </div>
        <div>
          <h2 className={'text-[18px] font-bold'}>{content.title}</h2>
          <p className={'mt-2 text-zinc-700'}>{content.config.desc}</p>
        </div>
      </div>
      <div className={'mt-3 grid grid-cols-2 gap-[1px] text-[14px]'}>
        {content.baseInfo.list.map((info, index) => {
          return (
            <div key={index} className={'flex items-center px-1 py-[5px] outline outline-1 outline-zinc-100'}>
              <span className={'flex text-[18px]'}>
                <InfoIcon />
              </span>
              <DivInput
                style={{ textAlignLast: 'justify' }}
                className={'w-[66px] max-w-[66px] flex-1 py-[2px]'}
                value={info.key}
                placeholder={'key'}
                onChange={(v) => {
                  resumeData.content.baseInfo.list[index].key = v;
                  updateResume(resumeData);
                }}
              />
              <DivInput
                placeholder={'value'}
                className={`flex-1 py-[2px] text-right text-zinc-800`}
                value={info.value}
                onChange={(v) => {
                  resumeData.content.baseInfo.list[index].value = v;
                  updateResume(resumeData);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
