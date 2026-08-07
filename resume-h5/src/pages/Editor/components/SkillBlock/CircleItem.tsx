import { ResumeDataContext } from '@/context';
import { ProgressCircle } from 'antd-mobile';
import { useContext } from 'react';

type PropsType = {
  title: string;
  value: number;
};
export default (props: PropsType) => {
  const { resumeData } = useContext(ResumeDataContext);
  return (
    <div className={'flex flex-col items-center'}>
      <span className={'text-center text-[14px] text-zinc-600 mb-1'}>{props.title}</span>
      <ProgressCircle
        percent={props.value * 10}
        style={{
          '--size': '50px',
          '--track-width': '4px',
          '--fill-color': resumeData.content.config.themeColor,
        }}
      >
        <span className={'text-[14px]'}>{props.value * 10}%</span>
      </ProgressCircle>
    </div>
  );
};
