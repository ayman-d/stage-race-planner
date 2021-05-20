import React, { useEffect, useState } from "react";
import { IStageRace } from "../../types";
import { getStageRaces, deleteStageRace } from "../../api";
import { StageRaceListGroupItem } from "../shared/stage-race-list-group";
import {
  LoadingSpinner,
  PrimaryButton,
  ErrorOverlay,
  Modal,
} from "../../components/shared";
import FormContainer from "./FormContainer";

const RaceList: React.FC = () => {
  const stageRaces: IStageRace[] = [];

  const [loading, setLoading] = useState(true);
  const [races, setRaces] = useState(stageRaces);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchRaceData();
  }, []);

  // get data from API and set loading state
  const fetchRaceData = () => {
    getStageRaces()
      .then((data) => {
        sortDataByEarliestDate(data);
      })
      .catch((err) => {
        setError(true);
        setErrorMessage("Error loading stage races");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // sort the races from oldest to newest
  const sortDataByEarliestDate = (races: IStageRace[]) => {
    setRaces(
      races.sort((a, b) => {
        return (
          Date.parse(findEarliestDate(a.stages.map((stage) => stage.date))) -
          Date.parse(findEarliestDate(b.stages.map((stage) => stage.date)))
        );
      })
    );
  };

  // find the earliest date in a list of stage races dates for a single race record
  const findEarliestDate = (dates: string[]) => {
    const sortedDates = dates.sort((a, b) => {
      return Date.parse(a) - Date.parse(b);
    });

    return sortedDates[0];
  };

  // find the duration of the race - earliest date subtracted from the latest
  const findDuration = (dates: string[]) => {
    const sortedDates = dates.sort((a, b) => {
      return Date.parse(a) - Date.parse(b);
    });

    const lastDateIndex = sortedDates.length - 1;

    const duration = (
      (Date.parse(sortedDates[lastDateIndex]) - Date.parse(sortedDates[0])) /
        86400000 +
      1
    ).toString();

    return duration + (duration === "1" ? " day" : " days");
  };

  // delete a race with its stages
  const handleRaceDelete = (id: number) => {
    deleteStageRace(id)
      .then((data) => {
        fetchRaceData();
      })
      .catch((err) => {
        setError(true);
        setErrorMessage("Error deleting stage race");
      });
  };

  if (loading) {
    return <LoadingSpinner />;
  } else {
    if (error) {
      return (
        <ErrorOverlay
          error={errorMessage}
          clearError={() => {
            setError(false);
            setErrorMessage("");
          }}
        />
      );
    } else {
      return (
        <div>
          {races.length === 0 && <p>No stage races</p>}

          {races.map((race: IStageRace) => (
            <StageRaceListGroupItem
              key={race.id}
              id={race.id}
              name={race.name}
              date={findEarliestDate(
                race.stages.map((raceStage) => raceStage.date)
              )}
              duration={findDuration(
                race.stages.map((raceStage) => raceStage.date)
              )}
              onDelete={() => {
                handleRaceDelete(race.id);
              }}
            />
          ))}

          <br />
          <PrimaryButton onClick={() => setModalOpen(true)}>
            Add Stage Race
          </PrimaryButton>
          <Modal isOpen={modalOpen}>
            <FormContainer
              setModalOpen={setModalOpen}
              findDuration={findDuration}
              fetchRaceData={fetchRaceData}
              setErrorMessage={setErrorMessage}
            />
          </Modal>
        </div>
      );
    }
  }
};

export default RaceList;
