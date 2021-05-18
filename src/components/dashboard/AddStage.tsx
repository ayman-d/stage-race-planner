import React, { useState, useEffect } from "react";
import uniqid from "uniqid";

import {
  FormInputGroup,
  ButtonWrapper,
  SuccessOutlineButton,
  DangerOutlineButton,
} from "../../components/shared";

import { IProvisionalStageRace } from "../../types";

export interface AddStageProps {
  setStageModalOpen: Function;
  setNewStages: Function;
  sortStages: Function;
}

const AddStage: React.FC<AddStageProps> = ({
  setStageModalOpen,
  setNewStages,
  sortStages,
}) => {
  const [stageSaveDisabled, setStageSaveDisabled] = useState(true);
  const [stageName, setStageName] = useState("");
  const [stageDate, setStageDate] = useState("");

  useEffect(() => {
    if (stageName === "" || stageDate === "") {
      setStageSaveDisabled(true);
    } else {
      setStageSaveDisabled(false);
    }
  }, [stageName, stageDate]);

  const handleSubmit = () => {
    setNewStages((prevValues: IProvisionalStageRace[]) => {
      return [
        { id: uniqid(), name: stageName, date: stageDate },
        ...prevValues,
      ];
    });
    sortStages();
    setStageModalOpen(false);
  };

  return (
    <div>
      <FormInputGroup
        id="name"
        label="Name"
        type="text"
        onChange={(e) => setStageName(e.target.value)}
      />
      <FormInputGroup
        id="date"
        label="Date"
        type="date"
        onChange={(e) => setStageDate(e.target.value)}
      />
      <ButtonWrapper>
        <SuccessOutlineButton
          disabled={stageSaveDisabled}
          onClick={handleSubmit}
        >
          Save
        </SuccessOutlineButton>
        <DangerOutlineButton onClick={() => setStageModalOpen(false)}>
          Cancel
        </DangerOutlineButton>
      </ButtonWrapper>
    </div>
  );
};

export default AddStage;
