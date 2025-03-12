/* eslint-disable @typescript-eslint/indent */
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface StepOneData {
  organizerType: string;
  organizerName: string;
  organizerEmail: string;
  phone: string;
  link: string;
  organizerPhotoFile: File | null;
  photoUrl: string | null;
}

interface StepTwoData {
  title: string;
  categoryId: string;
  opportunityType: string;
  assistanceType: string;
  target: string | number;
  region: string;
  address: string;
  startHour: string;
  startingDate: Date | null | string;
  formattedStartingDate: string;
  endingDate: Date | null | string;
  formattedEndingDate: string;
  startMinute: string;
  endHour: string;
  endMinute: string;
  startPeriod: string;
  endPeriod: string;
  timeDemands: string;
  skills: string;
}

type DocumentType = {
  file: File | null;
  id: string;
};

interface StepThreeData {
  coverImageFile: File | null;
  coverUrl: string;
  description: string;
  descriptionLink: string;
  documentFile: DocumentType[];
}

interface OpportunityContextType {
  stepOneData: StepOneData;
  setStepOneData: React.Dispatch<React.SetStateAction<StepOneData>>;
  stepTwoData: StepTwoData;
  setStepTwoData: React.Dispatch<React.SetStateAction<StepTwoData>>;
  stepThreeData: StepThreeData;
  setStepThreeData: React.Dispatch<React.SetStateAction<StepThreeData>>;
  resetOpportunityData: () => void;
}

const OpportunityContext = createContext<OpportunityContextType | undefined>(
  undefined,
);

const initialStepOneData: StepOneData = {
  organizerType: '',
  organizerName: '',
  organizerEmail: '',
  phone: '',
  link: '',
  organizerPhotoFile: null,
  photoUrl: null,
};

const initialStepTwoData: StepTwoData = {
  title: '',
  categoryId: '',
  opportunityType: '',
  assistanceType: '',
  target: '',
  region: '',
  address: '',
  startingDate: null,
  formattedStartingDate: '',
  endingDate: null,
  formattedEndingDate: '',
  startHour: '',
  startMinute: '',
  endHour: '',
  endMinute: '',
  startPeriod: 'AM',
  endPeriod: 'AM',
  timeDemands: '',
  skills: '',
};

const initialStepThreeData: StepThreeData = {
  coverImageFile: null,
  coverUrl: '',
  description: '',
  descriptionLink: '',
  documentFile: [],
};

export const OpportunityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stepOneData, setStepOneData] = useLocalStorage<StepOneData>(
    'stepOneData',
    initialStepOneData,
  );

  const [stepTwoData, setStepTwoData] = useLocalStorage<StepTwoData>(
    'stepTwoData',
    initialStepTwoData,
  );

  const [stepThreeData, setStepThreeData] = useLocalStorage<StepThreeData>(
    'stepThreeData',
    initialStepThreeData,
  );

  const resetOpportunityData = useCallback(() => {
    setStepOneData(initialStepOneData);
    setStepTwoData(initialStepTwoData);
    setStepThreeData(initialStepThreeData);
  }, [setStepOneData, setStepTwoData, setStepThreeData]);

  const value = useMemo(
    () => ({
      stepOneData,
      setStepOneData: setStepOneData as React.Dispatch<
        React.SetStateAction<StepOneData>
      >,
      stepTwoData,
      setStepTwoData: setStepTwoData as React.Dispatch<
        React.SetStateAction<StepTwoData>
      >,
      stepThreeData,
      setStepThreeData: setStepThreeData as React.Dispatch<
        React.SetStateAction<StepThreeData>
      >,
      resetOpportunityData,
    }),
    [
      stepOneData,
      setStepOneData,
      stepTwoData,
      setStepTwoData,
      stepThreeData,
      setStepThreeData,
      resetOpportunityData,
    ],
  );

  return (
    <OpportunityContext.Provider value={value}>
      {children}
    </OpportunityContext.Provider>
  );
};

export const useOpportunityContext = () => {
  const context = useContext(OpportunityContext);

  if (!context) {
    throw new Error(
      'useOpportunityContext must be used within an OpportunityProvider',
    );
  }

  return context;
};
