import { Container } from "./shared";
import RaceList from "../components/dashboard/RaceList";

const App = () => {
  return (
    <Container>
      <h1 className="mb-3">Stage Races</h1>

      <RaceList />
    </Container>
  );
};

export default App;
