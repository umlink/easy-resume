import { EditModeType } from '@/components/QuillResumeEditor';
import { getResumeTemplate } from '@/constants/template-data';
import { IResumeData } from '@/pages/EditorOpt/ResumeInterface';
import { createContext } from 'react';

type ResumeCtxType = {
  resumeData: IResumeData;
  readOnly: boolean;
  contrastColor: string;
  updateResume: (v: IResumeData) => void;
  toggleReadonly?: (v: boolean) => void;
  luma?: number;
  editMode?: EditModeType;
  updateEditMode?: (v: EditModeType) => void;
  editContentTitleId?: string;
  updateEditContentTitleId?: (v: string) => void;
};

const defaultData = getResumeTemplate();
export const ResumeDataContext = createContext<ResumeCtxType>({
  resumeData: defaultData,
  updateResume: (v) => console.log(v),
  contrastColor: '#111',
  readOnly: false,
  editMode: 'snow',
});
