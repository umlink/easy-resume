import DivInput from '@/components/DivInput';
import { ResumeDataContext } from '@/context';
import DelGroup from '@/pages/TemplateDir/components/DelGroup';
import HeaderPhoto from '@/pages/TemplateDir/components/HeaderPhoto';
import PlusBtn from '@/pages/TemplateDir/components/PlusBtn';
import { Fragment, useContext } from 'react';

export default () => {
  const { resumeData, readOnly, updateResume } = useContext(ResumeDataContext);
  const onCreateBaseInfo = () => {
    resumeData.content.baseInfo.list.push({
      key: 'key',
      value: 'value',
    });
    updateResume(resumeData);
  };

  const themeColor = resumeData.content.config.themeColor;

  return (
    <div className={'mb-4'}>
      <div className={'flex space-x-[1px] px-8 pb-4'}>
        <DivInput
          lineEntry
          placeholder={'value'}
          style={{
            color: themeColor,
            borderColor: resumeData.content.config.desc ? themeColor : 'transparent',
          }}
          className={`min-w-[90px] !rounded-none border-r pl-0 pr-5 text-[34px] font-semibold leading-none`}
          value={resumeData.content.baseInfo.list[0]?.value}
          onChange={(v) => {
            resumeData.content.baseInfo.list[0].value = v;
            updateResume(resumeData);
          }}
        />
        {(!readOnly || !!resumeData.content.config.desc) && (
          <DivInput
            lineEntry
            placeholder={'其他信息'}
            className={`min-w-[200px] flex-1 self-center pl-4 text-[18px] text-zinc-500`}
            value={resumeData.content.config.desc}
            onChange={(v) => {
              resumeData.content.config.desc = v;
              updateResume(resumeData);
            }}
          />
        )}
      </div>
      <div className={'px-8 py-4 text-white'} style={{ backgroundColor: resumeData.content.config.themeColor }}>
        <div className={'flex items-start justify-between space-x-2 text-zinc-600'}>
          <div className={'grid flex-1 grid-cols-2 gap-[1px]'}>
            {resumeData.content.baseInfo.list.slice(1).map((item, i) => {
              const index = i + 1;
              return (
                <DelGroup
                  key={index}
                  readOnly={readOnly}
                  onDel={() => {
                    resumeData.content.baseInfo.list.splice(index, 1);
                    updateResume(resumeData);
                  }}
                >
                  <Fragment>
                    <DivInput
                      style={{ textAlignLast: 'justify' }}
                      textClass={'grid text-zinc-50'}
                      className={`max-w-[64px] flex-1 text-justify ${readOnly ? 'pr-0' : 'max-w-[70px]'}`}
                      value={item.key}
                      placeholder={'key'}
                      onChange={(v) => {
                        resumeData.content.baseInfo.list[index].key = v;
                        updateResume(resumeData);
                      }}
                    />
                    {readOnly && <span className={'text-white'}>:</span>}
                    <DivInput
                      placeholder={'value'}
                      className={`flex-1 text-zinc-50`}
                      value={item.value}
                      onChange={(v) => {
                        resumeData.content.baseInfo.list[index].value = v;
                        updateResume(resumeData);
                      }}
                    />
                  </Fragment>
                </DelGroup>
              );
            })}
            {!readOnly && <PlusBtn className={'text-white'} onClick={onCreateBaseInfo} />}
          </div>
          {resumeData.content.avatar.show && (
            <div className={'relative'} style={{ width: resumeData.content.avatar.width }}>
              <div className={'absolute right-0 top-[-50px]'}>
                <HeaderPhoto hasEdit />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
