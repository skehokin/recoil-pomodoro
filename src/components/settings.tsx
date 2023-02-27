import * as React from "react";
import { useRecoilStateLoadable, useRecoilValue } from "recoil";
import { Box, Button, Center, Heading } from "@chakra-ui/react";

import { Roles, timerIds, timers } from "../data/timer-data";
import { TimerSettingsForm } from "./timer-settings-form";
import { Suspense } from "react";

// This is the settings section, where I can add new timers and edit existing ones
// For the sake of the demo, it's quite separate from the individual timer display

export function Settings() {
  // You need to provide your own id to create a new atom
  // note: do not let your id change every render!!
  const newTimerId = React.useRef(crypto.randomUUID());
  // then we can use the id to access the new timer,
  // which is created with the default values we set
  // Here I'm using the `timers` selector I created:
  const [_timer, setTimer] = useRecoilStateLoadable(timers(newTimerId.current));

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
    const newTimer = {
      id: newTimerId.current,
      goal: "",
      // role: "work" as Roles,
      // minutes: 25,
      image: undefined,
      ...(ids.length && lastTimer.role === "work"
        ? {
            role: "rest" as Roles,
            minutes: 5,
          }
        : {
            role: "work" as Roles,
            minutes: 25,
          }),
    };
    newTimerId.current = crypto.randomUUID();
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
      <Suspense fallback={"suspense, woo"}>
        {ids.map((id) => (
          <TimerSettingsForm id={id} key={`timer-settings-${id}`} />
        ))}
      </Suspense>
      <Center>
        <Button onClick={addTimer} bg={"gray.3å00"}>
          Add timer
        </Button>
      </Center>
    </Box>
  );
}
