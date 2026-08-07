import { useModel } from '@umijs/max';
import { useEffect } from 'react';
import BaseInfo from './components/BaseInfo';
import Profile from './components/Profile';
import ResumeList from './components/ResumeList';

export default () => {
  const { state, setState } = useModel('User.model');
  useEffect(() => {
    return () => setState({ isEdit: false });
  }, []);
  return (
    <div className={'flex justify-between md:space-x-4'}>
      <BaseInfo />
      <div className={'relative flex-1 pb-[20px]'}>{state.isEdit ? <Profile /> : <ResumeList />}</div>
    </div>
  );
};
