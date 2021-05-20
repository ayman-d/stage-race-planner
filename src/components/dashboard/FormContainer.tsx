import React, { useEffect, useState } from "react";
import { addStageRace } from "../../api";

import AddStage from "./AddStage";
import AddStageRace from "./AddStageRace";

import { ErrorOverlay } from "../shared";
import { IStage, IProvisionalStageRace } from "../../types";

interface FormContainertProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  findDuration: (dates: string[]) => string;
  fetchRaceData: () => void;
  setErrorMessage: (message: string) => void;
}

const FormContainer: React.FC<FormContainertProps> = ({
  setModalOpen,
  findDuration,
  fetchRaceData,
  setErrorMessage,
}) => {
  const stageRaces: IStage[] = [];

  const [newStages, setNewStages] = useState(stageRaces);
  const [newStageRaceName, setNewStageRaceName] = useState("");

  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    sortStages();
  }, [newStageRaceName, newStages]);

  const sortStages = () => {
    newStages.sort((a, b) => {
      return Date.parse(a.date) - Date.parse(b.date);
    });
  };

  const handleSubmit = () => {
    const newProvisionalStageRace: IProvisionalStageRace = {
      name: newStageRaceName,
      stages: newStages,
    };

    addStageRace(newProvisionalStageRace)
      .then((data) => {
        setModalOpen(false);
      })
      .catch((err) => {
        setError(true);
        setErrorMessage("Error adding stage race");
      });
  };

  const handleStageDelete = (id: string) => {
    setNewStages((prevValues) => {
      return prevValues.filter((value) => value.id !== id);
    });
  };

  if (error) {
    return (
      <ErrorOverlay
        error="Error adding stage race"
        clearError={() => setError(false)}
      />
    );
  } else {
    return (
      <div>
        {stageModalOpen && (
          <AddStage
            setStageModalOpen={setStageModalOpen}
            setNewStages={setNewStages}
            sortStages={sortStages}
          />
        )}

        {!stageModalOpen && (
          <AddStageRace
            setModalOpen={setModalOpen}
            newStages={newStages}
            setNewStageRaceName={setNewStageRaceName}
            newStageRaceName={newStageRaceName}
            setStageModalOpen={setStageModalOpen}
            handleStageDelete={handleStageDelete}
            handleSubmit={handleSubmit}
            findDuration={findDuration}
            fetchRaceData={fetchRaceData}
          />
        )}
      </div>
    );
  }
};

export default FormContainer;
