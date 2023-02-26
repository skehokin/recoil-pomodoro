import * as React from "react";
import { timerIds } from "../data/timer-data";
import { useRecoilValue } from "recoil";
import { Box, Flex } from "@chakra-ui/react";
import { Timer } from "./timer";

export function Timers() {
  const timers = useRecoilValue(timerIds);

  return (
    <Box>
      <Flex width={"1000px"} flexWrap={"wrap"}>
        {timers.map((id) => (
          <Timer id={id} key={`timer-${id}`} />
        ))}
      </Flex>
    </Box>
  );
}
