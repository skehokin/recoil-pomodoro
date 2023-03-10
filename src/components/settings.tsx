import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Box, Button, Center, Heading } from "@chakra-ui/react";

import { Timer, timerIds, timers } from "../data/timer-data";
import { TimerSettingsForm } from "./timer-settings-form";

// This is the settings section, where I can add new timers and edit existing ones
// For the sake of the demo, it's quite separate from the individual timer display

export function Settings() {
  // You need to provide your own id to create a new atom
  const newTimerId = crypto.randomUUID();

  // then we can use the id to access the new timer,
  // which is created with the default values we set
  // Here I'm using the `timers` selector I created:
  const [_timer, setTimer] = useRecoilState(timers(newTimerId));

  // I could also have used timerFamily directly here, which would look like this:
  // const [_timer, setTimer] = useRecoilState(timerFamily(newTimerId));

  // I also need the list of ids to map over them below, but I don't need to set them
  const ids = useRecoilValue(timerIds);

  // (here I'm accessing the most recent timer to set the values for the new timer)
  // (note I'm using the read-only hook here - but this still subscribes to the atom.
  // I have an idea about not subscribing by building the default values into the selector
  // but it's not important for the talk)
  const lastTimer = useRecoilValue(timers(ids[ids.length - 1]));

  // The button runs setTimer with my initial values
  // it updates the new timer atom and adds the new timer to the list of timers
  // (which then renders the timer settings form)
  const addTimer = () => {
    const newTimer: Timer = {
      id: newTimerId,
      goal: "",
      ...(ids.length && lastTimer.role === "work"
        ? {
            role: "rest",
            minutes: 5,
          }
        : {
            role: "work",
            minutes: 25,
          }),
    };
    setTimer(newTimer);
  };

  return (
    <Box
      width={"300px"}
      background={"gray.100"}
      p={4}
      m={4}
      height={"95vh"}
      overflowY={"scroll"}
      color={"gray.600"}
    >
      <Center>
        <Heading size={"lg"} mb={4}>
          Settings
        </Heading>
      </Center>

      {ids.map((id) => (
        <TimerSettingsForm id={id} key={`timer-settings-${id}`} />
      ))}

      <Center>
        <Button onClick={addTimer} bg={"gray.3??00"}>
          Add timer
        </Button>
      </Center>
    </Box>
  );
}
