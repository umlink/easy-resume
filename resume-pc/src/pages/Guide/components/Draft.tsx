import { getDraftGuideList } from '@/api/Guide';
import { Popover } from 'antd';
import { useEffect, useState } from 'react';

const GuideDraft = ({ onSelect }: { onSelect: (v: API.GuideItemVO) => void }) => {
  const [draftList, setDraftList] = useState<API.GuideItemVO[]>([]);
  useEffect(() => {
    getDraftGuideList({ pageNum: 1, pageSize: 10 }).then((res) => {
      if (res.success) {
        setDraftList(res.data.list);
      }
    });
  }, []);
  if (!draftList.length) return null;
  return (
    <Popover
      trigger={['click']}
      overlayInnerStyle={{ padding: 4 }}
      content={
        <div className={'w-[200px]'}>
          {draftList.map((item) => (
            <p className={'cursor-pointer p-1 hover:bg-zinc-50'} onClick={() => onSelect(item)} key={item.id}>
              {item.title}
            </p>
          ))}
        </div>
      }
    >
      <span className={'cursor-pointer'}>草稿列表</span>
    </Popover>
  );
};

export default GuideDraft;
