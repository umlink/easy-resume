import { ResumeDataContext } from '@/context';
import { useContext } from 'react';

type PropsType = {
  title: string;
  value: number;
};
export default (props: PropsType) => {
  const { resumeData } = useContext(ResumeDataContext);
  const arr = new Array(10).fill(1);
  return (
    <div className={'flex flex-col'}>
      <span className={'text-[14px] text-zinc-600 mb-1'}>{props.title}</span>
      <div className={'flex space-x-[2px] items-center'}>
        {arr.map((_, i) => (
          <span
            key={i}
            className={`inline-block w-3 h-2 bg-zinc-100`}
            style={{
              backgroundColor: props.value >= i + 1 ? resumeData.content.config.themeColor : '',
            }}
          ></span>
        ))}
      </div>
    </div>
  );
};
