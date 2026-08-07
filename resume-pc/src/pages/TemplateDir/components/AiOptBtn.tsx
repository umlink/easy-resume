import VipByModal from '@/components/VipContainer/VipByModal';
import { ResumeDataContext } from '@/context';
import { AI_ENABLED, VIP_ENABLED } from '@/constants/feature-flags';
import { Magic } from '@icon-park/react';
import { useModel } from '@umijs/max';
import { Button, Checkbox, Col, Input, Popconfirm, Row } from 'antd';
import { useContext, useState } from 'react';

const CheckboxGroup = Checkbox.Group;

type PropsType = {
  pIndex: number;
  sIndex: number;
  optLoading: boolean;
  createAiTask: (optStr: string) => void;
};

const defaultStrategy = [
  '使用主动语气',
  '内容格式更加专业',
  '保持内容的简洁清晰',
  '突出关键成就和技能',
  '保持原有信息的完整性',
  '使用更专业的词汇和表达方式',
  '成果类工作内容添加明确的指标优化',
];

const magicStyle = { color: '#c026d3', display: 'flex' };

export default ({ pIndex, sIndex, createAiTask, optLoading }: PropsType) => {
  const { globalData } = useModel('global');
  const [keywords, setKeywords] = useState<string>('');
  const { resumeData } = useContext(ResumeDataContext);
  const [plainOptions, setPlainOptions] = useState<string[]>(defaultStrategy);

  const [checkedList, setCheckedList] = useState<string[]>(plainOptions);

  if (!AI_ENABLED) return null;

  const onChange = (list: string[]) => setCheckedList(list);
  const onOpenChange = (open: boolean) => {
    if (!open) {
      setPlainOptions(defaultStrategy);
      setCheckedList(defaultStrategy);
      setKeywords('');
    }
  };
  const onConfirm = () => {
    const optStr = checkedList.reduce((pre, next, index) => {
      return `${pre}\n ${index + 2}. ${next}`;
    }, '');
    createAiTask(optStr);
  };
  const addStrategy = () => {
    setPlainOptions(plainOptions.concat(keywords));
    setCheckedList(checkedList.concat(keywords));
    setKeywords('');
  };

  const disabled = VIP_ENABLED && !globalData.vipInfo?.optTokens;

  return (
    <Popconfirm
      title={
        <div className={'flex items-center'}>
          <span>一键优化当前模块内容</span>
          {VIP_ENABLED && !globalData.vipInfo?.optTokens && (
            <div className={'ml-4 flex items-center space-x-1'}>
              <p className={'text-amber-500'}>可通过续费会员继续使用</p>
              <VipByModal>
                <Button size={'small'} shape={'round'} color={'primary'} variant="outlined">
                  续费
                </Button>
              </VipByModal>
            </div>
          )}
          {VIP_ENABLED && !!globalData.vipInfo?.optTokens && (
            <span>
              （剩余额度：{globalData.vipInfo?.optTokens}，本次消耗约：
              {resumeData.content.entryList[pIndex].contentList[sIndex].content.length * 1.5}）
            </span>
          )}
        </div>
      }
      className={'flex'}
      description={
        <div className={'mt-3 flex items-center justify-between border-t border-t-zinc-100 pt-3'}>
          <div className={'w-[420px] space-y-2'}>
            {!disabled && (
              <div className={'flex items-center space-x-1'}>
                <Input
                  autoFocus
                  value={keywords}
                  placeholder="自定义优化策略(如：补充前端技术能力/技术栈)"
                  variant="filled"
                  onPressEnter={() => addStrategy()}
                  onChange={(e) => setKeywords(e.target.value)}
                />
                <Button onClick={addStrategy}>添加</Button>
              </div>
            )}
            <CheckboxGroup disabled={disabled} value={checkedList} onChange={onChange} className={''}>
              <Row>
                {plainOptions.map((item) => {
                  return (
                    <Col span={24} key={item}>
                      <Checkbox value={item}>{item}</Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </CheckboxGroup>
          </div>
        </div>
      }
      onConfirm={onConfirm}
      onOpenChange={onOpenChange}
      placement="rightBottom"
      okText="开始优化"
      okButtonProps={{ disabled: disabled }}
      cancelText="取消"
    >
      <Button
        shape={'round'}
        loading={optLoading}
        className={'shadow-md'}
        size={'small'}
        icon={<Magic style={magicStyle} strokeWidth={6} />}
      >
        <span style={magicStyle}>
          <b>AI</b>一键优化
        </span>
      </Button>
    </Popconfirm>
  );
};
