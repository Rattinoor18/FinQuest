import React from 'react';
import { AureliusVideoStudio } from '../components/AureliusVideoStudio';
import { LabType, PageRoute } from '../types';

interface VoiceAIPageProps {
  onTriggerLab: (labId: LabType) => void;
  onNavigate: (page: PageRoute) => void;
}

export const VoiceAIPage: React.FC<VoiceAIPageProps> = ({ onTriggerLab, onNavigate }) => {
  return (
    <div className="py-4">
      <AureliusVideoStudio
        onTriggerLab={onTriggerLab}
      />
    </div>
  );
};

export default VoiceAIPage;
