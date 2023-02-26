import * as React from "react";
import { useRecoilState, useRecoilStateLoadable } from "recoil";
import {
  Flex,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
} from "@chakra-ui/react";

import { timers, Roles } from "../data/timer-data";

export function TimerSettingsForm({ id }: { id: string }) {
  // Each of the timers are individually subscribed to their own atoms:
  const [timer, setTimer] = useRecoilStateLoadable(timers(id));

  // if (timer.state === "loading" || timer.state === "hasError") {
  //   console.log(timer);
  //   return null;
  // }
  // I'm using the timer atom to store the form state.
  return (
    <Flex
      flexDirection={"column"}
      rowGap={6}
      mb={12}
      color={timer.contents.isRunning ? "gray.400" : "gray.600"}
    >
      <Heading size={"md"}>
        {timer.contents.role === "work" ? "Work session" : "Break time"}
      </Heading>

      <label>
        Role
        <Select
          placeholder="Select role"
          value={timer.contents.role}
          disabled={timer.contents.isRunning}
          onChange={(e) => {
            setTimer((prev) => ({ ...prev, role: e.target.value as Roles }));
          }}
        >
          <option value="work">Work</option>
          <option value="rest">Rest</option>
        </Select>
      </label>

      {timer.contents.role === "work" && (
        <label>
          Goal
          <Input
            value={timer.contents.goal}
            onChange={(e) =>
              setTimer((prev) => ({ ...prev, goal: e.target.value }))
            }
            disabled={timer.contents.isRunning}
          />
        </label>
      )}
      <label>
        Minutes
        <NumberInput
          value={timer.contents.minutes}
          onChange={(string, number) =>
            setTimer((prev) => ({ ...prev, minutes: number }))
          }
        >
          <NumberInputField disabled={timer.contents.isRunning} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </label>
    </Flex>
  );
}
