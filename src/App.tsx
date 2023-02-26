import "./App.css";
import { Screen } from "./screens/screen";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
      <ChakraProvider>
        <Screen />
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
