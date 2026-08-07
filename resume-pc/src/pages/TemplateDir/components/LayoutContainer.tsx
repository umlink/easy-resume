import { ResumeDataContext } from '@/context';
import useQueryParams from '@/hooks/useQueryParams';
import { useContext } from 'react';

type PropsType = {
  children: any;
  preview?: boolean;
};
export default (props: PropsType) => {
  const { children } = props;
  const { resumeData } = useContext(ResumeDataContext);
  const margin = resumeData.content.margin;
  const [query] = useQueryParams();
  let containerStyle = {};
  // 非打印页面则填充 padding即可，打印是，puppeteer 自动设置 margin
  if (!query.print) {
    containerStyle = {
      paddingLeft: margin.left,
      paddingRight: margin.right,
      paddingTop: margin.top,
      paddingBottom: margin.bottom,
    };
  }
  return (
    <div
      className={`no-scrollbar ${resumeData.templateCode} box-border min-h-screen rounded-xl bg-white text-[14px]`}
      id="preview-block"
      style={containerStyle}
    >
      {children}
    </div>
  );
};
