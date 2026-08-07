import { ResumeDataContext } from '@/context';
import { IContent } from '@/pages/EditorOpt/ResumeInterface';
import { Popover, Checkbox, Button } from 'antd';
import { useState, useContext, useEffect } from 'react';
import { CloseSmall, Tips } from '@icon-park/react';

const CheckboxGroup = Checkbox.Group;

const getPlainOptions = (exclude: string[]) => {
  return [
    {
      label: '加粗',
      value: 'font-bold',
    },
    {
      label: '浅色',
      value: 'text-zinc-500',
    },
    {
      label: '撑满',
      value: 'flex-1',
    },
    {
      label: '居中',
      value: 'text-center',
      disabled: exclude.includes('center'),
    },
    {
      label: '放大',
      value: 'text-[16px]',
    },
    {
      label: '缩小',
      value: '!text-[14px]',
    },
  ];
};

type ConfigItemType = {
  label: string;
  key: string;
  checkedList: string[];
  plainOptions: { label: string; value: string }[];
};

type PropsType = {
  readOnly: boolean;
  children: JSX.Element;
  content: IContent;
  onChange: (content: IContent) => void;
};

type TypeClassKey = 'titleClass' | 'subTitleClass' | 'timeClass';

export default (props: PropsType) => {
  const { content, readOnly, onChange } = props;
  const { resumeData, updateResume, editContentTitleId, updateEditContentTitleId } = useContext(ResumeDataContext);
  const [open, setOpen] = useState(false);
  const [configList, setConfigList] = useState<ConfigItemType[]>([
    {
      label: '标题 1',
      key: 'titleClass',
      checkedList: content.titleClass || ['flex-1', 'font-bold'],
      plainOptions: getPlainOptions(['center']),
    },
    {
      label: '标题 2',
      key: 'subTitleClass',
      checkedList: content.subTitleClass || ['flex-1', 'text-center'],
      plainOptions: getPlainOptions([]),
    },
    {
      label: '标题 3',
      key: 'timeClass',
      checkedList: content.timeClass || ['flex-1'],
      plainOptions: getPlainOptions(['center']),
    },
  ]);

  const onCheckboxChange = (checkedList: string[], index: number) => {
    configList[index].checkedList = checkedList;
    setConfigList([...configList]);
    const tempContent = { ...content };
    configList.forEach((item) => {
      tempContent[item.key as TypeClassKey] = item.checkedList;
    });
    onChange(tempContent);
  };
  const lineItemClass = `space-x-3 flex items-center`;
  const itemTitleClass = `inline-block w-[44px] font-bold`;

  useEffect(() => {
    setOpen(editContentTitleId === content.id);
  }, [editContentTitleId]);

  const onSyncConfig = () => {
    resumeData.content.entryList.forEach((item) => {
      item.contentList.forEach((ct) => {
        ct.titleClass = content.titleClass;
        ct.subTitleClass = content.subTitleClass;
        ct.timeClass = content.timeClass;
      });
    });
    updateResume(resumeData);
  };

  const onClose = () => {
    setOpen(false);
    updateEditContentTitleId?.('');
  };

  if (readOnly) return props.children;

  return (
    <div className={'group/cTitle'}>
      <Popover
        open={open}
        arrow={false}
        title={
          <div className={'border-b-100 flex items-center justify-between border-b px-2 py-1.5'}>
            <span className={'space-x-2'}>
              <span className={'text-[16px] font-bold'}>内容标题配置</span>
              <Button
                icon={<Tips fill={'#F7BA1E'} strokeWidth={5} />}
                size={'small'}
                type={'text'}
                onClick={onSyncConfig}
              >
                一键同步：<span className={'g-line-bg-text'}>将当前配置设置到其他内容标题</span>
              </Button>
            </span>
            <Button
              size={'small'}
              type={'text'}
              icon={<CloseSmall theme="outline" size="20" fill="#666" />}
              onClick={onClose}
            />
          </div>
        }
        placement={'bottomLeft'}
        overlayClassName={'shadow-lg p-1'}
        overlayInnerStyle={{ padding: 0, borderRadius: 4, outline: '#111 1px solid', outlineOffset: 1 }}
        content={
          <div className={'space-y-2 p-4 pt-2'}>
            {configList.map((item, index) => {
              return (
                <div className={lineItemClass} key={index}>
                  <span className={itemTitleClass}>{item.label}</span>
                  <CheckboxGroup
                    options={item.plainOptions}
                    value={item.checkedList}
                    onChange={(vals) => onCheckboxChange(vals, index)}
                  />
                </div>
              );
            })}
          </div>
        }
      >
        {props.children}
      </Popover>
    </div>
  );
};
