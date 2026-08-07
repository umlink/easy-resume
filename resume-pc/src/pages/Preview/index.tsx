import { previewResume } from '@/api/Resume';
import NoAccess from '@/assets/common/no-access.svg';
import { ResumeDataContext } from '@/context';
import useQueryParams from '@/hooks/useQueryParams';
import { IResumeData } from '@/pages/EditorOpt/ResumeInterface';
import Template from '@/pages/TemplateDir';
import { reversalColor } from '@/utils/tools';
import { useParams } from '@umijs/max';
import { useEffect, useState } from 'react';

export default () => {
  const [resume, setResume] = useState<IResumeData>();

  const [query] = useQueryParams();
  const params = useParams();
  useEffect(() => {
    if (!params.id) return;
    previewResume({ id: +params.id, code: query.code }).then((res) => {
      if (res.success) {
        const data = { ...(res.data as any) } as IResumeData;
        data.content.config.desc = data.content.config.desc.replace(/\n/g, '');
        setResume(data);
      }
    });
  }, []);

  const ResumeTemplate = Template[resume?.templateCode || ''];
  const tempColor = reversalColor(resume?.content.config.themeColor || '#222');

  // 打印模式下必须为会员，非会员显示水印

  return (
    <div className={`g-block-bg h-full min-h-screen bg-zinc-100 ${query.print ? '' : 'py-1 md:py-3'}`}>
      <div className={`mx-auto h-full min-h-screen bg-white ${query.print ? '' : 'max-w-[800px]'}`}>
        {!!resume ? (
          <ResumeDataContext.Provider
            value={{
              resumeData: resume,
              readOnly: true,
              luma: tempColor.luma,
              contrastColor: tempColor.contrastColor,
              updateResume: (v: IResumeData) => console.log(v),
            }}
          >
            <ResumeTemplate />
          </ResumeDataContext.Provider>
        ) : (
          <div>
            <img src={NoAccess} alt="" />
          </div>
        )}
      </div>
    </div>
  );
};
