import { ResumeDataContext } from '@/context';
import { IContent } from '@/interface/resume';
import AiOptContentResult from '@/pages/Editor/components/AiOptContentResult';
import PopupCloseIcon from '@/pages/Editor/components/PopupCloseIcon';
import { Optimize } from '@icon-park/react';
import { useModel } from '@umijs/max';
import { Space } from 'antd';
import { Button, Checkbox, Input, Popup } from 'antd-mobile';
import { useContext, useState } from 'react';

type PropsType = {
  pIndex: number;
  index: number;
  contentInfo: IContent;
};

const defaultStrategy = [
  '使用主动语气',
  '内容格式更加专业',
  '不需要返回优化说明',
  '保持内容的简洁清晰',
  '突出关键成就和技能',
  '保持原有信息的完整性',
  '使用更专业的词汇和表达方式',
  '成果类工作内容添加明确的指标优化',
];
export default (props: PropsType) => {
  const { pIndex, index, contentInfo } = props;
  const { resumeData } = useContext(ResumeDataContext);
  const { globalData } = useModel('global');
  const [open, setOpen] = useState(false);
  const [keywords, setKeywords] = useState<string>('');
  const [optList, setOptList] = useState([...defaultStrategy]);

  const addStrategy = () => {
    optList.push(keywords);
    setOptList([...optList]);
    setKeywords('');
  };

  return (
    <>
      <Popup
        closeIcon={<PopupCloseIcon />}
        showCloseButton
        visible={open}
        destroyOnClose={false}
        bodyStyle={{ height: '70vh' }}
        onMaskClick={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <div className={'p-4 space-y-2 h-full overflow-y-auto border-t border-t-zinc-100'}>
          <div className={'flex items-center space-x-1 text-[16px]'}>
            <span className={'text-primary'}>
              <Optimize theme="outline" size="22" />
            </span>
            <b className={'g-line-bg-text'}>智能优化当前模块内容</b>
          </div>
          <div className={'py-1 text-zinc-500'}>
            {!globalData.vipInfo?.optTokens && (
              <div className={'ml-4 flex items-center space-x-1'}>
                <p className={'text-amber-500'}>可通过续费会员继续使用</p>
                <span>续费</span>
              </div>
            )}
            {!!globalData.vipInfo?.optTokens && (
              <div>
                剩余额度：{globalData.vipInfo?.optTokens}，本次消耗约：
                {resumeData.content.entryList[pIndex].contentList[index].content.length * 1.5}
              </div>
            )}
          </div>
          <div>
            <div className={'flex items-center space-x-2 mb-5'}>
              <Input
                value={keywords}
                className={'flex-1 bg-zinc-50 px-2 py-1 rounded border border-zinc-200'}
                onChange={(v) => setKeywords(v)}
                placeholder={'输入自定义优化方案'}
              />
              <Button size={'middle'} color={'default'} onClick={addStrategy}>
                <span className={'flex text-[14px]'}>添加</span>
              </Button>
            </div>
            <Checkbox.Group
              value={optList}
              onChange={(v) => {
                setOptList(v as string[]);
              }}
            >
              <Space direction="vertical">
                {optList.map((item) => (
                  <Checkbox key={item} value={item}>
                    {item}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </div>
          <div className={'fixed inset-x-0 bottom-0 p-4'}>
            <AiOptContentResult contentInfo={contentInfo} pIndex={pIndex} index={index} keywords={optList}>
              <Button color={'primary'} size={'middle'} shape={'rounded'} block onClick={() => setOpen(false)}>
                开始优化
              </Button>
            </AiOptContentResult>
          </div>
        </div>
      </Popup>
      <span
        className={'p-1 flex items-center bg-primary-50 text-primary rounded'}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Optimize theme="outline" size="18" />
        <b className={'text-[12px] whitespace-nowrap'}>Ai一键优化</b>
      </span>
    </>
  );
};
