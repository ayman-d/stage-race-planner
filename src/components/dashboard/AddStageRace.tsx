import React, { useState, useEffect } from "react";

import {
  FormInputGroup,
  ButtonWrapper,
  SuccessOutlineButton,
  DangerOutlineButton,
  StageRaceFormStageListGroupItem,
  SecondaryOutlineButton,
  StageRaceFormTotals,
} from "../../components/shared";

import { IStage } from "../../types";

export interface AddStageRaceProps {
  setModalOpen: Function;
  setNewStageRaceName: Function;
  newStageRaceName: string;
  newStages: IStage[];
  setStageModalOpen: Function;
  handleStageDelete: Function;
  handleSubmit: Function;
  findDuration: Function;
  fetchRaceData: Function;
}

const AddStageRace: React.FC<AddStageRaceProps> = ({
  setModalOpen,
  setNewStageRaceName,
  newStageRaceName,
  newStages,
  setStageModalOpen,
  handleStageDelete,
  handleSubmit,
  findDuration,
  fetchRaceData,
}) => {
  const [addDisabled, setAddDisabled] = useState(true);
  const [saveDisabled, setSaveDisabled] = useState(true);

  useEffect(() => {
    if (newStageRaceName !== "") {
      setAddDisabled(false);
    } else {
      setAddDisabled(true);
    }

    if (newStages.length > 0 && newStageRaceName !== "") {
      setSaveDisabled(false);
    } else {
      setSaveDisabled(true);
    }

    return () => {
      fetchRaceData();
    };
  }, [newStageRaceName, newStages]);

  return (
    <div>
      <h3>Add Stage Race</h3>
      <FormInputGroup
        id="name"
        label=""
        type="text"
        value={newStageRaceName}
        placeholder="Enter stage race name"
        onChange={(e) => {
          setNewStageRaceName(e.target.value);
        }}
      />
      <h3>Stages</h3>
      {newStages.length === 0 && <p>No stages</p>}
      {newStages.map((stage, index) => (
        <StageRaceFormStageListGroupItem
          key={stage.id}
          id={stage.id}
          date={stage.date}
          name={stage.name}
          onDelete={() => handleStageDelete(stage.id)}
        />
      ))}
      <br />
      <StageRaceFormTotals
        duration={
          newStages.length === 0
            ? "0 days"
            : findDuration(newStages.map((stage) => stage.date))
        }
      />
      <ButtonWrapper>
        <SecondaryOutlineButton
          disabled={addDisabled}
          onClick={() => {
            setStageModalOpen(true);
          }}
        >
          Add Stage
        </SecondaryOutlineButton>
        <SuccessOutlineButton
          disabled={saveDisabled}
          onClick={() => handleSubmit()}
        >
          Save
        </SuccessOutlineButton>
        <DangerOutlineButton onClick={() => setModalOpen(false)}>
          Cancel
        </DangerOutlineButton>
      </ButtonWrapper>
    </div>
  );
};

export default AddStageRace;
